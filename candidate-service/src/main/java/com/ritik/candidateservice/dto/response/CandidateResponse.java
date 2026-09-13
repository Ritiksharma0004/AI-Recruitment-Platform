package com.ritik.candidateservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateResponse {

    private Long id;

    private Long userId;

    private Integer yearsOfExperience;

    private String currentCompany;

    private String location;


    private String linkedInUrl;

    private String githubUrl;

    private String skills;

    private Double atsScore;

    private String aiSummary;

    private String education;
}