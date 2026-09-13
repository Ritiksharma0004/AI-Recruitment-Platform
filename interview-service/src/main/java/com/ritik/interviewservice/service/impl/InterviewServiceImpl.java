package com.ritik.interviewservice.service.impl;

import com.ritik.interviewservice.dto.request.InterviewFeedbackRequest;
import com.ritik.interviewservice.dto.request.InterviewRequest;
import com.ritik.interviewservice.dto.response.InterviewResponse;
import com.ritik.interviewservice.entity.Interview;
import com.ritik.interviewservice.entity.InterviewStatus;
import com.ritik.interviewservice.exception.InterviewNotFoundException;
import com.ritik.interviewservice.mapper.InterviewMapper;
import com.ritik.interviewservice.repository.InterviewRepository;
import com.ritik.interviewservice.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl
        implements InterviewService {

    private final InterviewRepository interviewRepository;

    @Override
    public InterviewResponse scheduleInterview(
            InterviewRequest request) {

        Interview interview =
                InterviewMapper.toEntity(request);

        Interview savedInterview =
                interviewRepository.save(interview);

        return InterviewMapper.toResponse(savedInterview);
    }

    @Override
    public InterviewResponse getInterviewById(
            Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new InterviewNotFoundException(
                                        "Interview not found with id: " + id));

        return InterviewMapper.toResponse(interview);
    }

    @Override
    public List<InterviewResponse> getAllInterviews() {

        return interviewRepository.findAll()
                .stream()
                .map(InterviewMapper::toResponse)
                .toList();
    }

    @Override
    public List<InterviewResponse> getInterviewsByCandidateId(
            Long candidateId) {

        return interviewRepository
                .findByCandidateId(candidateId)
                .stream()
                .map(InterviewMapper::toResponse)
                .toList();
    }

    @Override
    public InterviewResponse addFeedback(
            Long id,
            InterviewFeedbackRequest request) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new InterviewNotFoundException(
                                        "Interview not found with id: " + id));

        interview.setScore(request.getScore());
        interview.setFeedback(request.getFeedback());
        interview.setStatus(request.getStatus());
        interview.setUpdatedAt(LocalDateTime.now());

        Interview updatedInterview =
                interviewRepository.save(interview);

        return InterviewMapper.toResponse(updatedInterview);
    }

    @Override
    public void deleteInterview(
            Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new InterviewNotFoundException(
                                        "Interview not found with id: " + id));

        interviewRepository.delete(interview);
    }


    @Override
    public InterviewResponse cancelInterview(
            Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new InterviewNotFoundException(
                                        "Interview not found with id: " + id
                                ));

        interview.setStatus(
                InterviewStatus.CANCELLED
        );

        Interview updatedInterview =
                interviewRepository.save(interview);

        return InterviewMapper.toResponse(
                updatedInterview
        );
    }
}