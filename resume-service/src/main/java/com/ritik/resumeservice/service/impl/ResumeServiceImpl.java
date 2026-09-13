package com.ritik.resumeservice.service.impl;

import com.ritik.resumeservice.dto.response.ResumeResponse;
import com.ritik.resumeservice.entity.Resume;
import com.ritik.resumeservice.mapper.ResumeMapper;
import com.ritik.resumeservice.repository.ResumeRepository;
import com.ritik.resumeservice.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpEntity;
import org.springframework.core.io.ByteArrayResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;

    @Override
    public ResumeResponse uploadResume(
            Long userId,
            MultipartFile file) {

        try {

            String uploadDir = "uploads/";

            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Resume resume = resumeRepository
                    .findByUserId(userId)
                    .orElse(null);

            if (resume == null) {

                System.out.println("CREATING NEW RESUME");

                resume = new Resume();
                resume.setUploadedAt(LocalDateTime.now());

            } else {

                System.out.println(
                        "UPDATING RESUME ID = "
                                + resume.getId()
                );
            }

            resume.setUserId(userId);
            resume.setFileName(fileName);
            resume.setFilePath(filePath.toString());
            resume.setUpdatedAt(LocalDateTime.now());
            
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                
                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("file", new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
                    }
                });

                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity("http://127.0.0.1:8000/parse-resume", requestEntity, String.class);
                
                resume.setAiSummary(response.getBody());
                System.out.println("AI Parsing completed successfully.");
            } catch (Exception ex) {
                System.out.println("Failed to call AI service: " + ex.getMessage());
            }

            Resume savedResume =
                    resumeRepository.save(resume);

            return ResumeResponse.builder()
                    .id(savedResume.getId())
                    .userId(savedResume.getUserId())
                    .fileName(savedResume.getFileName())
                    .filePath(savedResume.getFilePath())
                    .extractedText(savedResume.getExtractedText())
                    .aiSummary(savedResume.getAiSummary())
                    .atsScore(savedResume.getAtsScore())
                    .build();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload resume",
                    e
            );
        }
    }

    @Override
    public ResumeResponse getResumeByUserId(
            Long userId) {

        Resume resume = resumeRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found"));

        return ResumeMapper.toResponse(resume);
    }



    @Override
    public ResponseEntity<Resource> downloadResume(
            Long userId) {

        try {

            Resume resume = resumeRepository
                    .findByUserId(userId)
                    .orElseThrow(() ->
                            new RuntimeException("Resume not found"));

            Path path = Paths.get(resume.getFilePath());

            Resource resource =
                    new UrlResource(path.toUri());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    resume.getFileName() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to download resume",
                    e);
        }
    }
}