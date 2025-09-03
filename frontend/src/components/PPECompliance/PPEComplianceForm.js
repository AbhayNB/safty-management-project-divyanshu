import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Slider,
  FormHelperText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ppeComplianceAPI, employeeAPI } from '../../services/api';

// Validation schema
const schema = yup.object().shape({
  employee_id: yup.number().required('Employee is required'),
  helmet_compliance: yup.number().min(0).max(100).required('Helmet compliance is required'),
  safety_glasses_compliance: yup.number().min(0).max(100).required('Safety glasses compliance is required'),
  gloves_compliance: yup.number().min(0).max(100).required('Gloves compliance is required'),
  safety_shoes_compliance: yup.number().min(0).max(100).required('Safety shoes compliance is required'),
  vest_compliance: yup.number().min(0).max(100).required('Vest compliance is required'),
  violations: yup.number().min(0).required('Number of violations is required'),
});

function PPEComplianceForm() {
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
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      employee_id: '',
      helmet_compliance: 100,
      safety_glasses_compliance: 100,
      gloves_compliance: 100,
      safety_shoes_compliance: 100,
      vest_compliance: 100,
      violations: 0,
    },
  });

  const watchedFields = watch([
    'helmet_compliance',
    'safety_glasses_compliance', 
    'gloves_compliance',
    'safety_shoes_compliance',
    'vest_compliance',
    'violations'
  ]);

  // Calculate overall compliance
  const overallCompliance = Math.round(
    (watchedFields[0] + watchedFields[1] + watchedFields[2] + watchedFields[3] + watchedFields[4]) / 5
  );

  // Determine status based on compliance and violations
  const getComplianceStatus = () => {
    if (overallCompliance >= 95 && watchedFields[5] === 0) {
      return { text: 'Compliant', color: 'success.main' };
    } else if (overallCompliance >= 80) {
      return { text: 'Partial', color: 'warning.main' };
    } else {
      return { text: 'Non-Compliant', color: 'error.main' };
    }
  };

  const complianceStatus = getComplianceStatus();

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  }, []);

  const fetchPPERecord = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ppeComplianceAPI.getById(id);
      const record = response.data;
      
      // Set form values
      setValue('employee_id', record.employee_id);
      setValue('helmet_compliance', record.helmet_compliance);
      setValue('safety_glasses_compliance', record.safety_glasses_compliance);
      setValue('gloves_compliance', record.gloves_compliance);
      setValue('safety_shoes_compliance', record.safety_shoes_compliance);
      setValue('vest_compliance', record.vest_compliance);
      setValue('violations', record.violations);
    } catch (err) {
      setError('Failed to fetch PPE compliance record');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    fetchEmployees();
    if (isEdit) {
      fetchPPERecord();
    }
  }, [isEdit, fetchPPERecord, fetchEmployees]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Add calculated fields
      const submitData = {
        ...data,
        assessment_date: new Date().toISOString().split('T')[0],
        status: complianceStatus.text,
      };

      if (isEdit) {
        await ppeComplianceAPI.update(id, submitData);
      } else {
        await ppeComplianceAPI.create(submitData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/ppe-compliance');
      }, 2000);
    } catch (err) {
      setError('Failed to save PPE compliance record');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Edit PPE Compliance Assessment' : 'New PPE Compliance Assessment'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            PPE compliance record saved successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.employee_id}>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      {...field}
                      label="Employee"
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.employee_id} value={employee.employee_id}>
                          {employee.name || `${employee.first_name || ''} ${employee.last_name || ''}`.trim() || employee.employee_name} ({employee.department || 'No Department'})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.employee_id && (
                      <FormHelperText>{errors.employee_id.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* PPE Compliance Rates */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                PPE Compliance Rates
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Safety Helmet: {watchedFields[0]}%
              </Typography>
              <Controller
                name="helmet_compliance"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                )}
              />
              {errors.helmet_compliance && (
                <FormHelperText error>{errors.helmet_compliance.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Safety Glasses: {watchedFields[1]}%
              </Typography>
              <Controller
                name="safety_glasses_compliance"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                )}
              />
              {errors.safety_glasses_compliance && (
                <FormHelperText error>{errors.safety_glasses_compliance.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Safety Gloves: {watchedFields[2]}%
              </Typography>
              <Controller
                name="gloves_compliance"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                )}
              />
              {errors.gloves_compliance && (
                <FormHelperText error>{errors.gloves_compliance.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Safety Shoes: {watchedFields[3]}%
              </Typography>
              <Controller
                name="safety_shoes_compliance"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                )}
              />
              {errors.safety_shoes_compliance && (
                <FormHelperText error>{errors.safety_shoes_compliance.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Safety Vest: {watchedFields[4]}%
              </Typography>
              <Controller
                name="vest_compliance"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                )}
              />
              {errors.vest_compliance && (
                <FormHelperText error>{errors.vest_compliance.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="violations"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Number of Violations"
                    error={!!errors.violations}
                    helperText={errors.violations?.message}
                    inputProps={{ min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* Summary */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Assessment Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Overall Compliance Rate:</strong> {overallCompliance}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body1" 
                    sx={{ color: complianceStatus.color }}
                  >
                    <strong>Status:</strong> {complianceStatus.text}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/ppe-compliance')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : (isEdit ? 'Update' : 'Create')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default PPEComplianceForm;
