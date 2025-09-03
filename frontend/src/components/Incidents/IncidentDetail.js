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
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentAPI } from '../../services/api';

// Mock locations for display
const mockLocations = {
  1: 'Main Factory Floor',
  2: 'Warehouse',
  3: 'Office Building',
  4: 'Parking Lot',
  5: 'Loading Dock',
};

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true);
      const response = await incidentAPI.getById(id);
      setIncident(response.data);
    } catch (err) {
      setError('Failed to fetch incident details');
      console.error('Fetch incident error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'Under Investigation':
        return 'info';
      case 'Closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
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

  if (!incident) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Incident not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/incidents')}
          >
            Back to Incidents
          </Button>
          <Typography variant="h4">
            Incident #{incident.incident_id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/incidents/${id}/edit`)}
        >
          Edit Incident
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Date & Time
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(incident.date_time).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Location
            </Typography>
            <Typography variant="body1" gutterBottom>
              {mockLocations[incident.location_id] || `Location ID: ${incident.location_id}`}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Incident Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {incident.incident_type}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Reporter
            </Typography>
            <Typography variant="body1" gutterBottom>
              {incident.reporter_name || 'Not specified'}
            </Typography>
          </Grid>

          {/* Status and Severity */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Status & Severity
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={incident.status}
              color={getStatusColor(incident.status)}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Injury Severity
            </Typography>
            <Chip
              label={incident.injury_severity || 'Not specified'}
              color={getSeverityColor(incident.injury_severity)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {incident.description || 'No description provided'}
            </Typography>
          </Grid>

          {/* Timestamps */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Record Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Created At
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(incident.created_at).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Last Updated
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(incident.updated_at).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default IncidentDetail;
