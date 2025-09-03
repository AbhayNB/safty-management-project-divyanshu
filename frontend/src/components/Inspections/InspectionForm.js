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
  Slider,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { inspectionAPI, locationAPI } from '../../services/api';

// Validation schema
const schema = yup.object().shape({
  inspection_type: yup.string().required('Inspection type is required'),
  inspection_date: yup.date().required('Inspection date is required'),
  inspection_time: yup.mixed().nullable(),
  location_id: yup.number().required('Location is required'),
  inspector_name: yup.string(),
  notes: yup.string(),
  status: yup.string().required('Status is required'),
  score: yup.number().nullable().min(0).max(100),
});

const inspectionTypes = [
  'Monthly Safety Check',
  'Fire Safety Inspection',
  'Equipment Safety Check',
  'PPE Compliance Check',
  'Emergency Equipment Check',
  'Workplace Hazard Assessment',
  'Chemical Storage Inspection',
  'Electrical Safety Check',
  'Machinery Safety Inspection',
  'Environmental Safety Audit',
];

const statusOptions = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
];

function InspectionForm() {
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      inspection_type: '',
      inspection_date: dayjs(),
      inspection_time: null,
      location_id: '',
      inspector_name: '',
      notes: '',
      status: 'Scheduled',
      score: null,
    },
  });

  const status = watch('status');

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setLocations([]);
    }
  }, []);

  const fetchInspection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inspectionAPI.getById(id);
      const inspection = response.data;
      
      reset({
        inspection_type: inspection.inspection_type,
        inspection_date: dayjs(inspection.inspection_date),
        inspection_time: inspection.inspection_time ? dayjs(`2025-01-01T${inspection.inspection_time}`) : null,
        location_id: inspection.location_id,
        inspector_name: inspection.inspector_name || '',
        notes: inspection.notes || '',
        status: inspection.status,
        score: inspection.score,
      });
    } catch (err) {
      setError('Failed to fetch inspection details');
      console.error('Fetch inspection error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchLocations();
    if (isEdit) {
      fetchInspection();
    }
  }, [id, isEdit, fetchLocations, fetchInspection]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...data,
        inspection_date: data.inspection_date 
          ? (typeof data.inspection_date.format === 'function' 
              ? data.inspection_date.format('YYYY-MM-DD') 
              : dayjs(data.inspection_date).format('YYYY-MM-DD'))
          : null,
        inspection_time: data.inspection_time 
          ? (typeof data.inspection_time.format === 'function' 
              ? data.inspection_time.format('HH:mm:ss') 
              : dayjs(data.inspection_time).format('HH:mm:ss'))
          : null,
      };

      if (isEdit) {
        await inspectionAPI.update(id, submitData);
      } else {
        await inspectionAPI.create(submitData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/inspections');
      }, 1500);
    } catch (err) {
      setError(isEdit ? 'Failed to update inspection' : 'Failed to create inspection');
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
        {isEdit ? 'Edit Inspection' : 'Schedule New Inspection'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Inspection {isEdit ? 'updated' : 'scheduled'} successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="inspection_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Inspection Type"
                    error={!!errors.inspection_type}
                    helperText={errors.inspection_type?.message}
                  >
                    {inspectionTypes.map((type) => (
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
                name="inspection_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Inspection Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.inspection_date,
                        helperText: errors.inspection_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="inspection_time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Inspection Time (Optional)"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.inspection_time,
                        helperText: errors.inspection_time?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="inspector_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Inspector Name"
                    error={!!errors.inspector_name}
                    helperText={errors.inspector_name?.message}
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

            {(status === 'Completed' || status === 'In Progress') && (
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Inspection Score (0-100)
                </Typography>
                <Controller
                  name="score"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ px: 2 }}>
                      <Slider
                        {...field}
                        value={field.value || 0}
                        onChange={(_, value) => field.onChange(value)}
                        min={0}
                        max={100}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                      />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="body2" color="textSecondary">
                          0% (Poor)
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          50% (Average)
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          100% (Excellent)
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes"
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
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
              {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Schedule')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/inspections')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default InspectionForm;
