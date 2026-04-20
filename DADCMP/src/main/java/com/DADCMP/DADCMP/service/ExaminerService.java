package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.enums.DifficultyLevel;

public interface ExaminerService {

    Assessment autoGenerateAssessment(
            Long examinerId,
            String title,
            String domain,
            DifficultyLevel difficulty,
            int count);

    Attempt evaluateAttempt(
            Long examinerId,
            Long attemptId,
            Integer overriddenScore,
            String remarks);
}