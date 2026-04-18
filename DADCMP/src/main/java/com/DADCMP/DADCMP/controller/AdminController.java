package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.service.AssessmentService;
import com.DADCMP.DADCMP.service.CredentialService;
import com.DADCMP.DADCMP.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private CredentialService credentialService;

    // Assessment Management
    @PostMapping("/assessments")
    public Assessment createAssessment(@RequestBody Assessment assessment) {
        return assessmentService.createAssessment(assessment);
    }

    @GetMapping("/assessments")
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    // Question Management
    @PostMapping("/questions")
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

    @PutMapping("/questions/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }

    // Reports
    @GetMapping("/reports")
    public List<?> getReports() {
        return credentialService.getAllCredentials();
    }
}
