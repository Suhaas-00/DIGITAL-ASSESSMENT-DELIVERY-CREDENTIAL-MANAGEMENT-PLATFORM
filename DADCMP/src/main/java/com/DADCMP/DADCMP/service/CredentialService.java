package com.DADCMP.DADCMP.service;

import com.DADCMP.DADCMP.entity.Credential;
import java.util.List;

public interface CredentialService {
    Credential generateCredential(Long candidateId, Long assessmentId);
    Credential verifyCredential(String credentialCode);
    Credential getCredentialById(Long id);
    List<Credential> getCredentialsByCandidate(Long candidateId);
    List<Credential> getAllCredentials();
}
