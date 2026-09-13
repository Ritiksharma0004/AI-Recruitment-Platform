package com.ritik.authservice.controller;

import com.ritik.authservice.dto.request.ChangePasswordRequest;
import com.ritik.authservice.dto.request.LoginRequest;
import com.ritik.authservice.dto.request.RegisterRequest;
import com.ritik.authservice.dto.response.AuthResponse;
import com.ritik.authservice.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/send-registration-otp")
    public ResponseEntity<Map<String, String>> sendRegistrationOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return ResponseEntity.ok(authenticationService.sendRegistrationOtp(email));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/recruiter")
    public ResponseEntity<String> registerRecruiter(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerRecruiter(request));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerAdmin(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(
                authenticationService.changePassword(authentication.getName(), request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profile(Authentication authentication) {
        return ResponseEntity.ok(authenticationService.getProfile(authentication.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/reset-password/{userId}")
    public ResponseEntity<String> adminResetPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        return ResponseEntity.ok(authenticationService.adminResetPassword(userId, newPassword));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return ResponseEntity.ok(authenticationService.triggerForgotPassword(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String resetCode = request.get("resetCode");
        String newPassword = request.get("newPassword");
        return ResponseEntity.ok(authenticationService.resetPassword(email, resetCode, newPassword));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(authenticationService.getAdminStats());
    }
}
