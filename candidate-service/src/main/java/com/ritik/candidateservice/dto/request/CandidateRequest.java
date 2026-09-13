package com.ritik.candidateservice.dto.request;

import lombok.Data;

@Data
public class CandidateRequest {



    private Integer yearsOfExperience;

    private String currentCompany;

    private String location;

    private String linkedInUrl;

    private String githubUrl;

    private String skills;

    private String education;
}