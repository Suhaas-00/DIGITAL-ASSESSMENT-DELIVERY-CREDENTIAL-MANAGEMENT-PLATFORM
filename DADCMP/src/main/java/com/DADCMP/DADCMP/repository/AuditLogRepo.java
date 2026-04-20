package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepo extends JpaRepository<AuditLog, Long> {
}
