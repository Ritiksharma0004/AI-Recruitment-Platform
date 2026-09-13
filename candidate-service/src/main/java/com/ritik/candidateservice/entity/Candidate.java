package com.ritik.candidateservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long userId;

    private Integer yearsOfExperience;

    private String currentCompany;

    private String location;

    private String resumeUrl;

    private String linkedInUrl;

    private String githubUrl;

    private String skills;

    private Double atsScore;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String education;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
