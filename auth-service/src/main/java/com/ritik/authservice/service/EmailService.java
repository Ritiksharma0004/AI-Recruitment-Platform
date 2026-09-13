package com.ritik.authservice.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:HireNova AI <onboarding@resend.dev>}")
    private String resendFromEmail;

    @Value("${spring.mail.username:Ritik.sde.sharma@gmail.com}")
    private String fromEmail;

    private boolean sendViaResend(String toEmail, String subject, String htmlBody) {
        if (resendApiKey == null || resendApiKey.trim().isEmpty()) {
            return false;
        }

        try {
            log.info("🚀 Dispatching email to {} via Resend REST API (Port 443 / HTTPS)...", toEmail);
            String url = "https://api.resend.com/emails";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey.trim());

            Map<String, Object> body = new HashMap<>();
            body.put("from", resendFromEmail);
            body.put("to", Collections.singletonList(toEmail));
            body.put("subject", subject);
            body.put("html", htmlBody);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Resend API successfully accepted email for {}. Response: {}", toEmail, response.getBody());
                return true;
            } else {
                log.warn("⚠️ Resend API responded with status {}: {}", response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.error("⚠️ Resend API dispatch error for {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private boolean sendViaSmtp(String toEmail, String subject, String htmlBody) {
        try {
            log.info("📧 Attempting SMTP dispatch to {}...", toEmail);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "HireNova AI Recruitment");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("✅ Email successfully delivered via SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.error("⚠️ SMTP delivery failed for {}: {}. Cause: {}", toEmail, e.getMessage(), e.getCause() != null ? e.getCause().getMessage() : "none");
            return false;
        }
    }

    public boolean sendRegistrationOtpEmail(String toEmail, String otp) {
        String targetEmail = toEmail != null ? toEmail.trim().toLowerCase() : "";
        if (targetEmail.isEmpty()) {
            log.warn("Cannot send registration OTP: target email is empty");
            return false;
        }

        String subject = "🔐 [HireNova AI] Candidate Email Verification Code: " + otp;
        String htmlBody = "<!DOCTYPE html>"
                + "<html>"
                + "<body style=\"background-color: #07080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; padding: 40px 20px; margin: 0;\">"
                + "  <div style=\"max-width: 520px; margin: 0 auto; background: #0e1322; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);\">"
                + "    <div style=\"text-align: center; margin-bottom: 24px;\">"
                + "      <h1 style=\"color: #6366f1; font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.5px;\">HireNova AI</h1>"
                + "      <p style=\"color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;\">Candidate Verification Portal</p>"
                + "    </div>"
                + "    <h2 style=\"font-size: 17px; font-weight: 500; color: #ffffff; margin-bottom: 12px;\">Verify Your Email Address</h2>"
                + "    <p style=\"font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;\">"
                + "      Welcome to HireNova AI. To complete your candidate account enrollment and verify <strong>" + targetEmail + "</strong>, enter the one-time verification code (OTP) below:"
                + "    </p>"
                + "    <div style=\"background: #090c16; border: 1px solid #312e81; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;\">"
                + "      <span style=\"font-size: 34px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 8px; color: #818cf8;\">" + otp + "</span>"
                + "    </div>"
                + "    <p style=\"font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;\">"
                + "      ⏳ <strong>This code is valid for 10 minutes.</strong><br/>"
                + "      Do not share this code with anyone. If you did not attempt to register on HireNova AI, you can safely ignore this email."
                + "    </p>"
                + "  </div>"
                + "</body>"
                + "</html>";

        // Try Resend HTTPS REST API first (bypasses Render SMTP port blocks)
        if (sendViaResend(targetEmail, subject, htmlBody)) {
            return true;
        }

        // Fallback to SMTP
        return sendViaSmtp(targetEmail, subject, htmlBody);
    }

    public boolean sendPasswordResetEmail(String toEmail, String resetCode) {
        String targetEmail = toEmail != null ? toEmail.trim().toLowerCase() : "";
        if (targetEmail.isEmpty()) {
            log.warn("Cannot send password reset: target email is empty");
            return false;
        }

        String subject = "🔑 [HireNova AI] Your One-Time Password Reset Key";
        String htmlBody = "<!DOCTYPE html>"
                + "<html>"
                + "<body style=\"background-color: #07080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; padding: 40px 20px; margin: 0;\">"
                + "  <div style=\"max-width: 520px; margin: 0 auto; background: #0e1322; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);\">"
                + "    <div style=\"text-align: center; margin-bottom: 24px;\">"
                + "      <h1 style=\"color: #6366f1; font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.5px;\">HireNova AI</h1>"
                + "      <p style=\"color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;\">Identity Security Portal</p>"
                + "    </div>"
                + "    <h2 style=\"font-size: 17px; font-weight: 500; color: #ffffff; margin-bottom: 12px;\">Password Reset Request</h2>"
                + "    <p style=\"font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;\">"
                + "      We received a request to reset the security credentials for your account (<strong>" + targetEmail + "</strong>). Use the one-time verification code below to set a new password:"
                + "    </p>"
                + "    <div style=\"background: #090c16; border: 1px solid #312e81; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;\">"
                + "      <span style=\"font-size: 32px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 8px; color: #818cf8;\">" + resetCode + "</span>"
                + "    </div>"
                + "    <p style=\"font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;\">"
                + "      ⏳ <strong>This key expires in 15 minutes.</strong><br/>"
                + "      If you did not request this password reset, please ignore this email or notify your system administrator immediately."
                + "    </p>"
                + "  </div>"
                + "</body>"
                + "</html>";

        // Try Resend HTTPS REST API first (bypasses Render SMTP port blocks)
        if (sendViaResend(targetEmail, subject, htmlBody)) {
            return true;
        }

        // Fallback to SMTP
        return sendViaSmtp(targetEmail, subject, htmlBody);
    }
}
