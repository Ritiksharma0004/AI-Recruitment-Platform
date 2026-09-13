package com.ritik.jobservice.controller;

import com.ritik.jobservice.dto.request.JobRequest;
import com.ritik.jobservice.dto.response.JobResponse;
import com.ritik.jobservice.service.JobService;
import com.ritik.jobservice.entity.JobApplication;
import com.ritik.jobservice.repository.JobApplicationRepository;
import com.ritik.jobservice.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestBody JobRequest request) {

        if (request.getRecruiterEmail() == null || request.getRecruiterEmail().isBlank()) {
            if (userEmail != null && !userEmail.isBlank()) {
                request.setRecruiterEmail(userEmail);
            } else {
                request.setRecruiterEmail("Naresh@gmail.com");
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody JobRequest request) {

        return ResponseEntity.ok(
                jobService.updateJob(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id) {

        List<JobApplication> apps = applicationRepository.findByJobId(id);
        if (apps != null && !apps.isEmpty()) {
            applicationRepository.deleteAll(apps);
        }

        jobService.deleteJob(id);

        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Object> payload) {
            
        Optional<JobApplication> existing = applicationRepository.findByJobIdAndUserId(jobId, userId);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Already applied to this job.");
        }
        
        Double atsScore = null;
        if (payload.get("atsScore") != null) {
            try {
                atsScore = Double.parseDouble(payload.get("atsScore").toString());
            } catch (Exception e) {}
        }
        
        JobApplication application = JobApplication.builder()
                .jobId(jobId)
                .userId(userId)
                .atsScore(atsScore)
                .status("PENDING")
                .viewedByCandidate(true)
                .appliedAt(LocalDateTime.now())
                .build();
                
        applicationRepository.save(application);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getJobApplications(@PathVariable Long jobId) {
        List<JobApplication> apps = applicationRepository.findByJobId(jobId);
        apps.sort((a, b) -> Double.compare(
                b.getAtsScore() != null ? b.getAtsScore() : 0.0,
                a.getAtsScore() != null ? a.getAtsScore() : 0.0
        ));
        return ResponseEntity.ok(apps);
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> payload) {

        Optional<JobApplication> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found.");
        }

        JobApplication app = appOpt.get();

        if (payload.containsKey("status") && payload.get("status") != null) {
            String newStatus = payload.get("status").toString().toUpperCase();
            app.setStatus(newStatus);
            if ("SHORTLISTED".equalsIgnoreCase(newStatus) && (!payload.containsKey("interviewDate") || payload.get("interviewDate") == null)) {
                app.setInterviewDate(null);
                app.setMeetingLink(null);
                app.setRoundName(null);
                app.setInterviewerName(null);
                app.setInterviewPlan(null);
            }
        }
        if (payload.containsKey("meetingLink")) {
            app.setMeetingLink(payload.get("meetingLink") != null ? payload.get("meetingLink").toString() : null);
        }
        if (payload.containsKey("interviewerName")) {
            app.setInterviewerName(payload.get("interviewerName") != null ? payload.get("interviewerName").toString() : null);
        }
        if (payload.containsKey("roundName")) {
            app.setRoundName(payload.get("roundName") != null ? payload.get("roundName").toString() : null);
        }
        if (payload.containsKey("interviewPlan")) {
            app.setInterviewPlan(payload.get("interviewPlan") != null ? payload.get("interviewPlan").toString() : null);
        }
        if (payload.containsKey("interviewDate")) {
            if (payload.get("interviewDate") != null) {
                try {
                    String dtStr = payload.get("interviewDate").toString();
                    if (dtStr.length() == 16) dtStr += ":00";
                    app.setInterviewDate(LocalDateTime.parse(dtStr.replace("Z", "")));
                } catch (Exception e) {}
            } else {
                app.setInterviewDate(null);
            }
        }
        if (payload.containsKey("assessmentTitle") && payload.get("assessmentTitle") != null) {
            app.setAssessmentTitle(payload.get("assessmentTitle").toString());
        }
        if (payload.containsKey("assessmentLink") && payload.get("assessmentLink") != null) {
            app.setAssessmentLink(payload.get("assessmentLink").toString());
        }
        if (payload.containsKey("assessmentDeadline") && payload.get("assessmentDeadline") != null) {
            app.setAssessmentDeadline(payload.get("assessmentDeadline").toString());
        }
        if (payload.containsKey("notes") && payload.get("notes") != null) {
            app.setNotes(payload.get("notes").toString());
        }
        if (payload.containsKey("recruiterEmail") && payload.get("recruiterEmail") != null) {
            app.setRecruiterEmail(payload.get("recruiterEmail").toString());
        } else if (userEmail != null && !userEmail.isBlank()) {
            app.setRecruiterEmail(userEmail);
        } else if (app.getRecruiterEmail() == null || app.getRecruiterEmail().isBlank()) {
            app.setRecruiterEmail("Naresh@gmail.com");
        }

        if (payload.containsKey("technicalScore") && payload.get("technicalScore") != null) {
            try { app.setTechnicalScore(Integer.parseInt(payload.get("technicalScore").toString())); } catch (Exception ignored) {}
        }
        if (payload.containsKey("communicationScore") && payload.get("communicationScore") != null) {
            try { app.setCommunicationScore(Integer.parseInt(payload.get("communicationScore").toString())); } catch (Exception ignored) {}
        }
        if (payload.containsKey("problemSolvingScore") && payload.get("problemSolvingScore") != null) {
            try { app.setProblemSolvingScore(Integer.parseInt(payload.get("problemSolvingScore").toString())); } catch (Exception ignored) {}
        }
        if (payload.containsKey("culturalFitScore") && payload.get("culturalFitScore") != null) {
            try { app.setCulturalFitScore(Integer.parseInt(payload.get("culturalFitScore").toString())); } catch (Exception ignored) {}
        }
        if (payload.containsKey("recommendation") && payload.get("recommendation") != null) {
            app.setRecommendation(payload.get("recommendation").toString());
        }
        if (payload.containsKey("strengths") && payload.get("strengths") != null) {
            app.setStrengths(payload.get("strengths").toString());
        }
        if (payload.containsKey("areasForImprovement") && payload.get("areasForImprovement") != null) {
            app.setAreasForImprovement(payload.get("areasForImprovement").toString());
        }
        if (payload.containsKey("interviewerFeedback") && payload.get("interviewerFeedback") != null) {
            app.setInterviewerFeedback(payload.get("interviewerFeedback").toString());
        }

        if (payload.containsKey("offeredDesignation") && payload.get("offeredDesignation") != null) {
            app.setOfferedDesignation(payload.get("offeredDesignation").toString());
        }
        if (payload.containsKey("offeredCtc") && payload.get("offeredCtc") != null) {
            try { app.setOfferedCtc(Double.parseDouble(payload.get("offeredCtc").toString())); } catch (Exception ignored) {}
        }
        if (payload.containsKey("joiningDate") && payload.get("joiningDate") != null) {
            app.setJoiningDate(payload.get("joiningDate").toString());
        }
        if (payload.containsKey("offerLetterNotes") && payload.get("offerLetterNotes") != null) {
            app.setOfferLetterNotes(payload.get("offerLetterNotes").toString());
        }
        if (payload.containsKey("offerAccepted") && payload.get("offerAccepted") != null) {
            app.setOfferAccepted(Boolean.parseBoolean(payload.get("offerAccepted").toString()));
        }

        app.setViewedByCandidate(false);

        applicationRepository.save(app);
        return ResponseEntity.ok(app);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications(
            @RequestHeader("X-User-Id") Long userId) {

        List<JobApplication> apps = applicationRepository.findByUserId(userId);
        List<Map<String, Object>> result = apps.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("userId", app.getUserId());
            map.put("atsScore", app.getAtsScore());
            map.put("status", app.getStatus());
            map.put("appliedAt", app.getAppliedAt());
            map.put("interviewDate", app.getInterviewDate());
            map.put("meetingLink", app.getMeetingLink());
            map.put("interviewerName", app.getInterviewerName());
            map.put("roundName", app.getRoundName());
            map.put("interviewPlan", app.getInterviewPlan());
            map.put("assessmentTitle", app.getAssessmentTitle());
            map.put("assessmentLink", app.getAssessmentLink());
            map.put("assessmentDeadline", app.getAssessmentDeadline());
            map.put("notes", app.getNotes());
            map.put("viewedByCandidate", app.getViewedByCandidate() != null ? app.getViewedByCandidate() : true);

            map.put("technicalScore", app.getTechnicalScore());
            map.put("communicationScore", app.getCommunicationScore());
            map.put("problemSolvingScore", app.getProblemSolvingScore());
            map.put("culturalFitScore", app.getCulturalFitScore());
            map.put("recommendation", app.getRecommendation());
            map.put("strengths", app.getStrengths());
            map.put("areasForImprovement", app.getAreasForImprovement());
            map.put("interviewerFeedback", app.getInterviewerFeedback());

            map.put("offeredDesignation", app.getOfferedDesignation());
            map.put("offeredCtc", app.getOfferedCtc());
            map.put("joiningDate", app.getJoiningDate());
            map.put("offerLetterNotes", app.getOfferLetterNotes());
            map.put("offerAccepted", app.getOfferAccepted() != null ? app.getOfferAccepted() : false);

            jobRepository.findById(app.getJobId()).ifPresent(job -> {
                map.put("jobTitle", job.getTitle());
                map.put("companyName", job.getCompanyName());
                map.put("location", job.getLocation());
                map.put("salaryMin", job.getSalaryMin());
                map.put("salaryMax", job.getSalaryMax());
                map.put("experienceRequired", job.getExperienceRequired());

                String email = app.getRecruiterEmail();
                if (email == null || email.isBlank()) {
                    email = job.getRecruiterEmail();
                }
                if (email == null || email.isBlank()) {
                    email = "Naresh@gmail.com";
                }
                map.put("recruiterEmail", email);
            });

            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/my-applications/mark-viewed")
    public ResponseEntity<Void> markApplicationsViewed(@RequestHeader("X-User-Id") Long userId) {
        List<JobApplication> apps = applicationRepository.findByUserId(userId);
        for (JobApplication app : apps) {
            app.setViewedByCandidate(true);
        }
        applicationRepository.saveAll(apps);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-applications/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadApplicationsCount(@RequestHeader("X-User-Id") Long userId) {
        long unread = applicationRepository.countByUserIdAndViewedByCandidateFalse(userId);
        return ResponseEntity.ok(Map.of("unreadCount", unread));
    }

    @DeleteMapping("/interviews/{applicationId}")
    public ResponseEntity<?> cancelScheduledInterview(@PathVariable Long applicationId) {
        Optional<JobApplication> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found.");
        }
        JobApplication app = appOpt.get();
        app.setStatus("SHORTLISTED");
        app.setInterviewDate(null);
        app.setMeetingLink(null);
        app.setRoundName(null);
        app.setInterviewerName(null);
        app.setInterviewPlan(null);
        app.setViewedByCandidate(false);
        applicationRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Interview cancelled. Candidate returned to SHORTLISTED."));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Map<String, Object>>> getAllScheduledInterviews() {
        List<JobApplication> apps = applicationRepository.findAll().stream()
                .filter(a -> "INTERVIEW_SCHEDULED".equalsIgnoreCase(a.getStatus()) && a.getInterviewDate() != null)
                .toList();

        List<Map<String, Object>> result = apps.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("userId", app.getUserId());
            map.put("status", app.getStatus());
            map.put("interviewDate", app.getInterviewDate());
            map.put("meetingLink", app.getMeetingLink());
            map.put("interviewerName", app.getInterviewerName());
            map.put("roundName", app.getRoundName());
            map.put("interviewPlan", app.getInterviewPlan());
            map.put("notes", app.getNotes());
            map.put("technicalScore", app.getTechnicalScore());
            map.put("communicationScore", app.getCommunicationScore());
            map.put("problemSolvingScore", app.getProblemSolvingScore());
            map.put("culturalFitScore", app.getCulturalFitScore());
            map.put("recommendation", app.getRecommendation());
            map.put("interviewerFeedback", app.getInterviewerFeedback());
            map.put("offeredDesignation", app.getOfferedDesignation());
            map.put("offeredCtc", app.getOfferedCtc());
            map.put("offerAccepted", app.getOfferAccepted());

            jobRepository.findById(app.getJobId()).ifPresent(job -> {
                map.put("jobTitle", job.getTitle());
                map.put("companyName", job.getCompanyName());
                map.put("location", job.getLocation());
            });

            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/global-applications")
    public ResponseEntity<List<Map<String, Object>>> getGlobalApplications() {
        List<JobApplication> apps = applicationRepository.findAll();
        List<Map<String, Object>> result = apps.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("userId", app.getUserId());
            map.put("atsScore", app.getAtsScore());
            map.put("status", app.getStatus());
            map.put("appliedAt", app.getAppliedAt());
            map.put("interviewDate", app.getInterviewDate());
            map.put("meetingLink", app.getMeetingLink());
            map.put("roundName", app.getRoundName());
            map.put("interviewPlan", app.getInterviewPlan());

            jobRepository.findById(app.getJobId()).ifPresent(job -> {
                map.put("jobTitle", job.getTitle());
                map.put("companyName", job.getCompanyName());
            });

            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/applications/{applicationId}/decision")
    public ResponseEntity<?> submitHiringDecision(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> payload) {

        Optional<JobApplication> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found.");
        }

        JobApplication app = appOpt.get();
        String decision = payload.getOrDefault("decision", "HIRE").toString().toUpperCase();

        if ("HIRE".equals(decision) || "OFFER".equals(decision) || "HIRED".equals(decision)) {
            app.setStatus("HIRED");
            if (payload.containsKey("offeredDesignation")) {
                app.setOfferedDesignation(payload.get("offeredDesignation").toString());
            }
            if (payload.containsKey("offeredCtc")) {
                try { app.setOfferedCtc(Double.parseDouble(payload.get("offeredCtc").toString())); } catch (Exception ignored) {}
            }
            if (payload.containsKey("joiningDate")) {
                app.setJoiningDate(payload.get("joiningDate").toString());
            }
            if (payload.containsKey("offerLetterNotes")) {
                app.setOfferLetterNotes(payload.get("offerLetterNotes").toString());
            }
        } else {
            app.setStatus("REJECTED");
        }

        if (payload.containsKey("interviewerFeedback")) {
            app.setInterviewerFeedback(payload.get("interviewerFeedback").toString());
        }
        if (payload.containsKey("strengths")) {
            app.setStrengths(payload.get("strengths").toString());
        }
        if (payload.containsKey("areasForImprovement")) {
            app.setAreasForImprovement(payload.get("areasForImprovement").toString());
        }

        if (userEmail != null && !userEmail.isBlank()) {
            app.setRecruiterEmail(userEmail);
        } else if (app.getRecruiterEmail() == null || app.getRecruiterEmail().isBlank()) {
            app.setRecruiterEmail("Naresh@gmail.com");
        }

        app.setViewedByCandidate(false);
        applicationRepository.save(app);
        return ResponseEntity.ok(app);
    }

    @PutMapping("/applications/{applicationId}/accept-offer")
    public ResponseEntity<?> acceptOffer(@PathVariable Long applicationId) {
        Optional<JobApplication> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found.");
        }

        JobApplication app = appOpt.get();
        app.setOfferAccepted(true);
        applicationRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Offer accepted successfully!", "status", app.getStatus(), "offerAccepted", true));
    }
}
