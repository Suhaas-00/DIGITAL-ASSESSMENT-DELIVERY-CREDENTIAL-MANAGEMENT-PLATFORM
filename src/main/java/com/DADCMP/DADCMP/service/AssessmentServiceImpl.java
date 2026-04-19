package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.repository.AssessmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Override
    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepo.save(assessment);
    }

    @Override
    public Assessment getAssessmentById(Long id) {
        return assessmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepo.findAll();
    }

    @Override
    public Assessment updateAssessment(Long id, Assessment assessment) {
        Assessment existing = getAssessmentById(id);
        existing.setTitle(assessment.getTitle());
        existing.setDescription(assessment.getDescription());
        existing.setDomain(assessment.getDomain());
        existing.setDuration(assessment.getDuration());
        existing.setTotalMarks(assessment.getTotalMarks());
        existing.setPassingMarks(assessment.getPassingMarks());
        existing.setStartDateTime(assessment.getStartDateTime());
        existing.setEndDateTime(assessment.getEndDateTime());
        existing.setStatus(assessment.getStatus());
        return assessmentRepo.save(existing);
    }

    @Override
    public void deleteAssessment(Long id) {
        assessmentRepo.deleteById(id);
    }

    @Override
    public List<Assessment> getAssessmentsByDomain(String domain) {
        return assessmentRepo.findByDomain(domain);
    }
}
