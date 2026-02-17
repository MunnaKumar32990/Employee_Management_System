import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box, Stepper, Step, StepLabel,
    Alert, CircularProgress
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';

const Setup = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const steps = ['Welcome', 'Create Admin Account', 'Complete'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = async () => {
        if (activeStep === 1) {
            // Validate and create admin
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match!');
                return;
            }

            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long!');
                return;
            }

            setLoading(true);
            try {
                await api.post('/auth/register', {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    role: 'ROLE_ADMIN'
                });
                toast.success('Admin account created successfully!');
                setActiveStep(2);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to create admin account. It may already exist.');
            } finally {
                setLoading(false);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate('/');
        } else {
            setActiveStep((prev) => prev - 1);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                            Welcome to Setup! 🎉
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This wizard will help you set up your Employee Management System for the first time.
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            You'll create an administrator account that will have full access to the system.
                        </Alert>
                        <Typography variant="body2" color="text.secondary">
                            <strong>What you'll need:</strong>
                            <ul>
                                <li>A unique username</li>
                                <li>A secure password (minimum 6 characters)</li>
                                <li>Your email address</li>
                            </ul>
                        </Typography>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                            Create Administrator Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            This account will have full administrative privileges.
                        </Typography>

                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            margin="normal"
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            margin="normal"
                            helperText="Minimum 6 characters"
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Box>
                );

            case 2:
                return (
                    <Box textAlign="center">
                        <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                        <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                            Setup Complete! 🎊
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Your administrator account has been created successfully.
                        </Typography>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <strong>Username:</strong> {formData.username}
                        </Alert>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            You can now sign in with your credentials and start managing your employees.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 2 }}
                        >
                            Go to Login
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 8 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ minHeight: 300 }}>
                        {renderStepContent()}
                    </Box>

                    {activeStep !== 2 && (
                        <Box display="flex" justifyContent="space-between" mt={4}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={handleBack}
                            >
                                {activeStep === 0 ? 'Back to Home' : 'Back'}
                            </Button>
                            <Button
                                variant="contained"
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                                onClick={handleNext}
                                disabled={loading || (activeStep === 1 && (!formData.username || !formData.password || !formData.email))}
                            >
                                {activeStep === 1 ? 'Create Account' : 'Next'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Setup;
