package com.ritik.authservice.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:Ritik.sde.sharma@gmail.com}")
    private String fromEmail;

    public boolean sendRegistrationOtpEmail(String toEmail, String otp) {
        String targetEmail = toEmail != null ? toEmail.trim().toLowerCase() : "";
        if (targetEmail.isEmpty()) {
            log.warn("Cannot send registration OTP: target email is empty");
            return false;
        }

        try {
            log.info("📧 Initiating Registration OTP dispatch to {} via SMTP...", targetEmail);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "HireNova AI Recruitment");
            helper.setTo(targetEmail);
            helper.setSubject("🔐 [HireNova AI] Candidate Email Verification Code: " + otp);

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

            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("✅ Registration OTP successfully dispatched via SMTP to {}", targetEmail);
            return true;

        } catch (Exception e) {
            log.error("⚠️ SMTP delivery failed for {}: {}. Cause: {}", targetEmail, e.getMessage(), e.getCause() != null ? e.getCause().getMessage() : "none");
            log.warn("==========================================================================");
            log.warn("🔑 [SECURE BACKEND LOG] Fallback Registration OTP for Candidate {}: {}", targetEmail, otp);
            log.warn("==========================================================================");
            return false;
        }
    }

    public boolean sendPasswordResetEmail(String toEmail, String resetCode) {
        String targetEmail = toEmail != null ? toEmail.trim().toLowerCase() : "";
        if (targetEmail.isEmpty()) {
            log.warn("Cannot send password reset: target email is empty");
            return false;
        }

        try {
            log.info("📧 Initiating Password Reset Key dispatch to {} via SMTP...", targetEmail);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "HireNova AI Recruitment");
            helper.setTo(targetEmail);
            helper.setSubject("🔑 [HireNova AI] Your One-Time Password Reset Key");

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

            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("✅ Password reset email successfully dispatched via SMTP to {}", targetEmail);
            return true;

        } catch (Exception e) {
            log.error("⚠️ SMTP delivery failed for password reset {}: {}. Cause: {}", targetEmail, e.getMessage(), e.getCause() != null ? e.getCause().getMessage() : "none");
            log.warn("==========================================================================");
            log.warn("🔑 [SECURE BACKEND LOG] Fallback Password Reset Key for {}: {}", targetEmail, resetCode);
            log.warn("==========================================================================");
            return false;
        }
    }
}
