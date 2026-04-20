package com.DADCMP.DADCMP.entity;

import com.DADCMP.DADCMP.enums.DifficultyLevel;
import com.DADCMP.DADCMP.enums.QuestionType;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
        name = "question_tags",
        joinColumns = @JoinColumn(name = "question_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    @Column(name = "version")
    private Integer version = 1;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examiner_id")
    private User examiner;
}