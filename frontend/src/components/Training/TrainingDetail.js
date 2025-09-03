import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Mock employees
const mockEmployees = {
  1: 'John Smith',
  2: 'Jane Doe',
  3: 'Mike Johnson',
  4: 'Sarah Wilson',
  5: 'David Brown',
  6: 'Lisa Davis',
};

// Mock API
const trainingAPI = {
  getById: (id) => Promise.resolve({
    data: {
      training_id: parseInt(id),
      training_type: 'Fire Safety',
      completion_date: '2025-09-01',
      expiry_date: '2026-09-01',
      trainer_name: 'Safety Officer Mike',
      participants: [1, 2, 3],
      created_at: '2025-08-25T10:00:00'
    }
  })
};

function TrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTraining = useCallback(async () => {
    try {
      setLoading(true);
      const response = await trainingAPI.getById(id);
      setTraining(response.data);
    } catch (err) {
      setError('Failed to fetch training details');
      console.error('Fetch training error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'No Expiry', color: 'default' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', color: 'error' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'warning' };
    } else {
      return { status: 'Valid', color: 'success' };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!training) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Training session not found
      </Alert>
    );
  }

  const expiryStatus = getExpiryStatus(training.expiry_date);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/training')}
          >
            Back to Training
          </Button>
          <SchoolIcon color="primary" fontSize="large" />
          <Typography variant="h4">
            Training Session #{training.training_id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/training/${id}/edit`)}
        >
          Edit Training
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Training Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Training Type
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {training.training_type}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Trainer
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {training.trainer_name || 'Not specified'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Completion Date
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body1">
                    {new Date(training.completion_date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Expiry Date
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body1">
                    {training.expiry_date ? 
                      new Date(training.expiry_date).toLocaleDateString() : 
                      'No expiry date'
                    }
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={expiryStatus.status}
                  color={expiryStatus.color}
                  size="medium"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created On
                </Typography>
                <Typography variant="body1">
                  {new Date(training.created_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Participants */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Participants ({training.participants?.length || 0})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {training.participants && training.participants.length > 0 ? (
              <List>
                {training.participants.map((participantId) => (
                  <ListItem key={participantId} disablePadding>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={mockEmployees[participantId] || `Employee ${participantId}`}
                      secondary={`ID: ${participantId}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                No participants registered
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Additional Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Training Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {training.participants?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Participants
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {training.expiry_date ? 
                      Math.ceil((new Date(training.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) :
                      '∞'
                    }
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Days Until Expiry
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {Math.ceil((new Date() - new Date(training.completion_date)) / (1000 * 60 * 60 * 24))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Days Since Completion
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary.main">
                    100%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completion Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TrainingDetail;
