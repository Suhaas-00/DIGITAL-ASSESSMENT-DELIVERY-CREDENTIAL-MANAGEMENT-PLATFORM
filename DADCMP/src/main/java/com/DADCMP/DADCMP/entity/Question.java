package com.DADCMP.DADCMP.entity;

import com.DADCMP.DADCMP.enums.DifficultyLevel;
import com.DADCMP.DADCMP.enums.QuestionType;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false)
    private DifficultyLevel difficultyLevel;

    @Column(name = "marks", nullable = false)
    private Integer marks;

    @Column(name = "options", columnDefinition = "TEXT")
    private String options; // JSON stored as String

    @Column(name = "correct_answer")
    private String correctAnswer;
}