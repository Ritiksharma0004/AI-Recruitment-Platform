package com.ritik.jobservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;
    
    private String companyName;
    
    private String jobType; // Full-Time, Internship, etc.

    private Integer experienceRequired;

    private Double salaryMin;

    private Double salaryMax;

    private String requiredSkills;

    private String recruiterEmail;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}