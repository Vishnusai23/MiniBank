package com.example.demo.service;

import com.example.demo.dto.AccountDetailsResponse;
import com.example.demo.dto.AccountCreateRequest;
import com.example.demo.dto.AccountDetailsRequest;
import com.example.demo.model.Account;
import com.example.demo.model.AccountStatus;
import com.example.demo.model.AccountType;
import com.example.demo.model.IdentityKyc;
import com.example.demo.model.User;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.IdentityKycRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private IdentityKycRepository identityKycRepository;

 public void createAccount(AccountCreateRequest request) {

    // 1️⃣ Fetch user using email from request
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 2️⃣ Enforce one-account-per-user
    if (accountRepository.existsByUser(user)) {
        throw new RuntimeException("User already has an account");
    }

    // ================= DOB VALIDATION =================
    LocalDate dob = request.getDob();
    LocalDate today = LocalDate.now();

    if (dob.isAfter(today.minusYears(18))) {
        throw new IllegalArgumentException("User must be at least 18 years old");
    }

    if (dob.isBefore(today.minusYears(100))) {
        throw new IllegalArgumentException("Date of birth must be within last 100 years");
    }
    // ==================================================

    // 3️⃣ Validate identity against identity_kyc table
    IdentityKyc identity = identityKycRepository
            .findByIdentityTypeAndIdentityNumber(
                    request.getIdentityType().name(),
                    request.getIdentityNumber()
            )
            .orElseThrow(() ->
                    new RuntimeException("Invalid identity details")
            );

    // 4️⃣ Create account
    Account account = new Account();
    account.setUser(user);
    account.setAccountNumber(generateAccountNumber());

    account.setFullName(request.getFullName());
    account.setDob(dob);
    account.setPhoneNumber(request.getPhoneNumber());

    // 🔐 Identity (generic)
    account.setIdentityType(request.getIdentityType());
    account.setIdentityNumber(request.getIdentityNumber());

    // 📍 Address from trusted source (identity_kyc)
    account.setAddress(identity.getAddress());

    account.setAccountType(request.getAccountType());
    account.setStatus(AccountStatus.PENDING);

    // 5️⃣ Initial balance logic
    if (request.getAccountType() == AccountType.SAVINGS) {
        account.setBalance(BigDecimal.valueOf(500));
    } else {
        account.setBalance(BigDecimal.valueOf(1000));
    }

    // 6️⃣ Save account
    accountRepository.save(account);
}




    // VIEW ACCOUNT DETAILS
    public AccountDetailsResponse getAccountDetails(AccountDetailsRequest email) {

        User user = userRepository.findByEmail(email.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        AccountDetailsResponse response = new AccountDetailsResponse();
        response.setAccountNumber(account.getAccountNumber());
        response.setFullName(account.getFullName());
        response.setPhoneNumber(account.getPhoneNumber());
        response.setAddress(account.getAddress());
        response.setAccountType(account.getAccountType());
        response.setBalance(account.getBalance());
        response.setStatus(account.getStatus());

        return response;
    }

    // ACCOUNT NUMBER GENERATOR
    private Long generateAccountNumber() {
        return 1000000000L + new Random().nextInt(900000000);
    }
}
