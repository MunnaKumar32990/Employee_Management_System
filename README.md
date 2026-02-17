# Employee Management System

A production-ready full-stack web application for managing employees, departments, attendance, and payroll.

## 🚀 Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL** database
- **Maven** build tool
- **Swagger/OpenAPI** documentation
- **iText** for PDF generation

### Frontend
- **React 18** with **Vite**
- **Material-UI (MUI)** components
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications

## ✨ Features

- ✅ **User Authentication** - JWT-based secure login with role-based access
- ✅ **Employee Management** - CRUD operations with pagination, search, and filtering
- ✅ **Department Management** - Organize employees by departments
- ✅ **Attendance Tracking** - Mark daily attendance and generate monthly reports
- ✅ **Payroll System** - Automated salary calculation with tax deductions and overtime
- ✅ **PDF Generation** - Download payslips as PDF
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices

## 📁 Project Structure

```
EmployeeManagementSystem/
├── backend/           # Spring Boot REST API
├── frontend/          # React application
├── DATABASE_SCHEMA.md # Database documentation
└── SETUP_GUIDE.md     # Complete setup instructions
```

## 🛠️ Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+

### Setup

1. **Clone or navigate to the project**
   ```bash
   cd d:\EmployeeManagementSystem
   ```

2. **Setup Database**
   ```sql
   CREATE DATABASE employee_management_db;
   ```

3. **Configure Backend**
   - Edit `backend/src/main/resources/application.properties`
   - Update MySQL username and password

4. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Default Login
- **Username**: admin
- **Password**: admin123

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation and configuration
- **[Database Schema](DATABASE_SCHEMA.md)** - Database structure and relationships
- **[Backend README](backend/README.md)** - Backend API documentation
- **[Frontend README](frontend/README.md)** - Frontend application guide

## 🎯 Key Modules

### 1. Authentication
- JWT token-based authentication
- Role-based authorization (ADMIN, HR)
- Secure password encryption

### 2. Employee Management
- Add, edit, delete employees
- Search by name, email, or department
- Pagination and sorting
- Status management (Active/Inactive)

### 3. Department Management
- Create and manage departments
- Assign employees to departments
- View department statistics

### 4. Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance history
- Generate monthly reports

### 5. Payroll Management
- Calculate monthly salary based on attendance
- Tax deductions (configurable percentage)
- Overtime calculations
- Generate and download PDF payslips

## 🔒 Security

- BCrypt password encryption
- JWT token authentication
- CORS configuration
- Role-based endpoint protection
- SQL injection prevention via JPA

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (ADMIN only)
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - List all employees (paginated)
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/report/{employeeId}/{month}/{year}` - Monthly report

### Payroll
- `POST /api/payroll/generate/{employeeId}/{month}/{year}` - Generate payroll
- `GET /api/payroll/download/{id}` - Download payslip PDF

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 🏗️ Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/employee-management-system-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## 📝 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Database connection
- JWT secret and expiration
- Tax percentage
- Overtime rate

### Frontend Configuration
Edit `frontend/vite.config.js`:
- API proxy settings
- Development port

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is a complete production-ready system. Feel free to extend it with additional features like:
- Email notifications
- Leave management
- Performance reviews
- Document management
- Advanced reporting

---

**Built with ❤️ using Spring Boot and React**
