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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FactCheck as FactCheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { inspectionAPI, locationAPI } from '../../services/api';

function InspectionList() {
  const [inspections, setInspections] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, inspection: null });
  
  const navigate = useNavigate();

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inspectionAPI.getAll(page * rowsPerPage, rowsPerPage);
      setInspections(response.data);
    } catch (err) {
      setError('Failed to fetch inspections');
      console.error('Inspections fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationAPI.getAll();
      const locationsMap = {};
      response.data.forEach(location => {
        locationsMap[location.location_id] = location.name;
      });
      setLocations(locationsMap);
    } catch (err) {
      console.error('Locations fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchInspections();
    fetchLocations();
  }, [fetchInspections, fetchLocations]);

  const handleDeleteClick = (inspection) => {
    setDeleteDialog({ open: true, inspection });
  };

  const handleDeleteConfirm = async () => {
    try {
      await inspectionAPI.delete(deleteDialog.inspection.inspection_id);
      setDeleteDialog({ open: false, inspection: null });
      fetchInspections(); // Refresh the list
    } catch (err) {
      setError('Failed to delete inspection');
      console.error('Delete error:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, inspection: null });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <FactCheckIcon color="primary" fontSize="large" />
          <Typography variant="h4">Safety Inspections</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inspections/new')}
        >
          Schedule Inspection
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Inspector</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.inspection_id}>
                  <TableCell>{inspection.inspection_id}</TableCell>
                  <TableCell>{inspection.inspection_type}</TableCell>
                  <TableCell>
                    {new Date(inspection.inspection_date).toLocaleDateString()}
                    {inspection.inspection_time && (
                      <Typography variant="body2" color="textSecondary">
                        {inspection.inspection_time}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {locations[inspection.location_id] || `Location ${inspection.location_id}`}
                  </TableCell>
                  <TableCell>{inspection.inspector_name || 'Not assigned'}</TableCell>
                  <TableCell>
                    <Chip
                      label={inspection.status}
                      color={getStatusColor(inspection.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {inspection.score !== null ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {inspection.score}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={inspection.score}
                          color={getScoreColor(inspection.score)}
                          sx={{ width: '60px', height: '4px' }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/inspections/${inspection.inspection_id}`)}
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/inspections/${inspection.inspection_id}/edit`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(inspection)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={-1}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Inspection
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this inspection? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InspectionList;
