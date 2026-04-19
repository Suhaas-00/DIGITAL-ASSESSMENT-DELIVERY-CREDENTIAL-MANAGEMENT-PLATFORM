package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.enums.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepo extends JpaRepository<Assessment, Long> {
    List<Assessment> findByDomain(String domain);
    List<Assessment> findByStatus(AssessmentStatus status);
}
