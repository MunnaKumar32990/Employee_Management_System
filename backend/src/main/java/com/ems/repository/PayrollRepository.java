package com.ems.repository;

import com.ems.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Payroll entity
 */
@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    Optional<Payroll> findByEmployeeIdAndMonthAndYear(Long employeeId, int month, int year);

    List<Payroll> findByEmployeeId(Long employeeId);

    List<Payroll> findByMonthAndYear(int month, int year);

    @Query("SELECT p FROM Payroll p WHERE p.employee.id = :employeeId " +
            "ORDER BY p.year DESC, p.month DESC")
    List<Payroll> findByEmployeeIdOrderByDateDesc(@Param("employeeId") Long employeeId);

    boolean existsByEmployeeIdAndMonthAndYear(Long employeeId, int month, int year);
}
