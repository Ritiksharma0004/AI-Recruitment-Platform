package com.ritik.jobservice.mapper;

import com.ritik.jobservice.dto.request.JobRequest;
import com.ritik.jobservice.dto.response.JobResponse;
import com.ritik.jobservice.entity.Job;

import java.time.LocalDateTime;

public class JobMapper {

    public static Job toEntity(
            JobRequest request) {

        return Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .companyName(request.getCompanyName())
                .jobType(request.getJobType())
                .experienceRequired(
                        request.getExperienceRequired())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .requiredSkills(
                        request.getRequiredSkills())
                .recruiterEmail(request.getRecruiterEmail())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static JobResponse toResponse(
            Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .companyName(job.getCompanyName())
                .jobType(job.getJobType())
                .experienceRequired(
                        job.getExperienceRequired())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .requiredSkills(job.getRequiredSkills())
                .recruiterEmail(job.getRecruiterEmail())
                .createdAt(job.getCreatedAt())
                .build();
    }
}