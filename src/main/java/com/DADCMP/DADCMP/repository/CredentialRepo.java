package com.DADCMP.DADCMP.repository;

import com.DADCMP.DADCMP.entity.Credential;
import com.DADCMP.DADCMP.enums.CredentialStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CredentialRepo extends JpaRepository<Credential, Long> {
    List<Credential> findByCandidateId(Long candidateId);
    Optional<Credential> findByCredentialCode(String credentialCode);
    List<Credential> findByStatus(CredentialStatus status);
    List<Credential> findByCandidateFullNameContainingIgnoreCase(String candidateName);
}
