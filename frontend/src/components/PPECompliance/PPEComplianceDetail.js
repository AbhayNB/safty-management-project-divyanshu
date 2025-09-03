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
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { ppeComplianceAPI } from '../../services/api';

const PPEComplianceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchCompliance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ppeComplianceAPI.getById(id);
      setCompliance(response.data);
    } catch (error) {
      setError('Failed to fetch PPE compliance details');
      console.error('Error fetching compliance:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const handleEdit = () => {
    navigate(`/ppe-compliance/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await ppeComplianceAPI.delete(id);
      navigate('/ppe-compliance');
    } catch (error) {
      setError('Failed to delete PPE compliance record');
      console.error('Error deleting compliance:', error);
    }
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Non-Compliant':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Compliant':
        return <CheckCircleIcon />;
      case 'Partial':
        return <WarningIcon />;
      case 'Non-Compliant':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const getComplianceColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 80) return 'warning';
    return 'error';
  };

  const calculateOverallCompliance = () => {
    if (!compliance) return 0;
    const rates = [
      compliance.helmet_compliance,
      compliance.safety_glasses_compliance,
      compliance.gloves_compliance,
      compliance.safety_shoes_compliance,
      compliance.vest_compliance
    ];
    return Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
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

  if (!compliance) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">PPE compliance record not found</Alert>
      </Container>
    );
  }

  const overallCompliance = calculateOverallCompliance();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/ppe-compliance')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            PPE Compliance Details
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
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {compliance.employee}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {compliance.department}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assessment Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(compliance.assessment_date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assessor
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {compliance.assessor || 'Not specified'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* PPE Compliance Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              PPE Compliance Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Safety Helmet"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance.helmet_compliance}
                        color={getComplianceColor(compliance.helmet_compliance)}
                        sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {compliance.helmet_compliance}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Safety Glasses"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance.safety_glasses_compliance}
                        color={getComplianceColor(compliance.safety_glasses_compliance)}
                        sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {compliance.safety_glasses_compliance}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>


              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Gloves"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance.gloves_compliance}
                        color={getComplianceColor(compliance.gloves_compliance)}
                        sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {compliance.gloves_compliance}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Safety Shoes"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance.safety_shoes_compliance}
                        color={getComplianceColor(compliance.safety_shoes_compliance)}
                        sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {compliance.safety_shoes_compliance}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Safety Vest"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance.vest_compliance}
                        color={getComplianceColor(compliance.vest_compliance)}
                        sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {compliance.vest_compliance}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>

          {/* Violations */}
          {compliance.violations > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Violations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  {compliance.violations} violation(s) recorded during this assessment
                </Typography>
              </Alert>
              {compliance.violation_details && (
                <Typography variant="body2" color="text.secondary">
                  {compliance.violation_details}
                </Typography>
              )}
            </Paper>
          )}
        </Grid>

        {/* Status and Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={getStatusIcon(compliance.status)}
                  label={compliance.status}
                  color={getStatusColor(compliance.status)}
                  sx={{ mr: 1 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(compliance.assessment_date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Compliance Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" color={`${getComplianceColor(overallCompliance)}.main`}>
                  {overallCompliance}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallCompliance}
                color={getComplianceColor(overallCompliance)}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {overallCompliance >= 95 ? 'Excellent compliance' : 
                 overallCompliance >= 80 ? 'Good compliance' : 'Needs improvement'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Violations Summary
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" color={compliance.violations > 0 ? 'error.main' : 'success.main'}>
                  {compliance.violations}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {compliance.violations === 0 ? 'No violations recorded' : 
                 compliance.violations === 1 ? '1 violation recorded' : 
                 `${compliance.violations} violations recorded`}
              </Typography>
            </CardContent>
          </Card>

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
                  onClick={() => navigate('/ppe-compliance/new')}
                >
                  New Assessment
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/ppe-compliance')}
                >
                  View All Assessments
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
          Delete PPE Compliance Record
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this PPE compliance record? This action cannot be undone.
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

export default PPEComplianceDetail;
