package com.ritik.interviewservice.dto.response;

import com.ritik.interviewservice.entity.InterviewMode;
import com.ritik.interviewservice.entity.InterviewStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InterviewResponse {

    private Long id;

    private Long candidateId;

    private Long jobId;

    private String meetingLink;

    private LocalDateTime interviewDate;

    private String interviewerName;

    private InterviewMode interviewMode;

    private InterviewStatus status;

    private Integer score;

    private String feedback;
}