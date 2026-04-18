package com.DADCMP.DADCMP.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

import com.DADCMP.DADCMP.enums.Role;
import com.DADCMP.DADCMP.enums.Status;

@Data
@Entity
@Table(name = "users") // safer than "user"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
}