package com.ritik.authservice.service;

import com.ritik.authservice.dto.request.ChangePasswordRequest;
import com.ritik.authservice.dto.request.LoginRequest;
import com.ritik.authservice.dto.request.RegisterRequest;
import com.ritik.authservice.dto.response.AuthResponse;
import com.ritik.authservice.entity.User;
import com.ritik.authservice.mapper.UserMapper;
import com.ritik.authservice.repository.UserRepository;
import com.ritik.authservice.role.Role;
import com.ritik.authservice.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static class SecureCodeEntry {
        final String hashedCode;
        final LocalDateTime expiry;
        SecureCodeEntry(String hashedCode, LocalDateTime expiry) {
            this.hashedCode = hashedCode;
            this.expiry = expiry;
        }
    }

    private final Map<String, SecureCodeEntry> resetTokens = new ConcurrentHashMap<>();
    private final Map<String, SecureCodeEntry> registrationOtps = new ConcurrentHashMap<>();

    public Map<String, Object> sendRegistrationOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Valid email address is required");
        }
        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("An account with this email already exists. Please log in instead.");
        }

        String rawOtp = String.format("%06d", new SecureRandom().nextInt(1000000));
        
        registrationOtps.put(normalizedEmail, new SecureCodeEntry(passwordEncoder.encode(rawOtp), LocalDateTime.now().plusMinutes(10)));

        boolean emailSent = emailService.sendRegistrationOtpEmail(normalizedEmail, rawOtp);

        if (!emailSent) {
            log.error("Failed to send registration OTP email to {}", normalizedEmail);
            throw new RuntimeException("Unable to send verification email. Mail delivery service is currently unavailable.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("email", normalizedEmail);
        response.put("message", "A 6-digit verification code has been dispatched to " + normalizedEmail);

        return response;
    }

    public String register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        request.setEmail(normalizedEmail);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new RuntimeException("6-digit email verification code (OTP) is required");
        }

        SecureCodeEntry entry = registrationOtps.get(normalizedEmail);
        if (entry == null) {
            throw new RuntimeException("No active verification code found for this email. Please request a new code.");
        }
        if (LocalDateTime.now().isAfter(entry.expiry)) {
            registrationOtps.remove(normalizedEmail);
            throw new RuntimeException("Verification code has expired. Please request a new one.");
        }
        if (!passwordEncoder.matches(request.getOtp().trim(), entry.hashedCode)) {
            throw new RuntimeException("Invalid verification code. Please check and try again.");
        }

        registrationOtps.remove(normalizedEmail);

        User user = UserMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CANDIDATE);
        userRepository.save(user);
        return "Candidate Registration successful!";
    }

    public String registerRecruiter(RegisterRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        request.setEmail(normalizedEmail);
        
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = UserMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RECRUITER);
        userRepository.save(user);
        return "Recruiter Registration successful!";
    }

    public String registerAdmin(RegisterRequest request) {
         String normalizedEmail = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
         request.setEmail(normalizedEmail);
         
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = UserMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        return "Admin Registration successful!";
    }

    public String changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully";
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getUsername(), user.getRole().name());
        return UserMapper.toAuthResponse(user, token);
    }
    
    public Map<String, Object> getProfile(String email) {
        User user = userRepository.findByEmail(email != null ? email.toLowerCase().trim() : "")
                .orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> profile = new HashMap<>();        
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("username", user.getUsername());
        profile.put("role", user.getRole().name());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("updatedAt", user.getUpdatedAt());
        return profile;
    }
    
    public String adminResetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return "User " + user.getEmail() + " password forcefully reset by admin.";
    }
    
    public Map<String, Object> triggerForgotPassword(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No account registered with email: " + email));
                
        String rawCode = String.format("%06d", new SecureRandom().nextInt(1000000));
        resetTokens.put(normalizedEmail, new SecureCodeEntry(passwordEncoder.encode(rawCode), LocalDateTime.now().plusMinutes(15)));
        
        boolean emailSent = emailService.sendPasswordResetEmail(normalizedEmail, rawCode);
        
        if (!emailSent) {
            log.error("Failed to send password reset email to {}", normalizedEmail);
            throw new RuntimeException("Unable to deliver password reset email. Mail delivery service is currently unavailable.");
        }
        
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("email", normalizedEmail);
        res.put("message", "A 6-digit security reset key has been sent to " + normalizedEmail + ".");

        return res;
    }

    public Map<String, String> resetPassword(String email, String resetCode, String newPassword) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }
        if (resetCode == null || resetCode.trim().isEmpty()) {
            throw new RuntimeException("Security verification code is required.");
        }
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters.");
        }

        String normalizedEmail = email.trim().toLowerCase();
        SecureCodeEntry entry = resetTokens.get(normalizedEmail);
        if (entry == null) {
            throw new RuntimeException("No active reset request found for this email. Please request a new code.");
        }
        if (LocalDateTime.now().isAfter(entry.expiry)) {
            resetTokens.remove(normalizedEmail);
            throw new RuntimeException("Reset code has expired. Please request a new one.");
        }
        if (!passwordEncoder.matches(resetCode.trim(), entry.hashedCode)) {
            throw new RuntimeException("Invalid verification code. Please check and try again.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        resetTokens.remove(normalizedEmail);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password successfully reset. You can now login with your new password.");
        return response;
    }
    
    public Map<String, Long> getAdminStats() {
        return Map.of(
            "totalUsers", userRepository.count(),
            "admins", userRepository.countByRole(Role.ADMIN),
            "recruiters", userRepository.countByRole(Role.RECRUITER),
            "candidates", userRepository.countByRole(Role.CANDIDATE)
        );
    }
}
