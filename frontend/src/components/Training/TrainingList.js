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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { trainingAPI } from '../../services/api';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, training: null });
  
  const navigate = useNavigate();

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await trainingAPI.getAll(page * rowsPerPage, rowsPerPage);
      setTrainings(response.data);
    } catch (err) {
      setError('Failed to fetch training sessions');
      console.error('Training fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleDeleteClick = (training) => {
    setDeleteDialog({ open: true, training });
  };

  const handleDeleteConfirm = async () => {
    try {
      await trainingAPI.delete(deleteDialog.training.training_id);
      setDeleteDialog({ open: false, training: null });
      fetchTrainings(); // Refresh the list
    } catch (err) {
      setError('Failed to delete training session');
      console.error('Delete error:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, training: null });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', color: 'error' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'warning' };
    } else {
      return { status: 'Valid', color: 'success' };
    }
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
          <SchoolIcon color="primary" fontSize="large" />
          <Typography variant="h4">Safety Training</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/training/new')}
        >
          New Training Session
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
                <TableCell>Training Type</TableCell>
                <TableCell>Completion Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings.map((training) => {
                const expiryStatus = getExpiryStatus(training.expiry_date);
                return (
                  <TableRow key={training.training_id}>
                    <TableCell>{training.training_id}</TableCell>
                    <TableCell>{training.training_type}</TableCell>
                    <TableCell>
                      {new Date(training.completion_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {training.expiry_date ? 
                        new Date(training.expiry_date).toLocaleDateString() : 
                        'No Expiry'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expiryStatus.status}
                        color={expiryStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{training.trainer_name || 'Not specified'}</TableCell>
                    <TableCell>{training.participants_count || 0}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => navigate(`/training/${training.training_id}`)}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/training/${training.training_id}/edit`)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(training)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          Delete Training Session
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this training session? This action cannot be undone.
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

export default TrainingList;
