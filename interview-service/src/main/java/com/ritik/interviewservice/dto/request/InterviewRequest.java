package com.ritik.interviewservice.dto.request;

import com.ritik.interviewservice.entity.InterviewMode;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewRequest {

    private Long candidateId;

    private Long jobId;

    private String meetingLink;

    private LocalDateTime interviewDate;

    private String interviewerName;

    private InterviewMode interviewMode;
}