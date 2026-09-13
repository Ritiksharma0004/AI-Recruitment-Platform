package com.ritik.interviewservice.service;

import com.ritik.interviewservice.dto.request.InterviewFeedbackRequest;
import com.ritik.interviewservice.dto.request.InterviewRequest;
import com.ritik.interviewservice.dto.response.InterviewResponse;

import java.util.List;

public interface InterviewService {

    InterviewResponse scheduleInterview(
            InterviewRequest request);

    InterviewResponse getInterviewById(
            Long id);


    List<InterviewResponse> getAllInterviews();

    List<InterviewResponse> getInterviewsByCandidateId(
            Long candidateId);

    InterviewResponse addFeedback(
            Long id,
            InterviewFeedbackRequest request);

    void deleteInterview(
            Long id);

    InterviewResponse cancelInterview(Long id);
}