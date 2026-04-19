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
}
