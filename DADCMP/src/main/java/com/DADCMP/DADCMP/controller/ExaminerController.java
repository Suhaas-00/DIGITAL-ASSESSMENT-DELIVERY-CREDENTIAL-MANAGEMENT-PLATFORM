package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.entity.User;
import com.DADCMP.DADCMP.enums.DifficultyLevel;
import com.DADCMP.DADCMP.repository.AttemptRepo;
import com.DADCMP.DADCMP.repository.QuestionRepo;
import com.DADCMP.DADCMP.repository.UsersRepo;
import com.DADCMP.DADCMP.service.ExaminerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/examiner")
public class ExaminerController {

    @Autowired
    private ExaminerService examinerService;
    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private AttemptRepo attemptRepo;
    @Autowired
    private UsersRepo usersRepo;

    private Long getExaminerId(Principal principal) {
        User user = usersRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Examiner not found"));
        return user.getId();
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getMyQuestions(Principal principal) {
        return ResponseEntity.ok(questionRepo.findByExaminerId(getExaminerId(principal)));
    }

    @PostMapping("/assessments/auto-generate")
    public ResponseEntity<Assessment> generateAssessment(
            Principal principal,
            @RequestParam String title,
            @RequestParam String domain,
            @RequestParam DifficultyLevel difficulty,
            @RequestParam int count) {
        return ResponseEntity.ok(examinerService.autoGenerateAssessment(getExaminerId(principal), title, domain, difficulty, count));
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<Attempt>> getAttemptsForMyAssessments(Principal principal) {
        return ResponseEntity.ok(attemptRepo.findAttemptsByExaminerId(getExaminerId(principal)));
    }

    @PostMapping("/evaluate/{attemptId}")
    public Attempt evaluate(
            @PathVariable Long attemptId,
            @RequestBody Map<String, Object> body,
            Principal principal) {
        Long examinerId = getExaminerId(principal);
        Integer score = (Integer) body.get("score");
        String remarks = (String) body.getOrDefault("remarks", "");

        return examinerService.evaluateAttempt(examinerId, attemptId, score, remarks);
    }
}
