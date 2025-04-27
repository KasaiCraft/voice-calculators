import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: string;
}

interface HistoryProps {
  items: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ items }) => {
  return (
    <Paper sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        History
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} divider={index !== items.length - 1}>
            <ListItemText
              primary={`${item.expression} = ${item.result}`}
              secondary={item.timestamp}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default History; 