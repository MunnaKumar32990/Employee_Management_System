package com.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * AuditLog entity for tracking system activities
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_entity_type", columnList = "entity_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Action action;

    @Column(nullable = false)
    private String entityType;

    private Long entityId;

    @Column(length = 2000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String ipAddress;

    private String userAgent;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String errorMessage;

    public enum Action {
        LOGIN, LOGOUT, LOGIN_FAILED,
        CREATE, READ, UPDATE, DELETE,
        EXPORT, IMPORT, DOWNLOAD,
        PASSWORD_CHANGE, PASSWORD_RESET,
        ACCOUNT_LOCKED, ACCOUNT_UNLOCKED
    }

    public enum Status {
        SUCCESS, FAILURE, PENDING
    }
}
