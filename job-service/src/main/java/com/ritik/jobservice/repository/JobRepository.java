package com.ritik.jobservice.repository;

import com.ritik.jobservice.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository
        extends JpaRepository<Job, Long> {
}