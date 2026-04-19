package com.DADCMP.DADCMP.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.DADCMP.DADCMP.entity.User;

public interface UsersRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    java.util.Optional<User> findByUsername(String username);
}
