import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
    const content = (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
        >
            <CircularProgress size={fullScreen ? 60 : 40} />
            {message && (
                <Typography variant="body1" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                {content}
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            {content}
        </Box>
    );
};

export default LoadingSpinner;
