package com.ritik.candidateservice.service.impl;

import com.ritik.candidateservice.dto.request.CandidateRequest;
import com.ritik.candidateservice.dto.response.CandidateResponse;
import com.ritik.candidateservice.entity.Candidate;
import com.ritik.candidateservice.exception.CandidateNotFoundException;
import com.ritik.candidateservice.mapper.CandidateMapper;
import com.ritik.candidateservice.repository.CandidateRepository;
import com.ritik.candidateservice.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;

    @Override
    public CandidateResponse createCandidate(
            Long userId,
            CandidateRequest request) {

        candidateRepository
                .findByUserId(userId)
                .ifPresent(candidate -> {
                    throw new RuntimeException(
                            "Candidate profile already exists");
                });

        Candidate candidate =
                CandidateMapper.toEntity(request);

        candidate.setUserId(userId);

        Candidate savedCandidate =
                candidateRepository.save(candidate);

        return CandidateMapper.toResponse(savedCandidate);
    }

    @Override
    public CandidateResponse getCandidateById(
            Long id) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new CandidateNotFoundException(
                                        "Candidate not found with id: " + id));

        return CandidateMapper.toResponse(candidate);
    }

    @Override
    public List<CandidateResponse> getAllCandidates() {

        return candidateRepository.findAll()
                .stream()
                .map(CandidateMapper::toResponse)
                .toList();
    }

    @Override
    public CandidateResponse updateCandidate(
            Long id,
            CandidateRequest request) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new CandidateNotFoundException(
                                        "Candidate not found with id: " + id));

        candidate.setYearsOfExperience(
                request.getYearsOfExperience());

        candidate.setCurrentCompany(
                request.getCurrentCompany());

        candidate.setLocation(
                request.getLocation());

        candidate.setLinkedInUrl(
                request.getLinkedInUrl());

        candidate.setGithubUrl(
                request.getGithubUrl());

        candidate.setUpdatedAt(
                LocalDateTime.now());

        candidate.setSkills(
                request.getSkills());

        candidate.setEducation(
                request.getEducation());

        Candidate updatedCandidate =
                candidateRepository.save(candidate);

        return CandidateMapper.toResponse(
                updatedCandidate);
    }

    @Override
    public void deleteCandidate(
            Long id) {

        Candidate candidate =
                candidateRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found"));

        candidateRepository.delete(candidate);
    }
}