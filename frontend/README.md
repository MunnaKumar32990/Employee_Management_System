# Employee Management System - Frontend

## Overview
This is the frontend application for the Employee Management System built with React and Material-UI, providing a modern and responsive user interface.

## Technology Stack
- **React**: 18.2.0
- **Vite**: Build tool
- **Material-UI (MUI)**: UI component library
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Toastify**: Toast notifications

## Prerequisites
- Node.js 16+ and npm

## Installation

### 1. Navigate to frontend directory
```bash
cd d:\EmployeeManagementSystem\frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Configuration

### API Proxy
The Vite configuration includes a proxy to the backend API. Requests to `/api/*` are automatically forwarded to `http://localhost:8080`.

Update `vite.config.js` if your backend runs on a different port:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
    }
  }
}
```

## Features

### Authentication
- JWT-based login
- Secure token storage
- Automatic token refresh
- Protected routes

### Dashboard
- Employee statistics
- Department count
- Active employees count
- Quick overview cards

### Employee Management
- List all employees with pagination
- Search by name or email
- Filter by department
- Add new employee
- Edit employee details
- Delete employee
- Sort by various fields

### Department Management
- View all departments
- Create new department
- Edit department
- Delete department

### Attendance Management
- Mark daily attendance
- View monthly attendance report
- Filter by employee and date range
- Present/Absent status tracking

### Payroll Management
- Generate monthly payroll
- Calculate salary based on attendance
- Tax deductions
- Overtime calculations
- Download payslip as PDF
- View payroll history

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── employees/
│   │   │   ├── EmployeeList.jsx
│   │   │   └── EmployeeForm.jsx
│   │   ├── departments/
│   │   │   └── DepartmentList.jsx
│   │   ├── attendance/
│   │   │   └── AttendanceManagement.jsx
│   │   └── payroll/
│   │       └── PayrollManagement.jsx
│   ├── services/
│   │   └── api.js              # Axios configuration
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Default Login Credentials

After setting up the backend, use these credentials:
- **Username**: admin
- **Password**: admin123

## UI Features

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive layouts
- Mobile-friendly navigation

### Material Design
- Clean and modern interface
- Consistent color scheme
- Intuitive icons
- Smooth animations

### User Experience
- Toast notifications for actions
- Loading states
- Error handling
- Confirmation dialogs
- Form validation

## API Integration

All API calls are made through the centralized Axios instance in `src/services/api.js`:

```javascript
import api from '../services/api';

// Example usage
const response = await api.get('/employees');
const data = response.data.data;
```

The API service automatically:
- Adds JWT token to requests
- Handles 401 unauthorized errors
- Redirects to login on authentication failure

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory. You can serve it with any static file server.

## Troubleshooting

### Port Already in Use
Change the port in `vite.config.js`:
```javascript
server: {
  port: 3000, // or any other port
}
```

### API Connection Issues
- Ensure backend is running on port 8080
- Check proxy configuration in vite.config.js
- Verify CORS is enabled in backend

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License
This project is for educational purposes.
