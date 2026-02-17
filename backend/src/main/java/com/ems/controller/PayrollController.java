package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.PayrollDTO;
import com.ems.service.PayrollService;
import com.itextpdf.text.DocumentException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for Payroll operations
 */
@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@Tag(name = "Payroll", description = "Payroll management APIs")
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate/{employeeId}/{month}/{year}")
    @Operation(summary = "Generate payroll for an employee")
    public ResponseEntity<ApiResponse<PayrollDTO>> generatePayroll(
            @PathVariable Long employeeId,
            @PathVariable int month,
            @PathVariable int year,
            @RequestParam(required = false, defaultValue = "0") BigDecimal overtimeHours) {

        PayrollDTO payroll = payrollService.generatePayroll(employeeId, month, year, overtimeHours);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payroll generated successfully", payroll));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payroll by ID")
    public ResponseEntity<ApiResponse<PayrollDTO>> getPayrollById(@PathVariable Long id) {
        PayrollDTO payroll = payrollService.getPayrollById(id);
        return ResponseEntity.ok(ApiResponse.success(payroll));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get all payroll records for an employee")
    public ResponseEntity<ApiResponse<List<PayrollDTO>>> getPayrollByEmployee(@PathVariable Long employeeId) {
        List<PayrollDTO> payrolls = payrollService.getPayrollByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success(payrolls));
    }

    @GetMapping("/download/{id}")
    @Operation(summary = "Download payslip as PDF")
    public ResponseEntity<byte[]> downloadPayslip(@PathVariable Long id) throws DocumentException {
        byte[] pdfBytes = payrollService.generatePayslipPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "payslip_" + id + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
