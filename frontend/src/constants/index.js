// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_VERSION = 'v1';

// Application Routes
export const ROUTES = {
    HOME: '/',
    SETUP: '/setup',
    LOGIN: '/login',
    APP: '/app',
    DASHBOARD: '/app/dashboard',
    EMPLOYEES: '/app/employees',
    EMPLOYEES_NEW: '/app/employees/new',
    EMPLOYEES_EDIT: (id) => `/app/employees/edit/${id}`,
    DEPARTMENTS: '/app/departments',
    ATTENDANCE: '/app/attendance',
    PAYROLL: '/app/payroll',
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
    },
    EMPLOYEES: {
        BASE: '/employees',
        BY_ID: (id) => `/employees/${id}`,
        STATS: '/employees/stats/count',
    },
    DEPARTMENTS: {
        BASE: '/departments',
        BY_ID: (id) => `/departments/${id}`,
    },
    ATTENDANCE: {
        MARK: '/attendance/mark',
        BY_EMPLOYEE: (employeeId) => `/attendance/employee/${employeeId}`,
        REPORT: (employeeId, month, year) => `/attendance/report/${employeeId}/${month}/${year}`,
    },
    PAYROLL: {
        GENERATE: (employeeId, month, year) => `/payroll/generate/${employeeId}/${month}/${year}`,
        BY_ID: (id) => `/payroll/${id}`,
        BY_EMPLOYEE: (employeeId) => `/payroll/employee/${employeeId}`,
        DOWNLOAD: (id) => `/payroll/download/${id}`,
    },
};

// Application Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Employee Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// Status
export const EMPLOYEE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
};

export const ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
};

// Roles
export const USER_ROLES = {
    ADMIN: 'ROLE_ADMIN',
    HR: 'ROLE_HR',
    EMPLOYEE: 'ROLE_EMPLOYEE',
};

// Validation
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    PHONE_LENGTH: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
