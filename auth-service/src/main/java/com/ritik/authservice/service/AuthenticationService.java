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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static class ResetEntry {
        final String code;
        final LocalDateTime expiry;
        ResetEntry(String code, LocalDateTime expiry) {
            this.code = code;
            this.expiry = expiry;
        }
    }
    private final Map<String, ResetEntry> resetTokens = new ConcurrentHashMap<>();
    private final Map<String, ResetEntry> registrationOtps = new ConcurrentHashMap<>();

    public Map<String, Object> sendRegistrationOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Valid email address is required");
        }
        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("An account with this email already exists. Please log in instead.");
        }

        String otp = String.format("%06d", new SecureRandom().nextInt(1000000));
        registrationOtps.put(normalizedEmail, new ResetEntry(otp, LocalDateTime.now().plusMinutes(10)));

        boolean emailSent = emailService.sendRegistrationOtpEmail(normalizedEmail, otp);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("email", normalizedEmail);
        response.put("emailSent", emailSent);
        if (emailSent) {
            response.put("message", "A 6-digit verification code has been dispatched to " + normalizedEmail);
        } else {
            response.put("message", "A 6-digit verification code was generated for " + normalizedEmail);
            response.put("devOtp", otp);
        }
        return response;
    }

    public String register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Candidate ONLY OTP verification
        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new RuntimeException("6-digit email verification code (OTP) is required");
        }

        ResetEntry entry = registrationOtps.get(normalizedEmail);
        if (entry == null) {
            throw new RuntimeException("No active verification code found for this email. Please click 'Send Code'.");
        }
        if (LocalDateTime.now().isAfter(entry.expiry)) {
            registrationOtps.remove(normalizedEmail);
            throw new RuntimeException("Verification code has expired. Please request a new code.");
        }
        if (!entry.code.equals(request.getOtp().trim())) {
            throw new RuntimeException("Invalid verification code (OTP). Please check your code and try again.");
        }

        registrationOtps.remove(normalizedEmail);
        request.setEmail(normalizedEmail);

        User user = UserMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "Candidate Registered Successfully";
    }

    public String registerRecruiter(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        User user = UserMapper.toRecruiterEntity(request, passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "Recruiter Registered Successfully";
    }

    public String registerAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        User user = UserMapper.toAdminEntity(request, passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "Admin Registered Successfully";
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(
                user.getId(), user.getEmail(), user.getUsername(), user.getRole().name()
        );

        return UserMapper.toAuthResponse(user, token);
    }

    public Map<String, Object> getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());
        profile.put("createdAt", user.getCreatedAt());
        
        return profile;
    }

    public String changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return "Password changed successfully";
    }
    
    public String adminResetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found by id " + userId));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return "User " + user.getEmail() + " password forcefully reset by admin.";
    }
    
    public Map<String, String> triggerForgotPassword(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No account registered with email: " + email));
                
        String code = String.format("%06d", new java.util.Random().nextInt(1000000));
        resetTokens.put(normalizedEmail, new ResetEntry(code, LocalDateTime.now().plusMinutes(15)));
        
        emailService.sendPasswordResetEmail(normalizedEmail, code);
        
        Map<String, String> res = new HashMap<>();
        res.put("message", "A 6-digit security reset key has been sent to " + normalizedEmail + ".");
        res.put("email", normalizedEmail);
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
        ResetEntry entry = resetTokens.get(normalizedEmail);
        if (entry == null) {
            throw new RuntimeException("No active reset request found for this email. Please request a new code.");
        }
        if (LocalDateTime.now().isAfter(entry.expiry)) {
            resetTokens.remove(normalizedEmail);
            throw new RuntimeException("Reset code has expired. Please request a new one.");
        }
        if (!entry.code.equals(resetCode.trim())) {
            throw new RuntimeException("Invalid verification code. Please check and try again.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        resetTokens.remove(normalizedEmail);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Security key / password reset successfully. You can now log in.");
        return res;
    }
    
    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalCandidates", userRepository.countByRole(Role.CANDIDATE));
        stats.put("totalRecruiters", userRepository.countByRole(Role.RECRUITER));
        stats.put("totalAdmins", userRepository.countByRole(Role.ADMIN));
        return stats;
    }
}
