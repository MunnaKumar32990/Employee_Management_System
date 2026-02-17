package com.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payroll entity
 */
@Entity
@Table(name = "payroll")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private int month; // 1-12

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private BigDecimal baseSalary;

    @Column(nullable = false)
    private int workingDays;

    @Column(nullable = false)
    private int presentDays;

    @Column(nullable = false)
    private int absentDays;

    private BigDecimal overtimeHours = BigDecimal.ZERO;

    private BigDecimal overtimeAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal grossSalary;

    @Column(nullable = false)
    private BigDecimal taxAmount;

    @Column(nullable = false)
    private BigDecimal netSalary;

    @Column(nullable = false)
    private LocalDate generatedDate;

    @Column(nullable = false)
    private boolean paid = false;
}
