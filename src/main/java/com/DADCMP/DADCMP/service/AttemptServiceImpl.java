package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.entity.User;
import com.DADCMP.DADCMP.enums.AttemptStatus;
import com.DADCMP.DADCMP.repository.AssessmentRepo;
import com.DADCMP.DADCMP.repository.AttemptRepo;
import com.DADCMP.DADCMP.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttemptServiceImpl implements AttemptService {

    @Autowired
    private AttemptRepo attemptRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Autowired
    private CredentialService credentialService;

    @Override
    public Attempt startAttempt(Long candidateId, Long assessmentId) {
        User candidate = usersRepo.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        Attempt attempt = new Attempt();
        attempt.setCandidate(candidate);
        attempt.setAssessment(assessment);
        attempt.setStartTime(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.IN_PROGRESS);
        return attemptRepo.save(attempt);
    }

    @Override
    public Attempt submitAttempt(Long attemptId, String responses) {
        Attempt attempt = getAttemptById(attemptId);
        attempt.setResponses(responses);
        attempt.setEndTime(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.SUBMITTED);
        return attemptRepo.save(attempt);
    }

    @Override
    public Attempt evaluateAttempt(Long attemptId, Integer score) {
        Attempt attempt = getAttemptById(attemptId);
        attempt.setScore(score);
        attemptRepo.save(attempt);

        // Check if passing
        if (score >= attempt.getAssessment().getPassingMarks()) {
            credentialService.generateCredential(attempt.getCandidate().getId(), attempt.getAssessment().getId());
        }

        return attempt;
    }

    @Override
    public Attempt getAttemptById(Long id) {
        return attemptRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Attempt not found with id: " + id));
    }

    @Override
    public List<Attempt> getAttemptsByCandidate(Long candidateId) {
        return attemptRepo.findByCandidateId(candidateId);
    }

    @Override
    public List<Attempt> getAllAttempts() {
        return attemptRepo.findAll();
    }
}
