import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Components
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import IncidentList from './components/Incidents/IncidentList';
import IncidentForm from './components/Incidents/IncidentForm';
import IncidentDetail from './components/Incidents/IncidentDetail';
import TrainingList from './components/Training/TrainingList';
import TrainingForm from './components/Training/TrainingForm';
import TrainingDetail from './components/Training/TrainingDetail';
import InspectionList from './components/Inspections/InspectionList';
import InspectionForm from './components/Inspections/InspectionForm';
import InspectionDetail from './components/Inspections/InspectionDetail';
import PPEComplianceList from './components/PPECompliance/PPEComplianceList';
import PPEComplianceForm from './components/PPECompliance/PPEComplianceForm';
import PPEComplianceDetail from './components/PPECompliance/PPEComplianceDetail';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Incidents Routes */}
              <Route path="/incidents" element={<IncidentList />} />
              <Route path="/incidents/new" element={<IncidentForm />} />
              <Route path="/incidents/:id" element={<IncidentDetail />} />
              <Route path="/incidents/:id/edit" element={<IncidentForm />} />
              
              {/* Training Routes */}
              <Route path="/training" element={<TrainingList />} />
              <Route path="/training/new" element={<TrainingForm />} />
              <Route path="/training/:id" element={<TrainingDetail />} />
              <Route path="/training/:id/edit" element={<TrainingForm />} />
              
              {/* Inspections Routes */}
              <Route path="/inspections" element={<InspectionList />} />
              <Route path="/inspections/new" element={<InspectionForm />} />
              <Route path="/inspections/:id" element={<InspectionDetail />} />
              <Route path="/inspections/:id/edit" element={<InspectionForm />} />
              
              {/* PPE Compliance Routes */}
              <Route path="/ppe-compliance" element={<PPEComplianceList />} />
              <Route path="/ppe-compliance/new" element={<PPEComplianceForm />} />
              <Route path="/ppe-compliance/:id" element={<PPEComplianceDetail />} />
              <Route path="/ppe-compliance/:id/edit" element={<PPEComplianceForm />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
