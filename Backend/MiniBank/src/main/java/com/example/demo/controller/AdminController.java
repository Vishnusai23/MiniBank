package com.example.demo.controller;

import com.example.demo.dto.AccountStatusUpdateRequest;
import com.example.demo.dto.AdminAccountResponse;
import com.example.demo.dto.AdminTransactionResponse;
import com.example.demo.dto.AdminUserResponse;
import com.example.demo.model.Account;
import com.example.demo.model.AccountStatus;
import com.example.demo.service.AdminService;
import com.example.demo.service.AdminTransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private AdminTransactionService adminTransactionService;

        // 1️⃣ Pending accounts
        @GetMapping("/accounts/pending")
        public List<Account> viewPendingAccounts() {
            return adminService.getPendingAccounts();
        }

        // 2️⃣ Update status (APPROVE / REJECT / BLOCK)
        @PutMapping("/accounts/status")
        public ResponseEntity<?> updateStatus(
                @RequestBody AccountStatusUpdateRequest request) {

            adminService.updateAccountStatus(
                    request.getAccountNumber(),
                    request.getStatus()
            );

            return ResponseEntity.ok(
                Map.of("message", "Account status updated successfully")
            );
        }
        
        @GetMapping("/transactions")
        public List<AdminTransactionResponse> viewAllTransactions() {
            return adminTransactionService.getAllTransactions();
        }

        // (leave these as-is)
        @GetMapping("/users")
        public List<AdminUserResponse> viewAllUsers() {
            return adminService.getAllUsers();
        }

        @GetMapping("/accounts")
        public List<AdminAccountResponse> viewAllAccounts() {
            return adminService.getAllAccounts();
        }
    }


