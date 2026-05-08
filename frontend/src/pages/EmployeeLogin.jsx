import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const EmployeeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            // Check user role from stored user data
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.role === 'ROLE_EMPLOYEE') {
                navigate('/employee/dashboard');
            } else {
                setError('This login is for employees only. Please use admin/HR login.');
                setLoading(false);
                return;
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center' }}>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <LoginIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Employee Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to access your dashboard
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            margin="normal"
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Box display="flex" justifyContent="space-between">
                            <Button onClick={() => navigate('/employee/signup')}>
                                Create Account
                            </Button>
                            <Button onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default EmployeeLogin;
