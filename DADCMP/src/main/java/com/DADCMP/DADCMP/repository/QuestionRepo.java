package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepo extends JpaRepository<Question, Long> {
    List<Question> findByDifficultyLevel(DifficultyLevel difficultyLevel);
    
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Question q WHERE " +
            "(:query IS NULL OR q.questionText LIKE %:query%) AND " +
            "(:categoryId IS NULL OR q.category.id = :categoryId) AND " +
            "(:difficulty IS NULL OR q.difficultyLevel = :difficulty) AND " +
            "q.isActive = true")
    List<Question> searchQuestions(String query, Long categoryId, DifficultyLevel difficulty);

    List<Question> findByExaminerId(Long examinerId);
    
    List<Question> findByCategoryNameAndDifficultyLevel(String name, DifficultyLevel difficultyLevel);
}
