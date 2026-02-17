package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.AttendanceDTO;
import com.ems.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller for Attendance operations
 */
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management APIs")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    @Operation(summary = "Mark attendance for an employee")
    public ResponseEntity<ApiResponse<AttendanceDTO>> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        AttendanceDTO marked = attendanceService.markAttendance(attendanceDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance marked successfully", marked));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get attendance by employee and date range")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendanceByEmployee(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<AttendanceDTO> attendance = attendanceService.getAttendanceByEmployee(employeeId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(attendance));
    }

    @GetMapping("/report/{employeeId}/{month}/{year}")
    @Operation(summary = "Get monthly attendance report for an employee")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getMonthlyReport(
            @PathVariable Long employeeId,
            @PathVariable int month,
            @PathVariable int year) {

        List<AttendanceDTO> report = attendanceService.getMonthlyReport(employeeId, month, year);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
