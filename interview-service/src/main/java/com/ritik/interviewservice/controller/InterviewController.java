package com.ritik.interviewservice.controller;

import com.ritik.interviewservice.dto.request.InterviewFeedbackRequest;
import com.ritik.interviewservice.dto.request.InterviewRequest;
import com.ritik.interviewservice.dto.response.InterviewResponse;
import com.ritik.interviewservice.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;



@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @RequestHeader("X-User-Role") String role,
            @RequestBody InterviewRequest request) {

        if (!"RECRUITER".equals(role)
                && !"ADMIN".equals(role)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only recruiters can schedule interviews"
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        interviewService.scheduleInterview(request)
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                interviewService.getInterviewById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {

        return ResponseEntity.ok(
                interviewService.getAllInterviews()
        );
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<InterviewResponse>>
    getCandidateInterviews(
            @PathVariable Long candidateId) {

        return ResponseEntity.ok(
                interviewService.getInterviewsByCandidateId(candidateId)
        );
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<InterviewResponse> addFeedback(
            @PathVariable Long id,
            @RequestBody InterviewFeedbackRequest request) {

        return ResponseEntity.ok(
                interviewService.addFeedback(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(
            @PathVariable Long id) {

        interviewService.deleteInterview(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<InterviewResponse>> getMyInterviews(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                interviewService.getInterviewsByCandidateId(userId)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<InterviewResponse> cancelInterview(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                interviewService.cancelInterview(id)
        );
    }
}