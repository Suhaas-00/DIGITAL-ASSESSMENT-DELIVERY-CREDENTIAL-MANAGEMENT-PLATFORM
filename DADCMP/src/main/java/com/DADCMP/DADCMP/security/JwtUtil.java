package com.DADCMP.DADCMP.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs) {

        byte[] keyBytes = secret.getBytes();

        if (keyBytes.length < 32) {
            throw new RuntimeException("JWT secret key must be at least 32 bytes long. Current length: " + keyBytes.length);
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    // ✅ FIXED HERE
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key) // ✅ CORRECT for jjwt 0.12+
                .compact();
    }

    private Claims extractClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT: " + e.getMessage());
            return null;
        }
    }

    public String extractUsername(String token) {
        Claims claims = extractClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public String extractRole(String token) {
        Claims claims = extractClaims(token);
        return claims != null ? claims.get("role", String.class) : null;
    }

    public boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);

        return extractedUsername != null
                && extractedUsername.equals(username)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Claims claims = extractClaims(token);
        return claims == null || claims.getExpiration().before(new Date());
    }
}