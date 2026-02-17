import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Calculate, Download } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PayrollManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [overtimeHours, setOvertimeHours] = useState(0);
    const [payrollRecords, setPayrollRecords] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchPayrollHistory();
        }
    }, [selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees', { params: { size: 1000 } });
            setEmployees(response.data.data.content);
        } catch (error) {
            toast.error('Failed to fetch employees');
        }
    };

    const fetchPayrollHistory = async () => {
        try {
            const response = await api.get(`/payroll/employee/${selectedEmployee}`);
            setPayrollRecords(response.data.data);
        } catch (error) {
            console.error('Failed to fetch payroll history');
        }
    };

    const handleGeneratePayroll = async () => {
        try {
            await api.post(`/payroll/generate/${selectedEmployee}/${month}/${year}`, null, {
                params: { overtimeHours },
            });
            toast.success('Payroll generated successfully');
            fetchPayrollHistory();
            setOvertimeHours(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate payroll');
        }
    };

    const handleDownloadPayslip = async (payrollId) => {
        try {
            const response = await api.get(`/payroll/download/${payrollId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payslip_${payrollId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Payslip downloaded successfully');
        } catch (error) {
            toast.error('Failed to download payslip');
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Payroll Management
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Generate Payroll
                        </Typography>
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    margin="normal"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    margin="normal"
                                >
                                    {[2023, 2024, 2025, 2026].map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Overtime Hours"
                            type="number"
                            value={overtimeHours}
                            onChange={(e) => setOvertimeHours(e.target.value)}
                            margin="normal"
                            inputProps={{ min: 0, step: 0.5 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Calculate />}
                            onClick={handleGeneratePayroll}
                            disabled={!selectedEmployee}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Generate Payroll
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Payroll History
                        </Typography>
                        <TableContainer sx={{ maxHeight: 500 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month/Year</TableCell>
                                        <TableCell>Base Salary</TableCell>
                                        <TableCell>Present Days</TableCell>
                                        <TableCell>Gross Salary</TableCell>
                                        <TableCell>Tax</TableCell>
                                        <TableCell>Net Salary</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payrollRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {record.month}/{record.year}
                                            </TableCell>
                                            <TableCell>₹{record.baseSalary}</TableCell>
                                            <TableCell>{record.presentDays}</TableCell>
                                            <TableCell>₹{record.grossSalary}</TableCell>
                                            <TableCell>₹{record.taxAmount}</TableCell>
                                            <TableCell>
                                                <strong>₹{record.netSalary}</strong>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleDownloadPayslip(record.id)}
                                                    size="small"
                                                >
                                                    <Download />
                                                </IconButton>
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

export default PayrollManagement;
