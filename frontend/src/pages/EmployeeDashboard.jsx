import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Paper, Card, CardContent, Badge, IconButton,
    List, ListItem, ListItemText, Divider, Chip, Button
} from '@mui/material';
import {
    Notifications, Person, AttachMoney, EventNote, CheckCircle, Cancel
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({
        totalAttendance: 0,
        presentDays: 0,
        totalPayroll: 0
    });
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        fetchStats();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread/count');
            setUnreadCount(response.data.data);
        } catch (error) {
            console.error('Failed to fetch unread count');
        }
    };

    const fetchStats = async () => {
        try {
            // Fetch user's employee data and stats
            const profileResponse = await api.get('/auth/profile');
            // You can add more stats here based on your needs
            setStats({
                totalAttendance: 0,
                presentDays: 0,
                totalPayroll: 0
            });
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            fetchNotifications();
            fetchUnreadCount();
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'STATUS_CHANGE':
                return <Person color="primary" />;
            case 'PAYROLL_GENERATED':
                return <AttachMoney color="success" />;
            case 'ATTENDANCE_MARKED':
                return <EventNote color="info" />;
            default:
                return <Notifications />;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Welcome, {user?.username}!
                </Typography>
                <IconButton onClick={() => setShowNotifications(!showNotifications)}>
                    <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Attendance
                                    </Typography>
                                    <Typography variant="h4">{stats.totalAttendance}</Typography>
                                </Box>
                                <EventNote sx={{ fontSize: 50, color: '#1976d2' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Present Days
                                    </Typography>
                                    <Typography variant="h4">{stats.presentDays}</Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 50, color: '#2e7d32' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Payroll
                                    </Typography>
                                    <Typography variant="h4">₹{stats.totalPayroll}</Typography>
                                </Box>
                                <AttachMoney sx={{ fontSize: 50, color: '#9c27b0' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notifications Panel */}
                {showNotifications && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Notifications</Typography>
                                {unreadCount > 0 && (
                                    <Button size="small" onClick={handleMarkAllAsRead}>
                                        Mark All as Read
                                    </Button>
                                )}
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {notifications.length === 0 ? (
                                <Typography color="text.secondary" align="center">
                                    No notifications
                                </Typography>
                            ) : (
                                <List>
                                    {notifications.map((notification) => (
                                        <React.Fragment key={notification.id}>
                                            <ListItem
                                                sx={{
                                                    bgcolor: notification.isRead ? 'transparent' : '#f5f5f5',
                                                    borderRadius: 1,
                                                    mb: 1
                                                }}
                                                secondaryAction={
                                                    !notification.isRead && (
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                        >
                                                            Mark Read
                                                        </Button>
                                                    )
                                                }
                                            >
                                                <Box display="flex" alignItems="flex-start" width="100%">
                                                    <Box mr={2} mt={0.5}>
                                                        {getNotificationIcon(notification.type)}
                                                    </Box>
                                                    <Box flexGrow={1}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {notification.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {notification.message}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {format(new Date(notification.createdAt), 'PPpp')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                )}

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid item>
                                <Button variant="contained" startIcon={<EventNote />}>
                                    View Attendance
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" startIcon={<AttachMoney />}>
                                    View Payroll
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" startIcon={<Person />}>
                                    Update Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeDashboard;
