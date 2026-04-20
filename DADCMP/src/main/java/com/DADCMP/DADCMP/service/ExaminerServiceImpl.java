package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.*;
import com.DADCMP.DADCMP.enums.*;
import com.DADCMP.DADCMP.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExaminerServiceImpl implements ExaminerService {

    private final QuestionRepo questionRepo;
    private final AssessmentRepo assessmentRepo;
    private final AttemptRepo attemptRepo;
    private final NotificationRepo notificationRepo;
    private final UsersRepo usersRepo;

    // ✅ Constructor Injection (BEST PRACTICE)
    public ExaminerServiceImpl(
            QuestionRepo questionRepo,
            AssessmentRepo assessmentRepo,
            AttemptRepo attemptRepo,
            NotificationRepo notificationRepo,
            UsersRepo usersRepo) {
        this.questionRepo = questionRepo;
        this.assessmentRepo = assessmentRepo;
        this.attemptRepo = attemptRepo;
        this.notificationRepo = notificationRepo;
        this.usersRepo = usersRepo;
    }

    // =========================================================
    // AUTO GENERATE ASSESSMENT
    // =========================================================
    @Override
    @Transactional
    public Assessment autoGenerateAssessment(
            Long examinerId,
            String title,
            String domain,
            DifficultyLevel difficulty,
            int count) {

        User examiner = usersRepo.findById(examinerId)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));

        List<Question> pool = questionRepo.findByCategoryNameAndDifficultyLevel(domain, difficulty);

        if (pool == null || pool.size() < count) {
            throw new RuntimeException("Not enough questions available");
        }

        // Shuffle and pick
        Collections.shuffle(pool);
        List<Question> selected = pool.stream()
                .limit(count)
                .collect(Collectors.toList());

        Assessment assessment = new Assessment();
        assessment.setTitle(title);
        assessment.setDescription("Auto-generated " + domain + " assessment");
        assessment.setDomain(domain);
        assessment.setDuration(60);

        int totalMarks = selected.stream()
                .mapToInt(q -> q.getMarks() != null ? q.getMarks() : 0)
                .sum();

        assessment.setTotalMarks(totalMarks);
        assessment.setPassingMarks((int) (totalMarks * 0.5));
        assessment.setStartDateTime(LocalDateTime.now().plusDays(1));
        assessment.setEndDateTime(LocalDateTime.now().plusDays(7));
        assessment.setStatus(AssessmentStatus.SCHEDULED);
        assessment.setCreatedBy(examiner);
        assessment.setQuestions(selected);

        Assessment saved = assessmentRepo.save(assessment);

        // ✅ Notify all candidates
        List<User> candidates = usersRepo.findByRole(Role.CANDIDATE);

        for (User candidate : candidates) {
            Notification notification = new Notification();
            notification.setUser(candidate);
            notification.setMessage("New Assessment available: " + saved.getTitle());
            notification.setCreatedAt(LocalDateTime.now());

            notificationRepo.save(notification);
        }

        return saved;
    }

    // =========================================================
    // EVALUATE ATTEMPT
    // =========================================================
    @Override
    @Transactional
    public Attempt evaluateAttempt(
            Long examinerId,
            Long attemptId,
            Integer overriddenScore,
            String remarks) {

        Attempt attempt = attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        // ✅ Ownership check
        if (attempt.getAssessment() == null ||
                attempt.getAssessment().getCreatedBy() == null ||
                !attempt.getAssessment().getCreatedBy().getId().equals(examinerId)) {

            throw new SecurityException("Unauthorized: Not your assessment");
        }

        User examiner = usersRepo.findById(examinerId)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));

        // ✅ Update attempt
        attempt.setScore(overriddenScore != null ? overriddenScore : 0);
        attempt.setRemarks(remarks);
        attempt.setEvaluatedBy(examiner);
        attempt.setEvaluatedAt(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.EVALUATED);

        Attempt saved = attemptRepo.save(attempt);

        // ✅ Notify candidate
        Notification notification = new Notification();
        notification.setUser(saved.getCandidate());
        notification.setMessage(
                "Your attempt for '" +
                        attempt.getAssessment().getTitle() +
                        "' has been evaluated. Score: " + overriddenScore);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepo.save(notification);

        return saved;
    }
}