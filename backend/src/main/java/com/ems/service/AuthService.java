package com.ems.service;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.dto.RegisterRequest;
import com.ems.entity.AuditLog;
import com.ems.entity.RefreshToken;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import com.ems.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for authentication operations
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;

    @Value("${jwt.access.expiration}")
    private Long accessTokenExpiration;

    @Value("${security.max-login-attempts}")
    private int maxLoginAttempts;

    @Value("${security.account-lock-duration}")
    private long accountLockDuration;

    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate password strength
        validatePasswordStrength(request.getPassword());

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        // Set role
        try {
            user.setRole(User.Role.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role. Must be ROLE_ADMIN or ROLE_HR");
        }

        user.setEnabled(true);
        userRepository.save(user);

        // Audit log
        auditLogService.log(
            user.getUsername(),
            AuditLog.Action.CREATE,
            "User",
            user.getId(),
            "User registered: " + user.getUsername(),
            "setup",
            "setup"
        );

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(
            user.getUsername(), "setup", "setup"
        );

        return new AuthResponse(
            accessToken,
            refreshToken.getToken(),
            "Bearer",
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            accessTokenExpiration
        );
    }

    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername();
        String ipAddress = request.getIpAddress() != null ? request.getIpAddress() : "unknown";
        String userAgent = request.getUserAgent() != null ? request.getUserAgent() : "unknown";

        // Check for account lockout
        long failedAttempts = auditLogService.countFailedLoginAttempts(
            username,
            LocalDateTime.now().minusMillis(accountLockDuration)
        );

        if (failedAttempts >= maxLoginAttempts) {
            auditLogService.logFailure(
                username,
                AuditLog.Action.LOGIN_FAILED,
                "User",
                "Account locked due to too many failed attempts",
                ipAddress,
                userAgent
            );
            throw new IllegalArgumentException(
                "Account locked due to too many failed login attempts. Try again later."
            );
        }

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, request.getPassword())
            );

            // Get user details
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Generate tokens
            String accessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                user.getUsername(),
                ipAddress,
                userAgent
            );

            // Audit log - successful login
            auditLogService.log(
                username,
                AuditLog.Action.LOGIN,
                "User",
                user.getId(),
                "User logged in successfully",
                ipAddress,
                userAgent
            );

            return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                "Bearer",
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                accessTokenExpiration
            );
        } catch (BadCredentialsException e) {
            // Audit log - failed login
            auditLogService.logFailure(
                username,
                AuditLog.Action.LOGIN_FAILED,
                "User",
                "Invalid credentials",
                ipAddress,
                userAgent
            );
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr);
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new AuthResponse(
            newAccessToken,
            refreshTokenStr,
            "Bearer",
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            accessTokenExpiration
        );
    }

    public void logout(String username) {
        refreshTokenService.revokeAllUserTokens(username);
        
        // Audit log
        auditLogService.log(
            username,
            AuditLog.Action.LOGOUT,
            "User",
            null,
            "User logged out",
            "unknown",
            "unknown"
        );
    }

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one digit");
        }
    }
}
