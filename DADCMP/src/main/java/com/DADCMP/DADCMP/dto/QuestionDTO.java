package com.DADCMP.DADCMP.dto;

import com.DADCMP.DADCMP.enums.DifficultyLevel;
import com.DADCMP.DADCMP.enums.QuestionType;
import lombok.Data;
import java.util.Set;

@Data
public class QuestionDTO {
    private Long id;
    private String questionText;
    private QuestionType questionType;
    private DifficultyLevel difficultyLevel;
    private Integer marks;
    private String options;
    private String correctAnswer;
    private Long categoryId;
    private Set<Long> tagIds;
}
