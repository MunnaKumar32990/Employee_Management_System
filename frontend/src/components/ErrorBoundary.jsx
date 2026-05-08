import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                    bgcolor="#f5f5f5"
                    p={3}
                >
                    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
                        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'left' }}>
                                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {this.state.error.toString()}
                                </Typography>
                            </Box>
                        )}
                        <Box display="flex" gap={2} justifyContent="center" mt={3}>
                            <Button variant="contained" onClick={this.handleReload}>
                                Reload Page
                            </Button>
                            <Button variant="outlined" onClick={this.handleGoHome}>
                                Go to Home
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
