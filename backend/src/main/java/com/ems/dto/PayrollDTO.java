package com.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for Payroll
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayrollDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private int month;
    private int year;
    private BigDecimal baseSalary;
    private int workingDays;
    private int presentDays;
    private int absentDays;
    private BigDecimal overtimeHours;
    private BigDecimal overtimeAmount;
    private BigDecimal grossSalary;
    private BigDecimal taxAmount;
    private BigDecimal netSalary;
    private LocalDate generatedDate;
    private boolean paid;
}
