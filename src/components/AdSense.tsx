import React from 'react';
import { Box, Typography } from '@mui/material';

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid';
  responsive?: boolean;
}

const AdSense: React.FC<AdSenseProps> = ({
  slot,
  style = { display: 'block' },
  format = 'auto',
  responsive = true,
}) => {
  // For testing purposes, we'll show a placeholder ad
  return (
    <Box
      sx={{
        ...style,
        border: '1px dashed #ccc',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        textAlign: 'center',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Ad Placeholder
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Slot ID: {slot}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Format: {format}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Responsive: {responsive ? 'Yes' : 'No'}
      </Typography>
    </Box>
  );
};

export default AdSense; 