import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, TextField, IconButton, Chip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [page, rowsPerPage, search, selectedDepartment]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch departments');
        }
    };

    const fetchEmployees = async () => {
        try {
            const params = {
                page,
                size: rowsPerPage,
                sortBy: 'id',
                sortDir: 'DESC',
            };

            if (search) params.search = search;
            if (selectedDepartment) params.departmentId = selectedDepartment;

            const response = await api.get('/employees', { params });
            setEmployees(response.data.data.content);
            setTotalElements(response.data.data.totalElements);
        } catch (error) {
            toast.error('Failed to fetch employees');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/employees/${id}`);
                toast.success('Employee deleted successfully');
                fetchEmployees();
            } catch (error) {
                toast.error('Failed to delete employee');
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Employees</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/app/employees/new')}
                >
                    Add Employee
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Box display="flex" gap={2}>
                    <TextField
                        placeholder="Search by name or email..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={selectedDepartment}
                            label="Department"
                            onChange={(e) => {
                                setSelectedDepartment(e.target.value);
                                setPage(0);
                            }}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.id}</TableCell>
                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phoneNumber}</TableCell>
                                <TableCell>{employee.departmentName}</TableCell>
                                <TableCell>₹{employee.salary}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={employee.status}
                                        color={employee.status === 'ACTIVE' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/employees/edit/${employee.id}`)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(employee.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>
        </Box>
    );
};

export default EmployeeList;
