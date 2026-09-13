package com.ritik.resumeservice.controller;

import com.ritik.resumeservice.dto.response.ResumeResponse;
import com.ritik.resumeservice.service.ResumeService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam MultipartFile file) {

        return ResponseEntity.ok(
                resumeService.uploadResume(
                        userId,
                        file
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ResumeResponse> getMyResume(
            @RequestHeader("X-User-Id") Long userId) {

        ResumeResponse resume = resumeService.getResumeByUserId(userId);
        if (resume == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadResume(
            @RequestHeader("X-User-Id") Long userId) {

        return resumeService.downloadResume(userId);
    }

    @GetMapping("/user/{candidateId}")
    public ResponseEntity<ResumeResponse> getCandidateResume(
            @PathVariable Long candidateId) {

        ResumeResponse resume = resumeService.getResumeByUserId(candidateId);
        if (resume == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/download/{candidateId}")
    public ResponseEntity<Resource> downloadCandidateResume(
            @PathVariable Long candidateId) {

        return resumeService.downloadResume(candidateId);
    }
}
