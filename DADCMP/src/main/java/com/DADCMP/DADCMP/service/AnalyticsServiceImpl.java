package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.dto.AnalyticsDTO;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private AttemptRepo attemptRepo;

    @Autowired
    private CredentialRepo credentialRepo;

    @Override
    public AnalyticsDTO getSystemAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        analytics.setTotalAssessments(assessmentRepo.count());
        analytics.setTotalCandidates(usersRepo.count()); // Simplified: counting all users
        analytics.setTotalAttempts(attemptRepo.count());
        analytics.setTotalCredentialsIssued(credentialRepo.count());
        
        analytics.setAttemptsByStatus(
            attemptRepo.findAll().stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()))
        );
        
        analytics.setCredentialsByAssessment(
            credentialRepo.findAll().stream()
                .collect(Collectors.groupingBy(c -> c.getAssessment().getTitle(), Collectors.counting()))
        );
        
        analytics.setAverageScore(
            attemptRepo.findAll().stream()
                .filter(a -> a.getScore() != null)
                .mapToInt(Attempt::getScore)
                .average()
                .orElse(0.0)
        );
        
        return analytics;
    }
}
