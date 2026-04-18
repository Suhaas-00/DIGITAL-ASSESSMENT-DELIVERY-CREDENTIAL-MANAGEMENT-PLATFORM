package com.DADCMP.DADCMP.controller;

import com.DADCMP.DADCMP.entity.Credential;
import com.DADCMP.DADCMP.service.CredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    @Autowired
    private CredentialService credentialService;

    @GetMapping("/verify/{code}")
    public Credential verify(@PathVariable String code) {
        return credentialService.verifyCredential(code);
    }
}
