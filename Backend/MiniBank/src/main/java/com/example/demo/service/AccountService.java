package com.example.demo.service;

import com.example.demo.dto.AccountDetailsResponse;
import com.example.demo.dto.AccountCreateRequest;
import com.example.demo.dto.AccountDetailsRequest;
import com.example.demo.model.Account;
import com.example.demo.model.AccountStatus;
import com.example.demo.model.AccountType;
import com.example.demo.model.User;
import com.example.demo.repository.AccountRepository;
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

    public void createAccount(AccountCreateRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (accountRepository.existsByUser(user)) {
            throw new RuntimeException("User already has an account");
        }

        // ================= DOB VALIDATION =================
        LocalDate dob = request.getDob();
        LocalDate today = LocalDate.now();

        LocalDate minAllowedDob = today.minusYears(18);
        LocalDate maxAllowedDob = today.minusYears(100);

        if (dob.isAfter(minAllowedDob)) {
            throw new IllegalArgumentException("User must be at least 18 years old");
        }

        if (dob.isBefore(maxAllowedDob)) {
            throw new IllegalArgumentException("Date of birth must be within last 100 years");
        }
        // ==================================================

        Account account = new Account();
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setFullName(request.getFullName());
        account.setDob(dob);
        account.setPhoneNumber(request.getPhoneNumber());
        account.setPanNumber(request.getPanNumber());
        account.setAadhaarNumber(request.getAadhaarNumber());
        account.setAddress(request.getAddress());
        account.setAccountType(request.getAccountType());
        account.setStatus(AccountStatus.PENDING);

        if (request.getAccountType() == AccountType.SAVINGS) {
            account.setBalance(BigDecimal.valueOf(500));
        } else {
            account.setBalance(BigDecimal.valueOf(1000));
        }

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
