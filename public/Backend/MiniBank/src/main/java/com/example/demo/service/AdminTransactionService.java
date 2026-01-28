package com.example.demo.service;

import com.example.demo.dto.AdminTransactionResponse;
import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionType;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminTransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<AdminTransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    private Long extractAccountNumber(String remarks) {
        if (remarks == null) {
            return null;
        }

        // Expected formats:
        // "Transfer to account 12345"
        // "Transfer from account 67890"

        String[] parts = remarks.split(" ");
        return Long.parseLong(parts[parts.length - 1]);
    }


    private AdminTransactionResponse mapToResponse(Transaction txn) {

        AdminTransactionResponse res = new AdminTransactionResponse();

        Long myAccount = txn.getAccount().getAccountNumber();

        res.setTransactionId(txn.getTransactionId());
        res.setAccountNumber(myAccount); // primary account (sender for debit, receiver for credit)
        res.setFullName(txn.getAccount().getFullName());
        res.setUserEmail(txn.getAccount().getUser().getEmail());

        res.setType(txn.getType());
        res.setAmount(txn.getAmount());
        res.setStatus(txn.getStatus());
        res.setRemarks(txn.getRemarks());
        res.setTransactionTime(txn.getTransactionTime());

        // ✅ DERIVE RECEIVER ACCOUNT NUMBER
        if (txn.getType() == TransactionType.DEBIT
                && txn.getRemarks() != null
                && txn.getRemarks().startsWith("Transfer to account")) {

            // sender = myAccount, receiver is in remarks
            res.setReceiverAccountNumber(extractAccountNumber(txn.getRemarks()));

        } else if (txn.getType() == TransactionType.CREDIT
                && txn.getRemarks() != null
                && txn.getRemarks().startsWith("Transfer from account")) {

            // receiver = myAccount
            res.setReceiverAccountNumber(myAccount);

        } else {
            // Non-transfer (deposit, etc.)
            res.setReceiverAccountNumber(myAccount);
        }
        

        return res;
        
    }

}
