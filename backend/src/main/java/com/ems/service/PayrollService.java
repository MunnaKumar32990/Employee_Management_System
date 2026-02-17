package com.ems.service;

import com.ems.dto.PayrollDTO;
import com.ems.entity.Employee;
import com.ems.entity.Payroll;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.PayrollRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Payroll operations
 */
@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceService attendanceService;

    @Value("${payroll.tax.percentage}")
    private double taxPercentage;

    @Value("${payroll.overtime.rate}")
    private double overtimeRate;

    @Transactional
    public PayrollDTO generatePayroll(Long employeeId, int month, int year, BigDecimal overtimeHours) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        // Check if payroll already exists for this month
        if (payrollRepository.existsByEmployeeIdAndMonthAndYear(employeeId, month, year)) {
            throw new IllegalArgumentException("Payroll already generated for this month");
        }

        // Calculate working days in month
        YearMonth yearMonth = YearMonth.of(year, month);
        int workingDays = yearMonth.lengthOfMonth();

        // Get attendance data
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = LocalDate.of(year, month, workingDays);

        long presentDays = attendanceService.getPresentDaysCount(employeeId, startDate, endDate);
        long absentDays = attendanceService.getAbsentDaysCount(employeeId, startDate, endDate);

        // Calculate salary
        BigDecimal baseSalary = employee.getSalary();
        BigDecimal dailySalary = baseSalary.divide(BigDecimal.valueOf(workingDays), 2, RoundingMode.HALF_UP);
        BigDecimal earnedSalary = dailySalary.multiply(BigDecimal.valueOf(presentDays));

        // Calculate overtime
        BigDecimal overtimeAmount = BigDecimal.ZERO;
        if (overtimeHours != null && overtimeHours.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal hourlyRate = baseSalary.divide(BigDecimal.valueOf(workingDays * 8), 2, RoundingMode.HALF_UP);
            overtimeAmount = hourlyRate.multiply(BigDecimal.valueOf(overtimeRate))
                    .multiply(overtimeHours)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // Calculate gross salary
        BigDecimal grossSalary = earnedSalary.add(overtimeAmount);

        // Calculate tax
        BigDecimal taxAmount = grossSalary.multiply(BigDecimal.valueOf(taxPercentage / 100))
                .setScale(2, RoundingMode.HALF_UP);

        // Calculate net salary
        BigDecimal netSalary = grossSalary.subtract(taxAmount);

        // Create payroll record
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setMonth(month);
        payroll.setYear(year);
        payroll.setBaseSalary(baseSalary);
        payroll.setWorkingDays(workingDays);
        payroll.setPresentDays((int) presentDays);
        payroll.setAbsentDays((int) absentDays);
        payroll.setOvertimeHours(overtimeHours != null ? overtimeHours : BigDecimal.ZERO);
        payroll.setOvertimeAmount(overtimeAmount);
        payroll.setGrossSalary(grossSalary);
        payroll.setTaxAmount(taxAmount);
        payroll.setNetSalary(netSalary);
        payroll.setGeneratedDate(LocalDate.now());
        payroll.setPaid(false);

        Payroll savedPayroll = payrollRepository.save(payroll);
        return convertToDTO(savedPayroll);
    }

    public PayrollDTO getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll", "id", id));
        return convertToDTO(payroll);
    }

    public List<PayrollDTO> getPayrollByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        return payrollRepository.findByEmployeeIdOrderByDateDesc(employeeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public byte[] generatePayslipPDF(Long payrollId) throws DocumentException {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll", "id", payrollId));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Paragraph title = new Paragraph("PAYSLIP", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Employee Details
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);

        document.add(new Paragraph("Employee Details", headerFont));
        document.add(new Paragraph("Name: " + payroll.getEmployee().getFullName(), normalFont));
        document.add(new Paragraph("Email: " + payroll.getEmployee().getEmail(), normalFont));
        document.add(new Paragraph("Department: " + payroll.getEmployee().getDepartment().getName(), normalFont));
        document.add(new Paragraph("Month/Year: " + payroll.getMonth() + "/" + payroll.getYear(), normalFont));
        document.add(new Paragraph(" "));

        // Salary Details Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        // Header
        PdfPCell cell = new PdfPCell(new Phrase("Description", headerFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Amount", headerFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);

        // Data
        table.addCell(new Phrase("Base Salary", normalFont));
        table.addCell(new Phrase("₹" + payroll.getBaseSalary(), normalFont));

        table.addCell(new Phrase("Working Days", normalFont));
        table.addCell(new Phrase(String.valueOf(payroll.getWorkingDays()), normalFont));

        table.addCell(new Phrase("Present Days", normalFont));
        table.addCell(new Phrase(String.valueOf(payroll.getPresentDays()), normalFont));

        table.addCell(new Phrase("Absent Days", normalFont));
        table.addCell(new Phrase(String.valueOf(payroll.getAbsentDays()), normalFont));

        table.addCell(new Phrase("Overtime Hours", normalFont));
        table.addCell(new Phrase(String.valueOf(payroll.getOvertimeHours()), normalFont));

        table.addCell(new Phrase("Overtime Amount", normalFont));
        table.addCell(new Phrase("₹" + payroll.getOvertimeAmount(), normalFont));

        table.addCell(new Phrase("Gross Salary", normalFont));
        table.addCell(new Phrase("₹" + payroll.getGrossSalary(), normalFont));

        table.addCell(new Phrase("Tax (" + taxPercentage + "%)", normalFont));
        table.addCell(new Phrase("₹" + payroll.getTaxAmount(), normalFont));

        // Net Salary
        cell = new PdfPCell(new Phrase("Net Salary", headerFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("₹" + payroll.getNetSalary(), headerFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);

        document.add(table);

        // Footer
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Generated on: " + payroll.getGeneratedDate(), normalFont));

        document.close();
        return baos.toByteArray();
    }

    private PayrollDTO convertToDTO(Payroll payroll) {
        PayrollDTO dto = new PayrollDTO();
        dto.setId(payroll.getId());
        dto.setEmployeeId(payroll.getEmployee().getId());
        dto.setEmployeeName(payroll.getEmployee().getFullName());
        dto.setMonth(payroll.getMonth());
        dto.setYear(payroll.getYear());
        dto.setBaseSalary(payroll.getBaseSalary());
        dto.setWorkingDays(payroll.getWorkingDays());
        dto.setPresentDays(payroll.getPresentDays());
        dto.setAbsentDays(payroll.getAbsentDays());
        dto.setOvertimeHours(payroll.getOvertimeHours());
        dto.setOvertimeAmount(payroll.getOvertimeAmount());
        dto.setGrossSalary(payroll.getGrossSalary());
        dto.setTaxAmount(payroll.getTaxAmount());
        dto.setNetSalary(payroll.getNetSalary());
        dto.setGeneratedDate(payroll.getGeneratedDate());
        dto.setPaid(payroll.isPaid());
        return dto;
    }
}
