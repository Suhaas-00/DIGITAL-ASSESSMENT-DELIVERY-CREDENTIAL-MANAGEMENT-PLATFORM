package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Assessment;
import com.DADCMP.DADCMP.entity.Credential;
import com.DADCMP.DADCMP.entity.User;
import com.DADCMP.DADCMP.enums.CredentialStatus;
import com.DADCMP.DADCMP.repository.AssessmentRepo;
import com.DADCMP.DADCMP.repository.CredentialRepo;
import com.DADCMP.DADCMP.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CredentialServiceImpl implements CredentialService {

    @Autowired
    private CredentialRepo credentialRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private AssessmentRepo assessmentRepo;

    @Override
    public Credential generateCredential(Long candidateId, Long assessmentId) {
        User candidate = usersRepo.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        Credential credential = new Credential();
        credential.setCandidate(candidate);
        credential.setAssessment(assessment);
        credential.setCredentialCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        credential.setIssueDate(LocalDateTime.now());
        credential.setExpiryDate(LocalDateTime.now().plusYears(1));
        credential.setStatus(CredentialStatus.ACTIVE);
        return credentialRepo.save(credential);
    }

    @Override
    public Credential verifyCredential(String credentialCode) {
        return credentialRepo.findByCredentialCode(credentialCode)
                .orElseThrow(() -> new RuntimeException("Invalid credential code"));
    }

    @Override
    public Credential getCredentialById(Long id) {
        return credentialRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Credential not found"));
    }

    @Override
    public List<Credential> getCredentialsByCandidate(Long candidateId) {
        return credentialRepo.findByCandidateId(candidateId);
    }

    @Override
    public List<Credential> getAllCredentials() {
        return credentialRepo.findAll();
    }
}
