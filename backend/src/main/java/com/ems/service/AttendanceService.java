package com.ems.service;

import com.ems.dto.AttendanceDTO;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Attendance operations
 */
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceDTO markAttendance(AttendanceDTO attendanceDTO) {
        Employee employee = employeeRepository.findById(attendanceDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", attendanceDTO.getEmployeeId()));

        // Check if attendance already marked for this date
        if (attendanceRepository.findByEmployeeIdAndDate(attendanceDTO.getEmployeeId(), attendanceDTO.getDate())
                .isPresent()) {
            throw new IllegalArgumentException("Attendance already marked for this date");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(attendanceDTO.getDate());
        attendance.setStatus(Attendance.AttendanceStatus.valueOf(attendanceDTO.getStatus()));
        attendance.setRemarks(attendanceDTO.getRemarks());

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToDTO(savedAttendance);
    }

    public List<AttendanceDTO> getAttendanceByEmployee(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getMonthlyReport(Long employeeId, int month, int year) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        return attendanceRepository.findByEmployeeAndMonthAndYear(employeeId, month, year)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getPresentDaysCount(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.countByEmployeeAndDateRangeAndStatus(
                employeeId, startDate, endDate, Attendance.AttendanceStatus.PRESENT);
    }

    public long getAbsentDaysCount(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.countByEmployeeAndDateRangeAndStatus(
                employeeId, startDate, endDate, Attendance.AttendanceStatus.ABSENT);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setEmployeeId(attendance.getEmployee().getId());
        dto.setEmployeeName(attendance.getEmployee().getFullName());
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus().name());
        dto.setRemarks(attendance.getRemarks());
        return dto;
    }
}
