package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import java.util.List;

public interface AssessmentService {
    Assessment createAssessment(Assessment assessment);
    Assessment getAssessmentById(Long id);
    List<Assessment> getAllAssessments();
    Assessment updateAssessment(Long id, Assessment assessment);
    void deleteAssessment(Long id);
    List<Assessment> getAssessmentsByDomain(String domain);
    Assessment addQuestionsToAssessment(Long assessmentId, List<Long> questionIds);
    Assessment autoGenerateAssessment(Assessment assessment, Long categoryId, int count, com.DADCMP.DADCMP.enums.DifficultyLevel difficulty);
    List<Assessment> getUpcomingAssessments();
    List<Assessment> getActiveAssessments();
}
