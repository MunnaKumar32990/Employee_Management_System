package com.ems.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Utility class for input sanitization and XSS prevention
 */
@Component
public class InputSanitizer {

    private static final Pattern HTML_PATTERN = Pattern.compile("<[^>]*>");
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        ".*(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|eval).*",
        Pattern.CASE_INSENSITIVE
    );

    /**
     * Sanitize input by removing HTML tags and potentially dangerous content
     */
    public String sanitize(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        // Remove script tags
        String sanitized = SCRIPT_PATTERN.matcher(input).replaceAll("");
        
        // Remove HTML tags
        sanitized = HTML_PATTERN.matcher(sanitized).replaceAll("");
        
        // Encode special characters
        sanitized = sanitized
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");

        return sanitized.trim();
    }

    /**
     * Check if input contains potential SQL injection patterns
     */
    public boolean containsSqlInjection(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).matches();
    }

    /**
     * Validate email format
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    /**
     * Validate phone number format
     */
    public boolean isValidPhoneNumber(String phone) {
        if (phone == null || phone.isEmpty()) {
            return false;
        }
        return phone.matches("^[0-9]{10}$");
    }

    /**
     * Sanitize filename to prevent directory traversal
     */
    public String sanitizeFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            return filename;
        }
        
        // Remove path separators and special characters
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
