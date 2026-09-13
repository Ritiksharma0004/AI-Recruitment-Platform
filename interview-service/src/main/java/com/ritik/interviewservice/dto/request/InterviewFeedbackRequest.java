package com.ritik.interviewservice.dto.request;

import com.ritik.interviewservice.entity.InterviewStatus;
import lombok.Data;

@Data
public class InterviewFeedbackRequest {

    private Integer score;

    private String feedback;


    private InterviewStatus status;
}