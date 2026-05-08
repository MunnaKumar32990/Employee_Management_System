import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent } from '@mui/material';
import { Login, PersonAdd, Dashboard as DashboardIcon, People, Business, AttachMoney } from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <People fontSize="large" />,
            title: 'Employee Management',
            description: 'Manage employee records, departments, and organizational structure'
        },
        {
            icon: <DashboardIcon fontSize="large" />,
            title: 'Dashboard & Analytics',
            description: 'Get real-time insights and statistics about your workforce'
        },
        {
            icon: <Business fontSize="large" />,
            title: 'Department Management',
            description: 'Organize and manage departments efficiently'
        },
        {
            icon: <AttachMoney fontSize="large" />,
            title: 'Payroll & Attendance',
            description: 'Track attendance and automate payroll processing'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container maxWidth="lg">
                <Box sx={{ pt: 8, pb: 6 }}>
                    <Typography
                        variant="h2"
                        align="center"
                        color="white"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Welcome to Employee Management System
                    </Typography>
                    <Typography variant="h5" align="center" color="white" paragraph sx={{ mb: 4 }}>
                        A comprehensive solution for managing your workforce efficiently
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 6 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Login />}
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                '&:hover': { bgcolor: '#f5f5f5' },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            Admin Sign In
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<PersonAdd />}
                            onClick={() => navigate('/setup')}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            First Time Setup
                        </Button>
                    </Box>

                    <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 6 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/employee/login')}
                            sx={{
                                bgcolor: '#2e7d32',
                                color: 'white',
                                '&:hover': { bgcolor: '#1b5e20' },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            Employee Login
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/employee/signup')}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            Employee Signup
                        </Button>
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'translateY(-8px)' }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                        <Box sx={{ color: '#667eea', mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Paper sx={{ mt: 6, p: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                            🚀 Getting Started
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>First Time User?</strong> Click on "First Time Setup" to create your admin account.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Already have an account?</strong> Click "Sign In" to access the system.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Default credentials (if admin already exists): <strong>admin</strong> / <strong>admin123</strong>
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
