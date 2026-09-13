package com.ritik.jobservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;

    private Long userId;

    private Double atsScore;

    private String status;

    private LocalDateTime appliedAt;

    private LocalDateTime interviewDate;
    private String meetingLink;
    private String interviewerName;
    private String roundName;

    @Column(columnDefinition = "TEXT")
    private String interviewPlan;

    private String assessmentTitle;
    private String assessmentLink;
    private String assessmentDeadline;
    private String notes;

    @Builder.Default
    private Boolean viewedByCandidate = false;

    private String recruiterEmail;

    private Integer technicalScore;
    private Integer communicationScore;
    private Integer problemSolvingScore;
    private Integer culturalFitScore;
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(columnDefinition = "TEXT")
    private String interviewerFeedback;

    private String offeredDesignation;
    private Double offeredCtc;
    private String joiningDate;

    @Column(columnDefinition = "TEXT")
    private String offerLetterNotes;

    @Builder.Default
    private Boolean offerAccepted = false;
}
