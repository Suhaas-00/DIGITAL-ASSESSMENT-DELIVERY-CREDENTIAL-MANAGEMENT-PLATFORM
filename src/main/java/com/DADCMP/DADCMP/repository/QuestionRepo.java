package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Question;
import com.DADCMP.DADCMP.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepo extends JpaRepository<Question, Long> {
    List<Question> findByDifficultyLevel(DifficultyLevel difficultyLevel);
}
