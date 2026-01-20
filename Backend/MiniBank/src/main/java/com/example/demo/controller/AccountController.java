package com.example.demo.controller;

import com.example.demo.dto.AccountCreateRequest;
import com.example.demo.dto.AccountDetailsRequest;
import com.example.demo.dto.AccountDetailsResponse;
import com.example.demo.service.AccountService;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createAccount(
            @Valid @RequestBody AccountCreateRequest request) {

        accountService.createAccount(request);

        return ResponseEntity.ok(
            Map.of("message", "Account created successfully")
        );
    }


    @PostMapping("/user")
    public AccountDetailsResponse viewAccount(@RequestBody AccountDetailsRequest email) {
        return accountService.getAccountDetails(email);
    }
}
