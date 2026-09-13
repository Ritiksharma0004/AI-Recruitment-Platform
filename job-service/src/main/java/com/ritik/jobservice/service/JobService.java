package com.ritik.jobservice.service;

import com.ritik.jobservice.dto.request.JobRequest;
import com.ritik.jobservice.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(JobRequest request);

    JobResponse getJobById(Long id);

    List<JobResponse> getAllJobs();

    JobResponse updateJob(
            Long id,
            JobRequest request);

    void deleteJob(Long id);
}