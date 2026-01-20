package com.example.demo.service;

import com.example.demo.dto.AdminTransactionResponse;
import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminTransactionService {

    @Autowired
    private TransactionRepository transactionRepository; // ✅ AUTOWIRED

    public List<AdminTransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AdminTransactionResponse mapToResponse(Transaction txn) {

        AdminTransactionResponse res = new AdminTransactionResponse();

        res.setTransactionId(txn.getTransactionId());
        res.setAccountNumber(txn.getAccount().getAccountNumber());
        res.setFullName(txn.getAccount().getFullName());
        res.setUserEmail(txn.getAccount().getUser().getEmail());
        res.setType(txn.getType());
        res.setAmount(txn.getAmount());
        res.setDescription(txn.getDescription());
        res.setTransactionTime(txn.getTransactionTime());

        return res;
    }
}
