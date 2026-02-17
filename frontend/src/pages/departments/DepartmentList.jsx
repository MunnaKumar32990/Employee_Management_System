import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentDept, setCurrentDept] = useState({ id: null, name: '', description: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch departments');
        }
    };

    const handleOpen = (dept = null) => {
        if (dept) {
            setCurrentDept(dept);
            setEditMode(true);
        } else {
            setCurrentDept({ id: null, name: '', description: '' });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDept({ id: null, name: '', description: '' });
    };

    const handleSave = async () => {
        try {
            if (editMode) {
                await api.put(`/departments/${currentDept.id}`, currentDept);
                toast.success('Department updated successfully');
            } else {
                await api.post('/departments', currentDept);
                toast.success('Department created successfully');
            }
            handleClose();
            fetchDepartments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await api.delete(`/departments/${id}`);
                toast.success('Department deleted successfully');
                fetchDepartments();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete department');
            }
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Departments</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Department
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((dept) => (
                            <TableRow key={dept.id}>
                                <TableCell>{dept.id}</TableCell>
                                <TableCell>{dept.name}</TableCell>
                                <TableCell>{dept.description}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpen(dept)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(dept.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Department' : 'Add Department'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Department Name"
                        fullWidth
                        required
                        value={currentDept.name}
                        onChange={(e) => setCurrentDept({ ...currentDept, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={currentDept.description}
                        onChange={(e) => setCurrentDept({ ...currentDept, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DepartmentList;
