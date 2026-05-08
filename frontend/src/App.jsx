import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import DepartmentList from './pages/departments/DepartmentList';
import AttendanceManagement from './pages/attendance/AttendanceManagement';
import PayrollManagement from './pages/payroll/PayrollManagement';
import EmployeeSignup from './pages/EmployeeSignup';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/setup" element={<Setup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/employee/signup" element={<EmployeeSignup />} />
                            <Route path="/employee/login" element={<EmployeeLogin />} />
                            <Route
                                path="/employee/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <EmployeeDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app"
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Navigate to="/app/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="employees" element={<EmployeeList />} />
                                <Route path="employees/new" element={<EmployeeForm />} />
                                <Route path="employees/edit/:id" element={<EmployeeForm />} />
                                <Route path="departments" element={<DepartmentList />} />
                                <Route path="attendance" element={<AttendanceManagement />} />
                                <Route path="payroll" element={<PayrollManagement />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                    <ToastContainer position="top-right" autoClose={3000} />
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
