package com.ems.service;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.dto.RegisterRequest;
import com.ems.entity.RefreshToken;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import com.ems.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    @Value("${jwt.access.expiration}")
    private Long accessTokenExpiration;

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
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        // Get user details
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(
            user.getUsername(),
            request.getIpAddress() != null ? request.getIpAddress() : "unknown",
            request.getUserAgent() != null ? request.getUserAgent() : "unknown"
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
