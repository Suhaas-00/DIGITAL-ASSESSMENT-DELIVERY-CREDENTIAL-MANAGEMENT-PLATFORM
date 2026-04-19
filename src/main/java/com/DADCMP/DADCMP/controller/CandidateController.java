package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.service.AssessmentService;
import com.DADCMP.DADCMP.service.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private AttemptService attemptService;

    @GetMapping("/assessments")
    public List<Assessment> getAvailableAssessments() {
        return assessmentService.getAllAssessments();
    }

    @PostMapping("/start/{id}")
    public Attempt start(@PathVariable Long id, @RequestParam Long candidateId) {
        return attemptService.startAttempt(candidateId, id);
    }

    @PostMapping("/submit/{id}")
    public Attempt submit(@PathVariable Long id, @RequestBody Map<String, String> submissionData) {
        return attemptService.submitAttempt(id, submissionData.get("responses"));
    }

    @GetMapping("/results")
    public List<Attempt> getResults(@RequestParam Long candidateId) {
        return attemptService.getAttemptsByCandidate(candidateId);
    }
}
