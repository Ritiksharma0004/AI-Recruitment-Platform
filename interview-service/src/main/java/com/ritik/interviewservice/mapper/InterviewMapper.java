package com.ritik.interviewservice.mapper;

import com.ritik.interviewservice.dto.request.InterviewRequest;
import com.ritik.interviewservice.dto.response.InterviewResponse;
import com.ritik.interviewservice.entity.Interview;
import com.ritik.interviewservice.entity.InterviewStatus;

import java.time.LocalDateTime;

public class InterviewMapper {

    public static Interview toEntity(
            InterviewRequest request) {

        return Interview.builder()
                .candidateId(request.getCandidateId())
                .jobId(request.getJobId())
                .interviewDate(request.getInterviewDate())
                .interviewerName(request.getInterviewerName())
                .meetingLink(request.getMeetingLink())
                .interviewMode(request.getInterviewMode())
                .status(InterviewStatus.SCHEDULED)
                .build();
    }

    public static InterviewResponse toResponse(
            Interview interview) {

        return InterviewResponse.builder()
                .id(interview.getId())
                .candidateId(interview.getCandidateId())
                .jobId(interview.getJobId())
                .interviewDate(interview.getInterviewDate())
                .interviewerName(
                        interview.getInterviewerName())
                .interviewMode(
                        interview.getInterviewMode())
                .status(interview.getStatus())
                .score(interview.getScore())
                .meetingLink(interview.getMeetingLink())
                .feedback(interview.getFeedback())
                .build();
    }
}