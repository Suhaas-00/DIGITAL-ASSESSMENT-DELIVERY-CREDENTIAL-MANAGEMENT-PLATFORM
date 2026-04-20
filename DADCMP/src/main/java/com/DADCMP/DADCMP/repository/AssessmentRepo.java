package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.enums.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepo extends JpaRepository<Assessment, Long> {
    List<Assessment> findByDomain(String domain);
    List<Assessment> findByStatus(AssessmentStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM Assessment a WHERE a.startDateTime > :now")
    List<Assessment> findUpcoming(java.time.LocalDateTime now);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM Assessment a WHERE a.startDateTime <= :now AND a.endDateTime >= :now")
    List<Assessment> findActive(java.time.LocalDateTime now);

    List<Assessment> findByCreatedById(Long createdBy);
}
