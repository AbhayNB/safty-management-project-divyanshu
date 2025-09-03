import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function ComingSoon({ title, description }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {description || 'This feature is under development and will be available soon.'}
        </Typography>
      </Paper>
    </Box>
  );
}

export default ComingSoon;
