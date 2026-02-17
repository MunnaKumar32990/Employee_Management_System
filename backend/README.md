# Employee Management System - Backend

## Overview
This is the backend application for the Employee Management System built with Spring Boot, providing RESTful APIs for managing employees, departments, attendance, and payroll.

## Technology Stack
- **Java**: 17
- **Spring Boot**: 3.2.2
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Documentation**: Swagger/OpenAPI
- **PDF Generation**: iText

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

### 1. Install MySQL
Download and install MySQL from [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

### 2. Create Database
The application will automatically create the database `employee_management_db` if it doesn't exist.

Alternatively, you can create it manually:
```sql
CREATE DATABASE employee_management_db;
```

### 3. Configure Database Connection
Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

## Installation & Running

### 1. Clone the repository
```bash
cd d:\EmployeeManagementSystem\backend
```

### 2. Build the project
```bash
mvn clean install
```

### 3. Run the application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

### Swagger UI
Once the application is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user (ADMIN only)
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

#### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/{id}` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

#### Employees
- `GET /api/employees` - Get all employees (with pagination, sorting, search)
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/employees/stats/count` - Get employee statistics

#### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/employee/{employeeId}` - Get attendance by date range
- `GET /api/attendance/report/{employeeId}/{month}/{year}` - Get monthly report

#### Payroll
- `POST /api/payroll/generate/{employeeId}/{month}/{year}` - Generate payroll
- `GET /api/payroll/{id}` - Get payroll by ID
- `GET /api/payroll/employee/{employeeId}` - Get employee payroll history
- `GET /api/payroll/download/{id}` - Download payslip PDF

#### System
- `GET /api/health` - Health check

## Default Users

After first run, you'll need to create an admin user. You can do this by temporarily allowing public access to the register endpoint or by inserting directly into the database:

```sql
INSERT INTO users (username, password, email, role, enabled) 
VALUES ('admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin@ems.com', 'ROLE_ADMIN', true);
```
Password: `admin123`

## Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/ems/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── exception/       # Exception handling
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── security/        # Security & JWT
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Unit tests
└── pom.xml
```

## Security
- JWT-based authentication
- Role-based access control (ADMIN, HR)
- BCrypt password encryption
- CORS enabled for frontend integration

## Features
- ✅ User authentication and authorization
- ✅ Department management
- ✅ Employee CRUD with pagination and search
- ✅ Attendance tracking
- ✅ Automated payroll calculation
- ✅ PDF payslip generation
- ✅ Tax and overtime calculations
- ✅ Global exception handling
- ✅ API documentation with Swagger

## Configuration

### JWT Configuration
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000  # 24 hours
```

### Payroll Configuration
```properties
payroll.tax.percentage=10      # 10% tax
payroll.overtime.rate=1.5      # 1.5x overtime rate
```

## Testing
Run unit tests:
```bash
mvn test
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check credentials in application.properties
- Verify database exists

### Port Already in Use
Change the port in application.properties:
```properties
server.port=8081
```

## License
This project is for educational purposes.
