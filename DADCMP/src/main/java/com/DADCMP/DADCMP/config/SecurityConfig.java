package com.DADCMP.DADCMP.config;

import com.DADCMP.DADCMP.security.JwtFilter;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    // 🔐 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS using bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth

                        // ✅ Allow preflight requests (VERY IMPORTANT for CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ Public APIs
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                        .requestMatchers("/api/credentials/verify/**").permitAll() // Public verification

                        // 🔒 Role-based APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMINISTRATOR")
                        .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
                        .requestMatchers("/api/examiner/**").hasAnyRole("EXAMINER", "ADMINISTRATOR")

                        // 🔒 All others secured
                        .anyRequest().authenticated())

                // 🔐 JWT Filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🌐 CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow ANY localhost port (Angular dynamic ports)
        config.setAllowedOriginPatterns(List.of("http://localhost:*"));

        // ✅ Allow all HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Allow all headers
        config.setAllowedHeaders(List.of("*"));

        // ✅ Allow credentials (JWT, cookies if needed)
        config.setAllowCredentials(true);

        // ✅ Cache preflight response (optional but good)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}