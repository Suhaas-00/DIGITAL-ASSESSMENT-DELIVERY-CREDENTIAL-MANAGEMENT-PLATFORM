package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.User;
import com.DADCMP.DADCMP.repository.UsersRepo;
import com.DADCMP.DADCMP.security.JwtUtil;
import com.DADCMP.DADCMP.dto.AuthResponse;
import com.DADCMP.DADCMP.dto.LoginRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    public User registerUser(User user) {

        if (usersRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

    if (usersRepo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return usersRepo.save(user);
    }

    // ✅ LOGIN
    public AuthResponse loginUser(LoginRequest request) {

        User user = usersRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}