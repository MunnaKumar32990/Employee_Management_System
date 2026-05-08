package com.ems.repository;

import com.ems.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AuditLog entity
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    
    Page<AuditLog> findByUsername(String username, Pageable pageable);
    
    Page<AuditLog> findByAction(AuditLog.Action action, Pageable pageable);
    
    Page<AuditLog> findByEntityType(String entityType, Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.timestamp BETWEEN :startDate AND :endDate")
    Page<AuditLog> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT al FROM AuditLog al WHERE al.username = :username " +
           "AND al.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findUserActivityInRange(
        @Param("username") String username,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Modifying
    @Query("DELETE FROM AuditLog al WHERE al.timestamp < :cutoffDate")
    void deleteOldLogs(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.username = :username " +
           "AND al.action = :action AND al.status = :status " +
           "AND al.timestamp > :since")
    long countRecentActions(
        @Param("username") String username,
        @Param("action") AuditLog.Action action,
        @Param("status") AuditLog.Status status,
        @Param("since") LocalDateTime since
    );
}
