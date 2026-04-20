package com.DADCMP.DADCMP.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.DADCMP.DADCMP.enums.AttemptStatus;

@Data
@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → User
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    // FK → Assessment
    @ManyToOne
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "responses", columnDefinition = "TEXT")
    private String responses; // JSON

    @Column(name = "score")
    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AttemptStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by")
    private User evaluatedBy;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;
}