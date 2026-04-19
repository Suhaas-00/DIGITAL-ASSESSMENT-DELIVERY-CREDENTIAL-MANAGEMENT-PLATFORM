package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.enums.AttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttemptRepo extends JpaRepository<Attempt, Long> {
    List<Attempt> findByCandidateId(Long candidateId);

    List<Attempt> findByStatus(AttemptStatus status);

    List<Attempt> findAll();
}
