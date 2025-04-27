import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { alpha, useTheme } from '@mui/material/styles';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  toolId: string;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, toolId, placeholder }) => {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        onTranscript(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionError) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, toolId, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Failed to start speech recognition');
        console.error(err);
      }
    }
    setIsListening(!isListening);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={toggleListening}
        sx={{
          backgroundColor: isListening 
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            backgroundColor: isListening
              ? alpha(theme.palette.error.main, 0.2)
              : alpha(theme.palette.primary.main, 0.2),
          },
        }}
      >
        {isListening ? <MicOffIcon color="error" /> : <MicIcon color="primary" />}
      </IconButton>
      <Typography variant="body2" color={error ? 'error' : 'text.secondary'}>
        {error || (isListening ? 'Listening...' : placeholder || 'Click to speak')}
      </Typography>
    </Box>
  );
};

export default VoiceInput; 