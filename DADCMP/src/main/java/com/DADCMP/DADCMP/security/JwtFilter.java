package com.DADCMP.DADCMP.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // ✅ BYPASS JWT for public endpoints
        if (path.equals("/api/users/register") || path.equals("/api/users/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // Check for Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            // Validate token
            if (username != null && jwtUtil.validateToken(token, username)) {
                String role = jwtUtil.extractRole(token);
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}