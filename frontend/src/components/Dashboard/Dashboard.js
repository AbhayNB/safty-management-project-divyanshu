import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Report as ReportIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  FactCheck as FactCheckIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { incidentAPI } from '../../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalIncidents: 0,
    openIncidents: 0,
    recentIncidents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await incidentAPI.getAll(0, 10);
      const incidents = response.data;
      
      setDashboardData({
        totalIncidents: incidents.length,
        openIncidents: incidents.filter(incident => incident.status === 'Open').length,
        recentIncidents: incidents.slice(0, 5),
      });
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Safety Management Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Incidents"
            value={dashboardData.totalIncidents}
            icon={<ReportIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Incidents"
            value={dashboardData.openIncidents}
            icon={<WarningIcon fontSize="large" />}
            color="error"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Training Sessions"
            value="12"
            icon={<SchoolIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inspections"
            value="8"
            icon={<FactCheckIcon fontSize="large" />}
            color="info"
          />
        </Grid>

        {/* Recent Incidents */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Incidents
            </Typography>
            {dashboardData.recentIncidents.length > 0 ? (
              dashboardData.recentIncidents.map((incident) => (
                <Box
                  key={incident.incident_id}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {incident.incident_type}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(incident.date_time).toLocaleDateString()} - {incident.status}
                  </Typography>
                  <Typography variant="body2">
                    {incident.description || 'No description provided'}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                No recent incidents
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Safety Metrics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2">Safety Score</Typography>
                  <Typography variant="h6" color="success.main">
                    85%
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2">PPE Compliance</Typography>
                  <Typography variant="h6" color="primary.main">
                    92%
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center">
                <FactCheckIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2">Inspection Rate</Typography>
                  <Typography variant="h6" color="info.main">
                    88%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
