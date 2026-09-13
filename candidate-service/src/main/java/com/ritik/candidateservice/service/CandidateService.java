package com.ritik.candidateservice.service;

import com.ritik.candidateservice.dto.request.CandidateRequest;
import com.ritik.candidateservice.dto.response.CandidateResponse;

import java.util.List;

public interface CandidateService {

    CandidateResponse createCandidate(Long userId, CandidateRequest request);

    CandidateResponse getCandidateById(
            Long id);

    List<CandidateResponse> getAllCandidates();

    CandidateResponse updateCandidate(
            Long id,
            CandidateRequest request);

    void deleteCandidate(
            Long id);
}