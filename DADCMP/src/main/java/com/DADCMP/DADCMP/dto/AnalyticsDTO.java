package com.DADCMP.DADCMP.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AnalyticsDTO {
    private long totalAssessments;
    private long totalCandidates;
    private long totalAttempts;
    private long totalCredentialsIssued;
    private Map<String, Long> attemptsByStatus;
    private Map<String, Long> credentialsByAssessment;
    private double averageScore;
}
