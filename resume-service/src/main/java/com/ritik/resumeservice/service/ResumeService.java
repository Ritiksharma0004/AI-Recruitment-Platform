package com.ritik.resumeservice.service;

import com.ritik.resumeservice.dto.response.ResumeResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    ResumeResponse uploadResume(
            Long userId,
            MultipartFile file);

    ResumeResponse getResumeByUserId(Long userId);

    ResponseEntity<Resource> downloadResume(Long userId);
}