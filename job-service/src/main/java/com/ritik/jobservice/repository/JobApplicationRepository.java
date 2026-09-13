package com.ritik.jobservice.repository;

import com.ritik.jobservice.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobIdAndUserId(Long jobId, Long userId);
    List<JobApplication> findByUserId(Long userId);
    List<JobApplication> findByJobId(Long jobId);
    long countByUserIdAndViewedByCandidateFalse(Long userId);
}
