package com.ritik.candidateservice.controller;

import com.ritik.candidateservice.dto.request.CandidateRequest;
import com.ritik.candidateservice.dto.response.CandidateResponse;
import com.ritik.candidateservice.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    public ResponseEntity<CandidateResponse> createCandidate(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CandidateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(candidateService.createCandidate(
                        userId,
                        request));
    }


    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getCandidateById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                candidateService.getCandidateById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponse>> getAllCandidates() {

        return ResponseEntity.ok(
                candidateService.getAllCandidates()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @RequestBody CandidateRequest request) {

        return ResponseEntity.ok(
                candidateService.updateCandidate(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(
            @PathVariable Long id) {

        candidateService.deleteCandidate(id);

        return ResponseEntity.noContent().build();
    }
}