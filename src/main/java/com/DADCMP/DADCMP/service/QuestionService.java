package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.enums.DifficultyLevel;
import java.util.List;

public interface QuestionService {
    Question addQuestion(Question question);
    Question getQuestionById(Long id);
    List<Question> getAllQuestions();
    Question updateQuestion(Long id, Question question);
    void deleteQuestion(Long id);
    List<Question> getQuestionsByDifficulty(DifficultyLevel difficultyLevel);
}
