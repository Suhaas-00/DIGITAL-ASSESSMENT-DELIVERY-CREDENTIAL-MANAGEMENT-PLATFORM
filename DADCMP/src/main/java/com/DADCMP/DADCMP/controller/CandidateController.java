package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.service.AssessmentService;
import com.DADCMP.DADCMP.service.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.security.Principal;
import com.DADCMP.DADCMP.repository.UsersRepo;
import com.DADCMP.DADCMP.entity.User;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private AttemptService attemptService;

    @Autowired
    private UsersRepo usersRepo;

    @GetMapping("/assessments")
    public List<Assessment> getAvailableAssessments() {
        return assessmentService.getActiveAssessments();
    }

    @GetMapping("/assessments/upcoming")
    public List<Assessment> getUpcoming() {
        return assessmentService.getUpcomingAssessments();
    }

    @PostMapping("/start/{id}")
    public Attempt start(@PathVariable Long id, Principal principal) {
        User user = usersRepo.findByUsername(principal.getName()).orElseThrow();
        return attemptService.startAttempt(user.getId(), id);
    }

    @PostMapping("/submit/{attemptId}")
    public Attempt submit(@PathVariable Long attemptId, @RequestBody Map<String, String> submissionData) {
        return attemptService.submitAttempt(attemptId, submissionData.get("responses"));
    }

    @GetMapping("/results")
    public List<Attempt> getResults(Principal principal) {
        User user = usersRepo.findByUsername(principal.getName()).orElseThrow();
        return attemptService.getAttemptsByCandidate(user.getId());
    }
}
