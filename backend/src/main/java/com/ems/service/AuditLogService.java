package com.ems.service;

import com.ems.entity.AuditLog;
import com.ems.entity.User;
import com.ems.repository.AuditLogRepository;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service for audit logging operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Async
    @Transactional
    public void log(String username, AuditLog.Action action, String entityType, 
                    Long entityId, String details, String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = new AuditLog();
            
            // Get user ID if username provided
            if (username != null) {
                userRepository.findByUsername(username).ifPresent(user -> {
                    auditLog.setUserId(user.getId());
                });
            }
            
            auditLog.setUsername(username != null ? username : "anonymous");
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setDetails(details);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setStatus(AuditLog.Status.SUCCESS);
            
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }

    @Async
    @Transactional
    public void logFailure(String username, AuditLog.Action action, String entityType,
                          String errorMessage, String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUsername(username != null ? username : "anonymous");
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setStatus(AuditLog.Status.FAILURE);
            auditLog.setErrorMessage(errorMessage);
            
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to create failure audit log", e);
        }
    }

    public Page<AuditLog> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    public Page<AuditLog> getLogsByUser(String username, Pageable pageable) {
        return auditLogRepository.findByUsername(username, pageable);
    }

    public Page<AuditLog> getLogsByAction(AuditLog.Action action, Pageable pageable) {
        return auditLogRepository.findByAction(action, pageable);
    }

    public Page<AuditLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, 
                                             Pageable pageable) {
        return auditLogRepository.findByDateRange(startDate, endDate, pageable);
    }

    public long countFailedLoginAttempts(String username, LocalDateTime since) {
        return auditLogRepository.countRecentActions(
            username, 
            AuditLog.Action.LOGIN_FAILED, 
            AuditLog.Status.FAILURE, 
            since
        );
    }

    @Transactional
    public void cleanupOldLogs(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        auditLogRepository.deleteOldLogs(cutoffDate);
        log.info("Cleaned up audit logs older than {} days", daysToKeep);
    }
}
