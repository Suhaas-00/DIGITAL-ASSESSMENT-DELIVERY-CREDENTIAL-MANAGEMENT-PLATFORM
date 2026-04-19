package com.DADCMP.DADCMP.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.DADCMP.DADCMP.service.UserService;
import com.DADCMP.DADCMP.entity.User;

import com.DADCMP.DADCMP.dto.LoginRequest;
import com.DADCMP.DADCMP.dto.AuthResponse;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
public AuthResponse login(@RequestBody LoginRequest request) {
    return userService.loginUser(request);
}
}
