package com.DADCMP.DADCMP.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "attempt_responses")
public class AttemptResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private Attempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_option")
    private String selectedOption;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "marks_awarded")
    private Integer marksAwarded;
}
