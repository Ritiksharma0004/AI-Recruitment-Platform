package com.ritik.jobservice.service.impl;

import com.ritik.jobservice.dto.request.JobRequest;
import com.ritik.jobservice.dto.response.JobResponse;
import com.ritik.jobservice.entity.Job;
import com.ritik.jobservice.exception.JobNotFoundException;
import com.ritik.jobservice.mapper.JobMapper;
import com.ritik.jobservice.repository.JobRepository;
import com.ritik.jobservice.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl
        implements JobService {

    private final JobRepository jobRepository;

    @Override
    public JobResponse createJob(
            JobRequest request) {

        Job job =
                JobMapper.toEntity(request);

        Job savedJob =
                jobRepository.save(job);

        return JobMapper.toResponse(savedJob);
    }

    @Override
    public JobResponse getJobById(
            Long id) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found with id: " + id));

        return JobMapper.toResponse(job);
    }

    @Override
    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Override
    public JobResponse updateJob(
            Long id,
            JobRequest request) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found with id: " + id));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setExperienceRequired(
                request.getExperienceRequired());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setRequiredSkills(
                request.getRequiredSkills());
        job.setRecruiterEmail(
                request.getRecruiterEmail());

        job.setUpdatedAt(
                LocalDateTime.now());

        Job updatedJob =
                jobRepository.save(job);

        return JobMapper.toResponse(updatedJob);
    }

    @Override
    public void deleteJob(
            Long id) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found with id: " + id));

        jobRepository.delete(job);
    }
}