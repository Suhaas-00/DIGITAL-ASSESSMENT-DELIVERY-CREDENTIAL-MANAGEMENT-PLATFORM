package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Attempt;
import java.util.List;

public interface AttemptService {

    Attempt startAttempt(Long candidateId, Long assessmentId);

    Attempt submitAttempt(Long attemptId, String responses);

    Attempt evaluateAttempt(Long attemptId, Integer score);

    Attempt getAttemptById(Long id);

    List<Attempt> getAttemptsByCandidate(Long candidateId); // ✅ FIXED

    List<Attempt> getAllAttempts();

    Attempt autoEvaluateAttempt(Long attemptId);
}
