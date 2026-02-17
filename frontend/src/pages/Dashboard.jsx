import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { People, Business, CheckCircle, AttachMoney } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4">{value}</Typography>
            </Box>
            <Box
                sx={{
                    backgroundColor: color,
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                {icon}
            </Box>
        </Box>
    </Paper>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        totalDepartments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [employeeStats, departments] = await Promise.all([
                api.get('/employees/stats/count'),
                api.get('/departments'),
            ]);

            setStats({
                totalEmployees: employeeStats.data.data.totalEmployees,
                activeEmployees: employeeStats.data.data.activeEmployees,
                totalDepartments: departments.data.data.length,
            });
        } catch (error) {
            toast.error('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
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
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Employees"
                        value={stats.totalEmployees}
                        icon={<People fontSize="large" />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Employees"
                        value={stats.activeEmployees}
                        icon={<CheckCircle fontSize="large" />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Departments"
                        value={stats.totalDepartments}
                        icon={<Business fontSize="large" />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Payroll"
                        value="Active"
                        icon={<AttachMoney fontSize="large" />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
