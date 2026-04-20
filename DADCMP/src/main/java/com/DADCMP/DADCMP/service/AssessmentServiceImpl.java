package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.repository.AssessmentRepo;
import com.DADCMP.DADCMP.repository.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Autowired
    private QuestionRepo questionRepo;

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
        existing.setCategory(assessment.getCategory());
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

    @Override
    public Assessment addQuestionsToAssessment(Long assessmentId, List<Long> questionIds) {
        Assessment assessment = getAssessmentById(assessmentId);
        List<Question> questions = questionRepo.findAllById(questionIds);
        assessment.getQuestions().addAll(questions);
        return assessmentRepo.save(assessment);
    }

    @Override
    public Assessment autoGenerateAssessment(Assessment assessment, Long categoryId, int count, com.DADCMP.DADCMP.enums.DifficultyLevel difficulty) {
        List<Question> allAvailable = questionRepo.searchQuestions(null, categoryId, difficulty);
        java.util.Collections.shuffle(allAvailable);
        List<Question> selected = allAvailable.stream().limit(count).collect(java.util.stream.Collectors.toList());
        assessment.setQuestions(selected);
        assessment.setTotalMarks(selected.stream().mapToInt(Question::getMarks).sum());
        return assessmentRepo.save(assessment);
    }

    @Override
    public List<Assessment> getUpcomingAssessments() {
        return assessmentRepo.findUpcoming(java.time.LocalDateTime.now());
    }

    @Override
    public List<Assessment> getActiveAssessments() {
        return assessmentRepo.findActive(java.time.LocalDateTime.now());
    }
}
