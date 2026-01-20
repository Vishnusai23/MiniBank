package com.example.demo.controller;

import com.example.demo.dto.DepositRequest;
import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.dto.TransferRequest;
import com.example.demo.service.TransactionService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<Map<String, String>> deposit(
            @RequestHeader("X-USER-EMAIL") String email,
            @Valid @RequestBody DepositRequest request) {

        transactionService.depositByEmail(email, request);
        return ResponseEntity.ok(Map.of("message", "Deposit successful"));
    }

    
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, String>> transfer(
            @RequestHeader("X-USER-EMAIL") String email,
            @Valid @RequestBody TransferRequest request) {

        transactionService.transferByEmail(email, request);
        return ResponseEntity.ok(Map.of("message","Transfer successful"));
    }
    
    @PostMapping("/history")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            @RequestBody EmailRequest request) {

        return ResponseEntity.ok(
                transactionService.getTransactionHistoryByEmail(request.getEmail())
        );
    }


}
