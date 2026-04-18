package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.enums.DifficultyLevel;
import com.DADCMP.DADCMP.repository.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepo questionRepo;

    @Override
    public Question addQuestion(Question question) {
        return questionRepo.save(question);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionRepo.findAll();
    }

    @Override
    public Question updateQuestion(Long id, Question question) {
        Question existing = getQuestionById(id);
        existing.setQuestionText(question.getQuestionText());
        existing.setQuestionType(question.getQuestionType());
        existing.setDifficultyLevel(question.getDifficultyLevel());
        existing.setMarks(question.getMarks());
        existing.setOptions(question.getOptions());
        existing.setCorrectAnswer(question.getCorrectAnswer());
        return questionRepo.save(existing);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepo.deleteById(id);
    }

    @Override
    public List<Question> getQuestionsByDifficulty(DifficultyLevel difficultyLevel) {
        return questionRepo.findByDifficultyLevel(difficultyLevel);
    }
}
