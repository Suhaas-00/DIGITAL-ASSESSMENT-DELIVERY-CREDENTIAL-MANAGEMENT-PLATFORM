package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Attempt;
import com.DADCMP.DADCMP.service.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/examiner")
public class ExaminerController {

    @Autowired
    private AttemptService attemptService;

    @GetMapping("/attempts")
    public List<Attempt> getAllAttempts() {
        // In a real app, this would get all submitted attempts. Logic using Jpa findAll
        // for now.
        // return attemptService.getAttemptsByCandidate(null);
        // return attemptRepository.findAll();
        return attemptService.getAllAttempts();
        // Placeholder for generic fetch if needed
    }

    @PostMapping("/evaluate/{id}")
    public Attempt evaluate(@PathVariable Long id, @RequestBody Map<String, Integer> scoreData) {
        return attemptService.evaluateAttempt(id, scoreData.get("score"));
    }
}
