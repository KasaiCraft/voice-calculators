import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ClearIcon from '@mui/icons-material/Clear';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HistoryIcon from '@mui/icons-material/History';
import CalculateIcon from '@mui/icons-material/Calculate';
import { keyframes } from '@mui/system';
import AdSense from './components/AdSense';
import ManualCalculator from './components/ManualCalculator';

interface Calculation {
  expression: string;
  result: string;
  timestamp: Date;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

function App() {
  const theme = useTheme();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [calculatorMode, setCalculatorMode] = useState<'voice' | 'manual'>('voice');

  // Define the color cycling animation
  const colorCycle = keyframes`
    0% {
      background: linear-gradient(135deg, #1976d2 0%, #dc004e 100%);
    }
    25% {
      background: linear-gradient(135deg, #dc004e 0%, #4caf50 100%);
    }
    50% {
      background: linear-gradient(135deg, #4caf50 0%, #ff9800 100%);
    }
    75% {
      background: linear-gradient(135deg, #ff9800 0%, #9c27b0 100%);
    }
    100% {
      background: linear-gradient(135deg, #9c27b0 0%, #1976d2 100%);
    }
  `;

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setExpression(transcript);
        processExpression(transcript);
      };

      recognition.onerror = (event: Event) => {
        setError('Error occurred in speech recognition. Please try again.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  }, []);

  const processExpression = (input: string) => {
    setIsProcessing(true);
    try {
      // Convert number words to digits (English and Hindi)
      const numberWords: { [key: string]: string } = {
        // English numbers
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
        'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
        'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
        'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
        'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
        'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000',
        'million': '1000000', 'billion': '1000000000',
        // Negative numbers in English
        'negative one': '-1', 'negative two': '-2', 'negative three': '-3',
        'negative four': '-4', 'negative five': '-5', 'negative six': '-6',
        'negative seven': '-7', 'negative eight': '-8', 'negative nine': '-9',
        'negative ten': '-10', 'negative eleven': '-11', 'negative twelve': '-12',
        'negative thirteen': '-13', 'negative fourteen': '-14', 'negative fifteen': '-15',
        'negative sixteen': '-16', 'negative seventeen': '-17', 'negative eighteen': '-18',
        'negative nineteen': '-19', 'negative twenty': '-20', 'negative thirty': '-30',
        'negative forty': '-40', 'negative fifty': '-50', 'negative sixty': '-60',
        'negative seventy': '-70', 'negative eighty': '-80', 'negative ninety': '-90',
        'negative hundred': '-100', 'negative thousand': '-1000',
        'negative million': '-1000000', 'negative billion': '-1000000000',
        // Hindi numbers
        'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
        'पांच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
        'दस': '10', 'ग्यारह': '11', 'बारह': '12', 'तेरह': '13',
        'चौदह': '14', 'पंद्रह': '15', 'सोलह': '16', 'सत्रह': '17',
        'अठारह': '18', 'उन्नीस': '19', 'बीस': '20',
        // Negative numbers in Hindi
        'ऋणात्मक एक': '-1', 'ऋणात्मक दो': '-2', 'ऋणात्मक तीन': '-3',
        'ऋणात्मक चार': '-4', 'ऋणात्मक पांच': '-5', 'ऋणात्मक छह': '-6',
        'ऋणात्मक सात': '-7', 'ऋणात्मक आठ': '-8', 'ऋणात्मक नौ': '-9',
        'ऋणात्मक दस': '-10'
      };

      let processedInput = input.toLowerCase();
      
      // First, replace all number words with digits
      Object.entries(numberWords).forEach(([word, digit]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processedInput = processedInput.replace(regex, digit);
      });

      // Handle negative numbers in expressions
      processedInput = processedInput
        .replace(/\bminus\s+(\d+)\b/g, '-$1')  // Convert "minus 5" to "-5"
        .replace(/\bnegative\s+(\d+)\b/g, '-$1')  // Convert "negative 5" to "-5"
        .replace(/\bऋणात्मक\s+(\d+)\b/g, '-$1');  // Convert "ऋणात्मक 5" to "-5"

      // Handle complex mathematical operations (English and Hindi)
      processedInput = processedInput
        // Basic operations (English)
        .replace(/\bplus\b/g, '+')
        .replace(/\bminus\b/g, '-')
        .replace(/\binto\b/g, '*')
        .replace(/\btimes\b/g, '*')
        .replace(/\bmultiplied by\b/g, '*')
        .replace(/\bx\b/g, '*')
        .replace(/\bdivided by\b/g, '/')
        .replace(/\bequals\b/g, '=')
        // Basic operations (Hindi)
        .replace(/\bजोड़\b/g, '+')
        .replace(/\bघटा\b/g, '-')
        .replace(/\bगुणा\b/g, '*')
        .replace(/\bभाग\b/g, '/')
        .replace(/\bबराबर\b/g, '=')
        // Advanced operations (English)
        .replace(/\bsquare root of\b/g, 'Math.sqrt')
        .replace(/\bsquare root\b/g, 'Math.sqrt')
        .replace(/\broot of\b/g, 'Math.sqrt')
        .replace(/\bsquared\b/g, '**2')
        .replace(/\bcube of\b/g, '**3')
        .replace(/\bcubed\b/g, '**3')
        .replace(/\bpower of\b/g, '**')
        .replace(/\bto the power of\b/g, '**')
        .replace(/\braised to\b/g, '**')
        // Trigonometric functions with degrees (with parentheses for proper operation precedence)
        .replace(/\bsine of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bsin of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bsin\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcosine of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcos of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcos\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\btangent of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\btan of\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\btan\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        // Short forms for trigonometric functions (with parentheses)
        .replace(/\bsin\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcos\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\btan\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bsec\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(1/Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcosec\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(1/Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcot\s+(-?\d+(\.\d+)?)\s+degrees?\b/g, (match, angle) => `(1/Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        // Handle simple trig function calls without 'degrees' keyword (with parentheses)
        .replace(/\bsin\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcos\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\btan\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bsec\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(1/Math.cos(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcosec\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(1/Math.sin(${parseFloat(angle) * Math.PI / 180}))`)
        .replace(/\bcot\s+(-?\d+(\.\d+)?)\b/g, (match, angle) => `(1/Math.tan(${parseFloat(angle) * Math.PI / 180}))`)
        // Inverse trigonometric functions with degrees output (with parentheses)
        .replace(/\barc sine of\s+(-?\d+(\.\d+)?)\b/g, (match, value) => `(Math.asin(${parseFloat(value)}) * 180 / Math.PI)`)
        .replace(/\barc cosine of\s+(-?\d+(\.\d+)?)\b/g, (match, value) => `(Math.acos(${parseFloat(value)}) * 180 / Math.PI)`)
        .replace(/\barc tangent of\s+(-?\d+(\.\d+)?)\b/g, (match, value) => `(Math.atan(${parseFloat(value)}) * 180 / Math.PI)`)
        .replace(/\blog of\b/g, 'Math.log')
        .replace(/\blogarithm of\b/g, 'Math.log')
        .replace(/\bnatural log of\b/g, 'Math.log')
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\bfactorial\b/g, '!')
        .replace(/\bmodulo\b/g, '%')
        .replace(/\bmod\b/g, '%')
        .replace(/\bremainder\b/g, '%')
        // Advanced operations (Hindi)
        .replace(/\bवर्गमूल\b/g, 'Math.sqrt')
        .replace(/\bका वर्गमूल\b/g, 'Math.sqrt')
        .replace(/\bका घन\b/g, '**3')
        .replace(/\bका वर्ग\b/g, '**2')
        .replace(/\bकी घात\b/g, '**')
        .replace(/\bका साइन\b/g, 'Math.sin')
        .replace(/\bका कोसाइन\b/g, 'Math.cos')
        .replace(/\bका टैंजेंट\b/g, 'Math.tan')
        .replace(/\bका लॉग\b/g, 'Math.log')
        .replace(/\bका फैक्टोरियल\b/g, '!')
        .replace(/\bका शेष\b/g, '%')
        // Additional complex operations
        .replace(/\babsolute value of\b/g, 'Math.abs')
        .replace(/\babsolute\b/g, 'Math.abs')
        .replace(/\bround\b/g, 'Math.round')
        .replace(/\bfloor\b/g, 'Math.floor')
        .replace(/\bceiling\b/g, 'Math.ceil')
        .replace(/\brandom number\b/g, 'Math.random')
        .replace(/\brandom\b/g, 'Math.random')
        .replace(/\bmaximum of\b/g, 'Math.max')
        .replace(/\bminimum of\b/g, 'Math.min')
        .replace(/\bhyperbolic sine of\b/g, 'Math.sinh')
        .replace(/\bhyperbolic cosine of\b/g, 'Math.cosh')
        .replace(/\bhyperbolic tangent of\b/g, 'Math.tanh')
        .replace(/\bdegrees to radians\b/g, '* Math.PI / 180')
        .replace(/\bradians to degrees\b/g, '* 180 / Math.PI')
        .trim();

      console.log('Processed input:', processedInput);

      // Handle factorial
      if (processedInput.includes('!')) {
        processedInput = processedInput.replace(/(\d+)!/g, (match, num) => {
          const n = parseInt(num);
          if (n < 0) throw new Error('Factorial is not defined for negative numbers');
          if (n > 170) throw new Error('Factorial result too large');
          let factorial = 1;
          for (let i = 2; i <= n; i++) {
            factorial *= i;
          }
          return factorial.toString();
        });
      }

      // Remove '=' if present and evaluate
      const expressionToEvaluate = processedInput.replace('=', '').trim();
      console.log('Expression to evaluate:', expressionToEvaluate);

      if (!expressionToEvaluate) {
        throw new Error('Empty expression');
      }

      // Safely evaluate the expression
      const calculatedResult = new Function('Math', `return ${expressionToEvaluate}`)(Math);
      console.log('Calculated result:', calculatedResult);
      
      if (calculatedResult === undefined || isNaN(calculatedResult)) {
        throw new Error('Invalid calculation result');
      }

      // Format the result to handle very small or large numbers
      const formattedResult = Number(calculatedResult).toPrecision(10).replace(/\.?0+$/, '');
      
      setResult(formattedResult);
      
      // Add to history
      setHistory((prev: Calculation[]) => [...prev, {
        expression: input,
        result: formattedResult,
        timestamp: new Date()
      }]);

      // Speak the result
      speakResult(formattedResult);
    } catch (err) {
      console.error('Error processing expression:', err);
      setError(err instanceof Error ? err.message : 'Invalid expression. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResult = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearCalculator = () => {
    setExpression('');
    setResult('');
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(120deg, #1976d2 0%, #00eaff 40%, #9c27b0 70%, #ff9800 100%)',
          backgroundSize: '200% 200%',
          animation: 'auroraMove 16s ease-in-out infinite',
          filter: 'blur(0px) brightness(0.95)',
          opacity: 0.95,
        },
        '@keyframes auroraMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                value={calculatorMode}
                exclusive
                onChange={(e, newMode) => newMode && setCalculatorMode(newMode)}
                aria-label="calculator mode"
                sx={{
                  '& .MuiToggleButton-root': {
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: '#7ecbff',
                    background: 'rgba(20, 30, 40, 0.7)',
                    border: '1px solid #00eaff44',
                    mx: 1,
                    transition: 'all 0.3s',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0,238,255,0.15)',
                      color: '#00eaff',
                      boxShadow: '0 0 8px #00eaff55',
                    },
                  },
                }}
              >
                <ToggleButton value="voice" aria-label="voice calculator">
                  <MicIcon sx={{ mr: 1 }} /> Voice
                </ToggleButton>
                <ToggleButton value="manual" aria-label="manual calculator">
                  <CalculateIcon sx={{ mr: 1 }} /> Manual
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {calculatorMode === 'voice' ? (
              <Paper 
                elevation={24}
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(20, 30, 40, 0.85)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.5s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.45)',
                  },
                }}
              >
                <Typography 
                  variant="h5" 
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    color: '#7ecbff',
                    mb: 2,
                    letterSpacing: '0.08em',
                    textShadow: '0 0 8px #00eaff, 0 0 2px #00eaff',
                  }}
                >
                  Voice Calculator
                </Typography>
                <Box
                  sx={{
                    background: 'rgba(0, 30, 60, 0.7)',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mb: 3,
                    boxShadow: '0 0 16px 2px #00eaff44',
                    border: '1.5px solid #00eaff44',
                    fontFamily: 'Digital-7, monospace',
                    color: '#b9eaff',
                    fontSize: '2rem',
                    textAlign: 'right',
                    minHeight: '48px',
                    letterSpacing: '0.08em',
                    textShadow: '0 0 8px #00eaff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {expression || 'Say something...'}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <IconButton 
                    color={isListening ? 'error' : 'primary'}
                    onClick={startListening}
                    disabled={isProcessing}
                    sx={{
                      background: isListening ? 'rgba(255,0,0,0.1)' : 'rgba(0,238,255,0.08)',
                      boxShadow: isListening ? '0 0 16px #ff1744' : '0 0 16px #00eaff',
                      borderRadius: 2,
                      mx: 1,
                      '&:hover': {
                        background: isListening ? 'rgba(255,0,0,0.2)' : 'rgba(0,238,255,0.15)',
                        boxShadow: isListening ? '0 0 32px #ff1744' : '0 0 32px #00eaff',
                      },
                    }}
                  >
                    {isListening ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                  <IconButton 
                    color="primary"
                    onClick={clearCalculator}
                    sx={{
                      background: 'rgba(0,238,255,0.08)',
                      boxShadow: '0 0 8px #00eaff55',
                      borderRadius: 2,
                      mx: 1,
                      '&:hover': {
                        background: 'rgba(0,238,255,0.15)',
                        boxShadow: '0 0 16px #00eaff',
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
                {isProcessing && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <CircularProgress color="primary" />
                  </Box>
                )}
                {result && (
                  <Box
                    sx={{
                      background: 'rgba(0, 30, 60, 0.7)',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      mb: 2,
                      boxShadow: '0 0 16px 2px #00eaff44',
                      border: '1.5px solid #00eaff44',
                      fontFamily: 'Digital-7, monospace',
                      color: '#b9eaff',
                      fontSize: '2rem',
                      textAlign: 'right',
                      letterSpacing: '0.08em',
                      textShadow: '0 0 8px #00eaff',
                    }}
                  >
                    = {result}
                  </Box>
                )}
                {error && (
                  <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>
                )}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" color="#7ecbff" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon /> History
                  </Typography>
                  <Paper
                    elevation={12}
                    sx={{
                      background: 'rgba(20, 30, 40, 0.92)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      border: '1px solid #00eaff22',
                      borderRadius: 2,
                      maxHeight: 200,
                      overflowY: 'auto',
                      p: 1,
                    }}
                  >
                    <List>
                      {history.map((calc: Calculation, index: number) => (
                        <ListItem 
                          key={index}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            background: 'rgba(0, 30, 60, 0.5)',
                            boxShadow: '0 0 8px #00eaff33',
                            color: '#b9eaff',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              background: 'rgba(0, 30, 60, 0.8)',
                              transform: 'translateX(4px)',
                              boxShadow: '0 0 16px #00eaff',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#7ecbff', fontFamily: 'monospace' }}>
                                {calc.expression} = {calc.result}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: '#b9eaff' }}>
                                {calc.timestamp.toLocaleString()}
                              </Typography>
                            }
                          />
                          <IconButton 
                            onClick={() => speakResult(calc.result)}
                            sx={{
                              color: '#7ecbff',
                              transition: 'all 0.5s ease-in-out',
                              '&:hover': {
                                background: 'rgba(0,238,255,0.15)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <VolumeUpIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              </Paper>
            ) : (
              <ManualCalculator onResult={setResult} />
            )}
          </Box>
        </Fade>
        <Box sx={{ mt: 4 }}>
          <AdSense 
            slot="bottom-ad"
            style={{ width: '100%', margin: '0 auto' }}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default App; 