package com.ritik.interviewservice.repository;

import com.ritik.interviewservice.entity.Interview;
import com.ritik.interviewservice.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    List<Interview> findByCandidateId(Long candidateId);

    List<Interview> findByJobId(Long jobId);

    List<Interview> findByStatus(InterviewStatus status);
}