package com.DADCMP.DADCMP.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.time.LocalDateTime;

import com.DADCMP.DADCMP.enums.AssessmentStatus;

@Data
@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "domain", nullable = false)
    private String domain;

    @Column(name = "duration", nullable = false)
    private Integer duration; // in minutes

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks;

    @Column(name = "passing_marks", nullable = false)
    private Integer passingMarks;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssessmentStatus status = AssessmentStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToMany
    @JoinTable(
        name = "assessment_questions",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;
}