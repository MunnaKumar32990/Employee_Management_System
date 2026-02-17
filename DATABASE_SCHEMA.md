# Database Schema - Employee Management System

## Overview
This document describes the database schema for the Employee Management System using MySQL.

## Database Name
`employee_management_db`

## Tables

### 1. users
Stores user authentication and authorization information.

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);
```

**Columns:**
- `id`: Primary key
- `username`: Unique username for login
- `password`: BCrypt encrypted password
- `email`: User email address
- `role`: User role (ROLE_ADMIN, ROLE_HR)
- `enabled`: Account status

---

### 2. departments
Stores department information.

```sql
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500)
);
```

**Columns:**
- `id`: Primary key
- `name`: Department name (unique)
- `description`: Department description

---

### 3. employees
Stores employee information.

```sql
CREATE TABLE employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id BIGINT NOT NULL,
    joining_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

**Columns:**
- `id`: Primary key
- `first_name`: Employee first name
- `last_name`: Employee last name
- `email`: Employee email (unique)
- `phone_number`: Contact number
- `salary`: Monthly salary
- `department_id`: Foreign key to departments table
- `joining_date`: Date of joining
- `status`: Employment status (ACTIVE, INACTIVE)

**Relationships:**
- Many-to-One with departments

---

### 4. attendance
Stores daily attendance records.

```sql
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(500),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    UNIQUE KEY unique_employee_date (employee_id, date)
);
```

**Columns:**
- `id`: Primary key
- `employee_id`: Foreign key to employees table
- `date`: Attendance date
- `status`: Attendance status (PRESENT, ABSENT)
- `remarks`: Optional remarks

**Constraints:**
- Unique constraint on (employee_id, date) - one attendance record per employee per day

**Relationships:**
- Many-to-One with employees

---

### 5. payroll
Stores monthly payroll records.

```sql
CREATE TABLE payroll (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL,
    working_days INT NOT NULL,
    present_days INT NOT NULL,
    absent_days INT NOT NULL,
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    overtime_amount DECIMAL(10, 2) DEFAULT 0,
    gross_salary DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    generated_date DATE NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

**Columns:**
- `id`: Primary key
- `employee_id`: Foreign key to employees table
- `month`: Payroll month (1-12)
- `year`: Payroll year
- `base_salary`: Employee's base salary
- `working_days`: Total working days in month
- `present_days`: Days employee was present
- `absent_days`: Days employee was absent
- `overtime_hours`: Overtime hours worked
- `overtime_amount`: Overtime payment
- `gross_salary`: Total salary before deductions
- `tax_amount`: Tax deducted
- `net_salary`: Final salary after deductions
- `generated_date`: Date payroll was generated
- `paid`: Payment status

**Relationships:**
- Many-to-One with employees

---

## Entity Relationship Diagram

```
┌─────────────┐
│   users     │
└─────────────┘

┌─────────────┐         ┌──────────────┐
│ departments │◄────────┤  employees   │
└─────────────┘ 1     * └──────────────┘
                              │
                              │ 1
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    │ *                 │ *
              ┌─────▼──────┐      ┌────▼────┐
              │ attendance │      │ payroll │
              └────────────┘      └─────────┘
```

## Relationships Summary

1. **Department → Employee**: One-to-Many
   - One department can have multiple employees
   - Each employee belongs to one department

2. **Employee → Attendance**: One-to-Many
   - One employee can have multiple attendance records
   - Each attendance record belongs to one employee

3. **Employee → Payroll**: One-to-Many
   - One employee can have multiple payroll records
   - Each payroll record belongs to one employee

## Sample Data

### Insert Sample Department
```sql
INSERT INTO departments (name, description) VALUES
('Engineering', 'Software development and engineering'),
('Human Resources', 'HR and recruitment'),
('Finance', 'Finance and accounting'),
('Marketing', 'Marketing and sales');
```

### Insert Sample Admin User
```sql
INSERT INTO users (username, password, email, role, enabled) VALUES
('admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin@ems.com', 'ROLE_ADMIN', true);
-- Password: admin123
```

### Insert Sample Employee
```sql
INSERT INTO employees (first_name, last_name, email, phone_number, salary, department_id, joining_date, status) VALUES
('John', 'Doe', 'john.doe@example.com', '9876543210', 50000.00, 1, '2024-01-15', 'ACTIVE');
```

## Indexes

For optimal performance, consider adding these indexes:

```sql
-- Employee search optimization
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_status ON employees(status);
CREATE INDEX idx_employee_department ON employees(department_id);

-- Attendance queries
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);

-- Payroll queries
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_month_year ON payroll(month, year);
```

## Database Configuration

### MySQL Configuration
Ensure the following settings in your MySQL configuration:

```properties
# Character set
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# Timezone
default-time-zone='+00:00'

# Connection limits
max_connections=200
```

## Backup and Maintenance

### Backup Command
```bash
mysqldump -u root -p employee_management_db > backup.sql
```

### Restore Command
```bash
mysql -u root -p employee_management_db < backup.sql
```

## Notes

1. All tables use `BIGINT` for primary keys to support large datasets
2. Passwords are stored using BCrypt encryption
3. Decimal fields use precision (10,2) for monetary values
4. Unique constraints prevent duplicate records
5. Foreign keys maintain referential integrity
6. The schema is automatically created/updated by Hibernate when the application starts
