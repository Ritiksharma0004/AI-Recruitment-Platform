package com.ritik.resumeservice.mapper;

import com.ritik.resumeservice.dto.response.ResumeResponse;
import com.ritik.resumeservice.entity.Resume;

public class ResumeMapper {

    public static ResumeResponse toResponse(
            Resume resume) {

        return ResumeResponse.builder()
                .id(resume.getId())
                .userId(resume.getUserId())
                .fileName(resume.getFileName())
                .filePath(resume.getFilePath())
                .extractedText(resume.getExtractedText())
                .aiSummary(resume.getAiSummary())
                .atsScore(resume.getAtsScore())
                .build();
    }
}