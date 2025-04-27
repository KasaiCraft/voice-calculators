import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Tooltip,
  Fade,
  useTheme,
  alpha,
  IconButton,
  Divider,
  Zoom,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

interface HistoryItem {
  expression: string;
  result: string;
}

interface ManualCalculatorProps {
  onResult: (result: string) => void;
}

const ManualCalculator: React.FC<ManualCalculatorProps> = ({ onResult }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const theme = useTheme();

  const buttonStyle = {
    height: '60px',
    fontSize: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    },
  };

  const operatorButtonStyle = {
    ...buttonStyle,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '&:hover': {
      ...buttonStyle['&:hover'],
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  };

  const functionButtonStyle = {
    ...buttonStyle,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.main,
    '&:hover': {
      ...buttonStyle['&:hover'],
      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
    },
  };

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (operator: string) => {
    setDisplay((prev) => prev + operator);
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const result = eval(display).toString();
      setHistory((prev) => [...prev, { expression: display, result }]);
      onResult(result);
      setDisplay(result);
      setShowHistory(true);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <Paper
      elevation={24}
      sx={{
        p: 3,
        borderRadius: 4,
        background: 'rgba(20, 30, 40, 0.85)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(12px)',
        maxWidth: 400,
        mx: 'auto',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.5s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.45)',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryIcon fontSize="small" />
            Calculator
          </Typography>
          <IconButton
            size="small"
            onClick={() => setShowHistory(!showHistory)}
            sx={{
              color: '#888',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: '#222',
            textAlign: 'right',
            fontWeight: 'bold',
            minHeight: '48px',
            fontFamily: 'Digital-7, "Orbitron", monospace',
            letterSpacing: '0.08em',
            textShadow: '0 1px 0 #b2f2c9, 0 0 8px #b2f2c9',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            background: 'linear-gradient(180deg, #eafbe7 80%, #b2f2c9 100%)',
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: 'inset 0 2px 8px #b2f2c9',
            border: '1.5px solid #b2f2c9',
          }}
        >
          {display}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#e0e0e0' }} />

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Tooltip title="Clear">
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleClear}
              sx={{
                height: '60px',
                fontSize: '1.5rem',
                borderRadius: '18px',
                background: '#ff4d4f',
                color: '#fff',
                boxShadow: '4px 4px 12px #e0e0e0, -4px -4px 12px #fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#ff7875',
                },
              }}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Backspace">
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleBackspace}
              sx={{
                height: '60px',
                fontSize: '1.5rem',
                borderRadius: '18px',
                background: '#f7f7f7',
                color: '#888',
                boxShadow: '4px 4px 12px #e0e0e0, -4px -4px 12px #fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#e0e0e0',
                },
              }}
            >
              <BackspaceIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Divide">
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleOperator('/')}
              sx={{
                height: '60px',
                fontSize: '1.5rem',
                borderRadius: '18px',
                background: '#f7f7f7',
                color: '#222',
                boxShadow: '4px 4px 12px #e0e0e0, -4px -4px 12px #fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#e0e0e0',
                },
              }}
            >
              ÷
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Multiply">
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleOperator('*')}
              sx={{
                height: '60px',
                fontSize: '1.5rem',
                borderRadius: '18px',
                background: '#f7f7f7',
                color: '#222',
                boxShadow: '4px 4px 12px #e0e0e0, -4px -4px 12px #fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#e0e0e0',
                },
              }}
            >
              ×
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('7')}
            sx={buttonStyle}
          >
            7
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('8')}
            sx={buttonStyle}
          >
            8
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('9')}
            sx={buttonStyle}
          >
            9
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Subtract">
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleOperator('-')}
              sx={operatorButtonStyle}
            >
              −
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('4')}
            sx={buttonStyle}
          >
            4
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('5')}
            sx={buttonStyle}
          >
            5
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('6')}
            sx={buttonStyle}
          >
            6
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Add">
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleOperator('+')}
              sx={operatorButtonStyle}
            >
              +
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('1')}
            sx={buttonStyle}
          >
            1
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('2')}
            sx={buttonStyle}
          >
            2
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('3')}
            sx={buttonStyle}
          >
            3
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Equals">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleEqual}
              sx={{
                height: '60px',
                fontSize: '1.5rem',
                borderRadius: '18px',
                background: '#d9d9d9',
                color: '#222',
                boxShadow: '4px 4px 12px #e0e0e0, -4px -4px 12px #fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#bfbfbf',
                },
              }}
            >
              =
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNumber('0')}
            sx={buttonStyle}
          >
            0
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Decimal Point">
            <Button
              fullWidth
              variant="contained"
              onClick={handleDecimal}
              sx={buttonStyle}
            >
              .
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Percent">
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleOperator('%')}
              sx={operatorButtonStyle}
            >
              %
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {showHistory && (
        <Zoom in={showHistory}>
          <Paper
            elevation={24}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: '#f7f7f7',
              boxShadow: '8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff',
              border: '1.5px solid #e0e0e0',
              transition: 'all 0.3s',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1, color: '#888' }} />
              <Typography variant="h6" sx={{ color: '#888' }}>
                History
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#e0e0e0' }} />
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {history.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    background: '#f0f0f0',
                    boxShadow: '2px 2px 8px #e0e0e0, -2px -2px 8px #fff',
                    color: '#222',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: '#e0e0e0',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#888', fontFamily: 'monospace' }}>
                    {item.expression}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#222', fontWeight: 'bold', fontFamily: 'Digital-7, Orbitron, monospace', textShadow: '0 1px 0 #b2f2c9' }}>
                    = {item.result}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Zoom>
      )}
    </Paper>
  );
};

export default ManualCalculator;