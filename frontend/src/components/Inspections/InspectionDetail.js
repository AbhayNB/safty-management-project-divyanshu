import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { inspectionAPI } from '../../services/api';

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchInspection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inspectionAPI.getById(id);
      setInspection(response.data);
    } catch (error) {
      setError('Failed to fetch inspection details');
      console.error('Error fetching inspection:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  const handleEdit = () => {
    navigate(`/inspections/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await inspectionAPI.delete(id);
      navigate('/inspections');
    } catch (error) {
      setError('Failed to delete inspection');
      console.error('Error deleting inspection:', error);
    }
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon />;
      case 'In Progress':
        return <AssignmentIcon />;
      case 'Scheduled':
        return <ScheduleIcon />;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!inspection) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">Inspection not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/inspections')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Inspection Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inspection Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Inspection Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {inspection.type}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Area
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {inspection.area}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Inspector
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {inspection.inspector}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Scheduled Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(inspection.scheduled_date).toLocaleDateString()}
                </Typography>
              </Grid>
              {inspection.completed_date && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completed Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(inspection.completed_date).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {inspection.notes && (
              <>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                  Notes
                </Typography>
                <Typography variant="body1">
                  {inspection.notes}
                </Typography>
              </>
            )}
          </Paper>

          {/* Findings */}
          {inspection.findings && inspection.findings.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Findings & Recommendations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {inspection.findings.map((finding, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={finding.description}
                      secondary={finding.recommendation}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* Status and Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={getStatusIcon(inspection.status)}
                  label={inspection.status}
                  color={getStatusColor(inspection.status)}
                  sx={{ mr: 1 }}
                />
              </Box>
            </CardContent>
          </Card>

          {inspection.score !== null && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inspection Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" color={`${getScoreColor(inspection.score)}.main`}>
                    {inspection.score}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={inspection.score}
                  color={getScoreColor(inspection.score)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {inspection.score >= 90 ? 'Excellent' : 
                   inspection.score >= 70 ? 'Good' : 'Needs Improvement'}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/inspections/new')}
                >
                  Schedule New Inspection
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/inspections')}
                >
                  View All Inspections
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete Inspection
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this inspection? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InspectionDetail;
