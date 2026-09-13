package com.ritik.jobservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {

    private Long id;

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

    private LocalDateTime createdAt;
}