import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ppeComplianceAPI } from '../../services/api';

function PPEComplianceList() {
  const [ppeRecords, setPpeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, record: null });
  
  const navigate = useNavigate();

  const fetchPPERecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ppeComplianceAPI.getAll(page * rowsPerPage, rowsPerPage);
      setPpeRecords(response.data);
    } catch (err) {
      setError('Failed to fetch PPE compliance records');
      console.error('PPE records fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPPERecords();
  }, [fetchPPERecords]);

  const handleDeleteClick = (record) => {
    setDeleteDialog({ open: true, record });
  };

  const handleDeleteConfirm = async () => {
    try {
      await ppeComplianceAPI.delete(deleteDialog.record.ppe_id);
      setDeleteDialog({ open: false, record: null });
      fetchPPERecords(); // Refresh the list
    } catch (err) {
      setError('Failed to delete PPE compliance record');
      console.error('Delete error:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, record: null });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getComplianceColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 80) return 'warning';
    return 'error';
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

  // Calculate summary statistics
  const totalRecords = ppeRecords.length;
  const averageCompliance = totalRecords > 0 
    ? Math.round(ppeRecords.reduce((sum, record) => sum + (record.helmet_compliance + record.safety_glasses_compliance + record.gloves_compliance + record.safety_shoes_compliance + record.vest_compliance) / 5, 0) / totalRecords)
    : 0;
  const totalViolations = ppeRecords.reduce((sum, record) => sum + record.violations, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          PPE Compliance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/ppe-compliance/new')}
        >
          New Assessment
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {totalRecords}
                </Typography>
                <Typography color="text.secondary">
                  Total Assessments
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {averageCompliance}%
                </Typography>
                <Typography color="text.secondary">
                  Average Compliance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {totalViolations}
                </Typography>
                <Typography color="text.secondary">
                  Total Violations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Assessment Date</TableCell>
                <TableCell>Overall Compliance</TableCell>
                <TableCell>Violations</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ppeRecords.map((record) => {
                const overallCompliance = Math.round(
                  (record.helmet_compliance + 
                   record.safety_glasses_compliance + 
                   record.gloves_compliance + 
                   record.safety_shoes_compliance + 
                   record.vest_compliance) / 5
                );
                
                return (
                  <TableRow key={record.ppe_id} hover>
                    <TableCell>{record.employee}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      {new Date(record.assessment_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={overallCompliance}
                          color={getComplianceColor(overallCompliance)}
                          sx={{ width: 100, mr: 1 }}
                        />
                        <Typography variant="body2">
                          {overallCompliance}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.violations}
                        color={record.violations === 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/ppe-compliance/${record.ppe_id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/ppe-compliance/${record.ppe_id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(record)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {ppeRecords.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No PPE compliance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
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
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PPEComplianceList;
