package com.ritik.jobservice.dto.request;

import lombok.Data;

@Data
public class JobRequest {

    private String title;

    private String description;

    private String location;
    
    private String companyName;
    
    private String jobType;

    private Integer experienceRequired;

    private Double salaryMin;

    private Double salaryMax;

    private String requiredSkills;

    private String recruiterEmail;
}