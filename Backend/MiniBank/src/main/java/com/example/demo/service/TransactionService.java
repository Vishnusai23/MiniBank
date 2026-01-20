package com.example.demo.service;

import com.example.demo.dto.DepositRequest;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.dto.TransferRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    /* =====================================================
       🔹 EXISTING DEPOSIT (KEPT AS-IS)
       ===================================================== */
//    public String deposit(Long accountNumber, DepositRequest request) {
//
//        Account account = accountRepository.findByAccountNumber(accountNumber)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        if (account.getStatus() != AccountStatus.ACTIVE) {
//            return "Account is not active";
//        }
//
//        // Update balance
//        account.setBalance(account.getBalance().add(request.getAmount()));
//        accountRepository.save(account);
//
//        // Record transaction
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        txn.setAmount(request.getAmount());
//        txn.setType(TransactionType.CREDIT);
//        txn.setDescription("Self deposit (UPI)");
//        txn.setTransactionTime(LocalDateTime.now());
//
//        transactionRepository.save(txn);
//
//        return "Deposit successful";
//    }

    /* =====================================================
       🔹 NEW DEPOSIT USING EMAIL (UPI / CARD SIMULATION)
       ===================================================== */
    @Transactional
    public void depositByEmail(String email, DepositRequest request) {

        // 1️⃣ Fetch user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2️⃣ Fetch account
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // 3️⃣ Validate account status
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Account is not active");
        }

        // 4️⃣ Validate UPI / Card details (SIMULATION ONLY)
        validateDepositDetails(request);

        // 5️⃣ Credit balance
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        // 6️⃣ Record transaction
        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setAmount(request.getAmount());
        txn.setType(TransactionType.CREDIT);

        if (request.getMethod() == DepositMethod.UPI) {
            txn.setDescription("Deposit via UPI");
        } else {
            txn.setDescription("Deposit via Debit Card");
        }

        txn.setTransactionTime(LocalDateTime.now());
        transactionRepository.save(txn);
    }

    /* =====================================================
       🔹 VALIDATE UPI / CARD DETAILS (NO REAL PAYMENT)
       ===================================================== */
    private void validateDepositDetails(DepositRequest request) {

        if (request.getMethod() == null) {
            throw new IllegalArgumentException("Deposit method is required");
        }

        if (request.getMethod() == DepositMethod.UPI) {

            if (request.getUpiId() == null ||
                !request.getUpiId().matches("^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$")) {

                throw new IllegalArgumentException("Invalid UPI ID");
            }

        } else if (request.getMethod() == DepositMethod.DEBIT_CARD) {

            if (request.getCardNumber() == null ||
                !request.getCardNumber().matches("\\d{16}")) {

                throw new IllegalArgumentException("Invalid card number");
            }

            if (request.getCvv() == null ||
                !request.getCvv().matches("\\d{3}")) {

                throw new IllegalArgumentException("Invalid CVV");
            }

            if (request.getExpiry() == null ||
                !request.getExpiry().matches("(0[1-9]|1[0-2])/\\d{2}")) {

                throw new IllegalArgumentException("Invalid card expiry");
            }
        }
    }

    /* =====================================================
       🔹 TRANSFER (UNCHANGED)
       ===================================================== */
    @Transactional
    public void transferByEmail(String email, TransferRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account sender = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found"));

        if (sender.getAccountNumber().equals(request.getReceiverAccountNumber())) {
            throw new IllegalArgumentException("Sender and receiver accounts cannot be the same");
        }

        Account receiver = accountRepository.findByAccountNumber(
                request.getReceiverAccountNumber()
        ).orElseThrow(() -> new ResourceNotFoundException("Receiver account not found"));

        if (sender.getStatus() != AccountStatus.ACTIVE ||
            receiver.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Both accounts must be ACTIVE");
        }

        if (sender.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalStateException("Insufficient balance");
        }

        // Debit sender
        sender.setBalance(sender.getBalance().subtract(request.getAmount()));
        accountRepository.save(sender);

        Transaction debitTxn = new Transaction();
        debitTxn.setAccount(sender);
        debitTxn.setAmount(request.getAmount());
        debitTxn.setType(TransactionType.DEBIT);
        debitTxn.setDescription("Transfer to " + receiver.getAccountNumber());
        debitTxn.setTransactionTime(LocalDateTime.now());
        transactionRepository.save(debitTxn);

        // Credit receiver
        receiver.setBalance(receiver.getBalance().add(request.getAmount()));
        accountRepository.save(receiver);

        Transaction creditTxn = new Transaction();
        creditTxn.setAccount(receiver);
        creditTxn.setAmount(request.getAmount());
        creditTxn.setType(TransactionType.CREDIT);
        creditTxn.setDescription("Transfer from " + sender.getAccountNumber());
        creditTxn.setTransactionTime(LocalDateTime.now());
        transactionRepository.save(creditTxn);
    }

    /* =====================================================
       🔹 VIEW TRANSACTIONS BY EMAIL (UNCHANGED)
       ===================================================== */
    public List<TransactionResponse> getTransactionHistoryByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        List<Transaction> transactions =
                transactionRepository.findByAccountOrderByTransactionTimeDesc(account);

        return transactions.stream().map(txn -> {
            TransactionResponse response = new TransactionResponse();
            response.setType(txn.getType());
            response.setAmount(txn.getAmount());
            response.setDescription(txn.getDescription());
            response.setTransactionTime(txn.getTransactionTime());
            return response;
        }).collect(Collectors.toList());
    }
}
