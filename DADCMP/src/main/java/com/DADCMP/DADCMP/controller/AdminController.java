package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.dto.AnalyticsDTO;
import com.DADCMP.DADCMP.service.AnalyticsService;
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

    @Autowired
    private AnalyticsService analyticsService;

    // Assessment Management
    @PostMapping("/assessments")
    public Assessment createAssessment(@RequestBody Assessment assessment) {
        return assessmentService.createAssessment(assessment);
    }

    @GetMapping("/assessments")
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    @PostMapping("/assessments/{id}/questions")
    public Assessment assignQuestions(@PathVariable Long id, @RequestBody List<Long> questionIds) {
        return assessmentService.addQuestionsToAssessment(id, questionIds);
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

    @PostMapping("/questions/bulk")
    public List<Question> bulkUpload(@RequestBody List<Question> questions) {
        return questionService.bulkUploadQuestions(questions);
    }

    @GetMapping("/questions/search")
    public List<Question> search(@RequestParam(required = false) String query,
                                 @RequestParam(required = false) Long categoryId,
                                 @RequestParam(required = false) com.DADCMP.DADCMP.enums.DifficultyLevel difficulty) {
        return questionService.searchQuestions(query, categoryId, difficulty);
    }

    @PostMapping("/assessments/auto-generate")
    public Assessment autoGenerate(@RequestBody Assessment assessment,
                                   @RequestParam Long categoryId,
                                   @RequestParam int count,
                                   @RequestParam com.DADCMP.DADCMP.enums.DifficultyLevel difficulty) {
        return assessmentService.autoGenerateAssessment(assessment, categoryId, count, difficulty);
    }

    // Reports
    @GetMapping("/reports")
    public List<?> getReports() {
        return credentialService.getAllCredentials();
    }

    @GetMapping("/analytics")
    public AnalyticsDTO getAnalytics() {
        return analyticsService.getSystemAnalytics();
    }
}
