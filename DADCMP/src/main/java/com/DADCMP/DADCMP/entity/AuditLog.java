package com.DADCMP.DADCMP.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();
}
