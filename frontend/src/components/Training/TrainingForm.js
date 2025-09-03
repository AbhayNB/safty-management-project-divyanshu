import React, { useState, useEffect, useCallback } from 'react';
import { trainingAPI, employeeAPI } from '../../services/api';
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

// Validation schema
const schema = yup.object().shape({
  training_type: yup.string().required('Training type is required'),
  completion_date: yup.date().required('Completion date is required'),
  expiry_date: yup.date().nullable(),
  trainer_name: yup.string(),
  participants: yup.array().of(yup.number()),
});

const trainingTypes = [
  'Fire Safety',
  'First Aid',
  'Chemical Safety',
  'Equipment Operation',
  'Emergency Response',
  'Hazardous Materials',
  'Personal Protective Equipment',
  'Workplace Safety',
  'Health & Safety Orientation',
  'Confined Space Entry',
  'Fall Protection',
  'Electrical Safety',
];





function TrainingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [employees, setEmployees] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      training_type: '',
      completion_date: dayjs(),
      expiry_date: null,
      trainer_name: '',
      participants: [],
    },
  });

  const completionDate = watch('completion_date');

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  }, []);

  const fetchTraining = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await trainingAPI.getById(id);
      const training = response.data;
      
      reset({
        training_type: training.training_type,
        completion_date: dayjs(training.completion_date),
        expiry_date: training.expiry_date ? dayjs(training.expiry_date) : null,
        trainer_name: training.trainer_name || '',
        participants: training.participants || [],
      });
    } catch (err) {
      setError('Failed to fetch training details');
      console.error('Fetch training error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchEmployees();
    if (isEdit) {
      fetchTraining();
    }
  }, [isEdit, fetchTraining, fetchEmployees]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...data,
        completion_date: data.completion_date 
          ? (typeof data.completion_date.format === 'function' 
              ? data.completion_date.format('YYYY-MM-DD') 
              : dayjs(data.completion_date).format('YYYY-MM-DD'))
          : null,
        expiry_date: data.expiry_date 
          ? (typeof data.expiry_date.format === 'function' 
              ? data.expiry_date.format('YYYY-MM-DD') 
              : dayjs(data.expiry_date).format('YYYY-MM-DD'))
          : null,
      };

      if (isEdit) {
        await trainingAPI.update(id, submitData);
      } else {
        await trainingAPI.create(submitData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/training');
      }, 1500);
    } catch (err) {
      setError(isEdit ? 'Failed to update training session' : 'Failed to create training session');
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
        {isEdit ? 'Edit Training Session' : 'New Training Session'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Training session {isEdit ? 'updated' : 'created'} successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="training_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Training Type"
                    error={!!errors.training_type}
                    helperText={errors.training_type?.message}
                  >
                    {trainingTypes.map((type) => (
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
                name="trainer_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Trainer Name"
                    error={!!errors.trainer_name}
                    helperText={errors.trainer_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="completion_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Completion Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.completion_date,
                        helperText: errors.completion_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="expiry_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Expiry Date (Optional)"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={completionDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expiry_date,
                        helperText: errors.expiry_date?.message || 'Leave empty if training doesn\'t expire',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="participants"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Participants</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Participants" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const employee = employees.find(emp => emp.employee_id === value);
                            return (
                              <Chip
                                key={value}
                                label={employee?.employee_name || `Employee ${value}`}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.employee_id} value={employee.employee_id}>
                          {employee.employee_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
              onClick={() => navigate('/training')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default TrainingForm;
