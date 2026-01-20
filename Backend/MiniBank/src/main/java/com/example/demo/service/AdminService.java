package com.example.demo.service;

import com.example.demo.dto.AdminAccountResponse;
import com.example.demo.dto.AdminUserResponse;
import com.example.demo.model.Account;
import com.example.demo.model.AccountStatus;
import com.example.demo.model.User;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AccountRepository accountRepository;

	@Autowired
	private UserRepository userRepository;

    // 1️⃣ View all PENDING accounts
    public List<Account> getPendingAccounts() {
        return accountRepository.findByStatus(AccountStatus.PENDING);
    }

    // 2️⃣ Approve account (PENDING → ACTIVE)
    public String approveAccount(Long accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getStatus() != AccountStatus.PENDING) {
            return "Only PENDING accounts can be approved";
        }

        account.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(account);

        return "Account approved successfully";
    }

    // 3️⃣ Change account status (ACTIVE ↔ BLOCKED / CLOSED)
    public String changeAccountStatus(Long accountNumber, AccountStatus status) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus(status);
        accountRepository.save(account);

        return "Account status updated to " + status;
    }
    
    public void updateAccountStatus(Long accountNumber, AccountStatus status) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus(status);
        accountRepository.save(account);
    }
    
    public List<AdminUserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            AdminUserResponse res = new AdminUserResponse();
            res.setUserId(user.getUserId());
            res.setEmail(user.getEmail());
            return res;
        }).collect(Collectors.toList());
    }
    
    public List<AdminAccountResponse> getAllAccounts() {

        List<Account> accounts = accountRepository.findAll();

        return accounts.stream().map(acc -> {
            AdminAccountResponse res = new AdminAccountResponse();
            res.setAccountNumber(acc.getAccountNumber());
            res.setFullName(acc.getFullName());
            res.setUserEmail(acc.getUser().getEmail());
            res.setAccountType(acc.getAccountType());
            res.setBalance(acc.getBalance());
            res.setStatus(acc.getStatus());
            return res;
        }).collect(Collectors.toList());
    }
}
