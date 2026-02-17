package com.ems.service;

import com.ems.dto.EmployeeDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Employee operations
 */
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        if (employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + employeeDTO.getEmail() + "' already exists");
        }

        Employee employee = convertToEntity(employeeDTO);
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return convertToDTO(employee);
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Page<EmployeeDTO> searchEmployees(String search, Long departmentId, Pageable pageable) {
        if (search != null && !search.isEmpty() && departmentId != null) {
            return employeeRepository.searchEmployeesByDepartment(search, departmentId, pageable)
                    .map(this::convertToDTO);
        } else if (search != null && !search.isEmpty()) {
            return employeeRepository.searchEmployees(search, pageable).map(this::convertToDTO);
        } else if (departmentId != null) {
            return employeeRepository.findByDepartmentId(departmentId, pageable).map(this::convertToDTO);
        } else {
            return employeeRepository.findAll(pageable).map(this::convertToDTO);
        }
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        // Check if email is being changed and if it already exists
        if (!employee.getEmail().equals(employeeDTO.getEmail()) &&
                employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + employeeDTO.getEmail() + "' already exists");
        }

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhoneNumber(employeeDTO.getPhoneNumber());
        employee.setSalary(employeeDTO.getSalary());
        employee.setJoiningDate(employeeDTO.getJoiningDate());
        employee.setStatus(Employee.EmployeeStatus.valueOf(employeeDTO.getStatus()));

        // Update department if changed
        if (!employee.getDepartment().getId().equals(employeeDTO.getDepartmentId())) {
            Department department = departmentRepository.findById(employeeDTO.getDepartmentId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Department", "id", employeeDTO.getDepartmentId()));
            employee.setDepartment(department);
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
    }

    public long getActiveEmployeeCount() {
        return employeeRepository.countByStatus(Employee.EmployeeStatus.ACTIVE);
    }

    public long getTotalEmployeeCount() {
        return employeeRepository.count();
    }

    private Employee convertToEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setSalary(dto.getSalary());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setStatus(Employee.EmployeeStatus.valueOf(dto.getStatus()));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
        employee.setDepartment(department);

        return employee;
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setSalary(employee.getSalary());
        dto.setDepartmentId(employee.getDepartment().getId());
        dto.setDepartmentName(employee.getDepartment().getName());
        dto.setJoiningDate(employee.getJoiningDate());
        dto.setStatus(employee.getStatus().name());
        return dto;
    }
}
