import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box, Alert, Grid
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmployeeSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'ROLE_EMPLOYEE'
            });

            toast.success('Registration successful! Please login.');
            navigate('/employee/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <PersonAdd sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Employee Registration
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create your employee account
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
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
                            helperText="Minimum 8 characters, include uppercase, lowercase, and digit"
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Button onClick={() => navigate('/employee/login')}>
                                Already have an account? Login
                            </Button>
                            <Button onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default EmployeeSignup;
