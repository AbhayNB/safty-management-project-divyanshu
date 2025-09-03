import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { incidentAPI, locationAPI } from '../../services/api';

// Validation schema
const schema = yup.object().shape({
  date_time: yup.date().required('Date and time is required'),
  location_id: yup.number().required('Location is required'),
  incident_type: yup.string().required('Incident type is required'),
  description: yup.string(),
  injury_severity: yup.string(),
  reporter_name: yup.string(),
  status: yup.string(),
});

const incidentTypes = [
  'Slip/Fall',
  'Cut/Laceration',
  'Burn',
  'Chemical Exposure',
  'Equipment Malfunction',
  'Near Miss',
  'Fire',
  'Other',
];

const severityLevels = [
  'Low',
  'Medium',
  'High',
  'Critical',
];

const statusOptions = [
  'Open',
  'In Progress',
  'Under Investigation',
  'Closed',
];

function IncidentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locations, setLocations] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date_time: dayjs(),
      location_id: '',
      incident_type: '',
      description: '',
      injury_severity: '',
      reporter_name: '',
      status: 'Open',
    },
  });

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setLocations([]);
    }
  }, []);

  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true);
      const response = await incidentAPI.getById(id);
      const incident = response.data;
      
      reset({
        date_time: dayjs(incident.date_time),
        location_id: incident.location_id,
        incident_type: incident.incident_type,
        description: incident.description || '',
        injury_severity: incident.injury_severity || '',
        reporter_name: incident.reporter_name || '',
        status: incident.status || 'Open',
      });
    } catch (err) {
      setError('Failed to fetch incident details');
      console.error('Fetch incident error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchLocations();
    if (isEdit) {
      fetchIncident();
    }
  }, [id, isEdit, fetchLocations, fetchIncident]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...data,
        date_time: data.date_time.toISOString(),
      };

      if (isEdit) {
        await incidentAPI.update(id, submitData);
      } else {
        await incidentAPI.create(submitData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/incidents');
      }, 1500);
    } catch (err) {
      setError(isEdit ? 'Failed to update incident' : 'Failed to create incident');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Incident' : 'New Incident Report'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Incident {isEdit ? 'updated' : 'created'} successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="date_time"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    label="Date & Time"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date_time,
                        helperText: errors.date_time?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Location"
                    error={!!errors.location_id}
                    helperText={errors.location_id?.message}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.location_id} value={location.location_id}>
                        {location.location_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="incident_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Incident Type"
                    error={!!errors.incident_type}
                    helperText={errors.incident_type?.message}
                  >
                    {incidentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="injury_severity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Injury Severity"
                    error={!!errors.injury_severity}
                    helperText={errors.injury_severity?.message}
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reporter_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Reporter Name"
                    error={!!errors.reporter_name}
                    helperText={errors.reporter_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/incidents')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default IncidentForm;
