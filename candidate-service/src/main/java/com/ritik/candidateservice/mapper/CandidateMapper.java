package com.ritik.candidateservice.mapper;

import com.ritik.candidateservice.dto.request.CandidateRequest;
import com.ritik.candidateservice.dto.response.CandidateResponse;
import com.ritik.candidateservice.entity.Candidate;

import java.time.LocalDateTime;

public class CandidateMapper {

    public static Candidate toEntity(
            CandidateRequest request) {

        return Candidate.builder()
                .yearsOfExperience(
                        request.getYearsOfExperience())
                .currentCompany(
                        request.getCurrentCompany())
                .location(request.getLocation())
                .linkedInUrl(request.getLinkedInUrl())
                .githubUrl(request.getGithubUrl())
                .skills(request.getSkills())
                .education(request.getEducation())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static CandidateResponse toResponse(
            Candidate candidate) {

        return CandidateResponse.builder()
                .id(candidate.getId())
                .userId(candidate.getUserId())
                .yearsOfExperience(
                        candidate.getYearsOfExperience())
                .currentCompany(
                        candidate.getCurrentCompany())
                .location(candidate.getLocation())
                .linkedInUrl(candidate.getLinkedInUrl())
                .githubUrl(candidate.getGithubUrl())
                .skills(candidate.getSkills())
                .atsScore(candidate.getAtsScore())
                .aiSummary(candidate.getAiSummary())
                .education(candidate.getEducation())
                .build();
    }
}