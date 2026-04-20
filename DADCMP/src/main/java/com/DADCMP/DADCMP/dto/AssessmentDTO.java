package com.DADCMP.DADCMP.dto;

import com.DADCMP.DADCMP.enums.AssessmentStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentDTO {
    private Long id;
    private String title;
    private String description;
    private String domain;
    private Integer duration;
    private Integer totalMarks;
    private Integer passingMarks;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private AssessmentStatus status;
    private Long categoryId;
    private List<Long> questionIds;
}
