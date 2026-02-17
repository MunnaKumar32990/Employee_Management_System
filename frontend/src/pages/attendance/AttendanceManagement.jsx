import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { Save } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AttendanceManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [status, setStatus] = useState('PRESENT');
    const [remarks, setRemarks] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchMonthlyReport();
        }
    }, [selectedEmployee, month, year]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees', { params: { size: 1000 } });
            setEmployees(response.data.data.content);
        } catch (error) {
            toast.error('Failed to fetch employees');
        }
    };

    const fetchMonthlyReport = async () => {
        try {
            const response = await api.get(`/attendance/report/${selectedEmployee}/${month}/${year}`);
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error('Failed to fetch attendance report');
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            await api.post('/attendance/mark', {
                employeeId: selectedEmployee,
                date,
                status,
                remarks,
            });
            toast.success('Attendance marked successfully');
            setRemarks('');
            fetchMonthlyReport();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Attendance Management
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Mark Attendance
                        </Typography>
                        <form onSubmit={handleMarkAttendance}>
                            <TextField
                                select
                                fullWidth
                                label="Employee"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                                margin="normal"
                            >
                                {employees.map((emp) => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                margin="normal"
                            >
                                <MenuItem value="PRESENT">Present</MenuItem>
                                <MenuItem value="ABSENT">Absent</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                Mark Attendance
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Report
                        </Typography>
                        <Box display="flex" gap={2} mb={2}>
                            <TextField
                                select
                                label="Month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                size="small"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                size="small"
                            >
                                {[2023, 2024, 2025, 2026].map((y) => (
                                    <MenuItem key={y} value={y}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.date}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={record.status}
                                                    color={record.status === 'PRESENT' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AttendanceManagement;
