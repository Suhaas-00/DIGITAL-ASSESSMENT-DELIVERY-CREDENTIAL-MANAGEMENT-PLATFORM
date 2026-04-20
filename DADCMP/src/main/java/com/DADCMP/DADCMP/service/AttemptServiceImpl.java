package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.repository.QuestionRepo;
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
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.DADCMP.DADCMP.entity.Question;

@Service
public class AttemptServiceImpl implements AttemptService {

    @Autowired
    private AttemptRepo attemptRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Autowired
    private com.DADCMP.DADCMP.repository.AttemptResponseRepo attemptResponseRepo;

    @Autowired
    private QuestionRepo questionRepo;

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

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Attempt submitAttempt(Long attemptId, String responses) {
        Attempt attempt = getAttemptById(attemptId);
        attempt.setResponses(responses);
        attempt.setEndTime(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.SUBMITTED);

        try {
            Map<Long, String> responseMap = objectMapper.readValue(responses, new TypeReference<Map<Long, String>>() {
            });
            List<Question> questions = attempt.getAssessment().getQuestions();

            for (Question q : questions) {
                String candidateAnswer = responseMap.get(q.getId());
                com.DADCMP.DADCMP.entity.AttemptResponse resp = new com.DADCMP.DADCMP.entity.AttemptResponse();
                resp.setAttempt(attempt);
                resp.setQuestion(q);
                resp.setSelectedOption(candidateAnswer);

                if (candidateAnswer != null && candidateAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                    resp.setIsCorrect(true);
                    resp.setMarksAwarded(q.getMarks());
                } else {
                    resp.setIsCorrect(false);
                    resp.setMarksAwarded(0);
                }
                attemptResponseRepo.save(resp);
            }
        } catch (Exception e) {
            System.err.println("Error parsing responses: " + e.getMessage());
        }

        Attempt saved = attemptRepo.save(attempt);
        return autoEvaluateAttempt(saved.getId());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Attempt autoEvaluateAttempt(Long attemptId) {
        Attempt attempt = getAttemptById(attemptId);
        List<com.DADCMP.DADCMP.entity.AttemptResponse> responses = attemptResponseRepo.findAll().stream()
                .filter(r -> r.getAttempt().getId().equals(attemptId))
                .collect(java.util.stream.Collectors.toList());

        int totalScore = responses.stream().mapToInt(r -> r.getMarksAwarded() != null ? r.getMarksAwarded() : 0).sum();
        attempt.setScore(totalScore);
        attempt.setStatus(AttemptStatus.EVALUATED);

        Attempt saved = attemptRepo.save(attempt);

        if (totalScore >= attempt.getAssessment().getPassingMarks()) {
            credentialService.generateCredential(attempt.getCandidate().getId(), attempt.getAssessment().getId());
        }

        return saved;
    }

    @Override
    public Attempt evaluateAttempt(Long attemptId, Integer score) {
        Attempt attempt = getAttemptById(attemptId);
        attempt.setScore(score);
        attempt.setStatus(AttemptStatus.EVALUATED);
        attemptRepo.save(attempt);

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
