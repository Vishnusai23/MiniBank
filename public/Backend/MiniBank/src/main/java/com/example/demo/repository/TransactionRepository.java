package com.example.demo.repository;

import com.example.demo.model.Account;
import com.example.demo.model.Transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByAccountOrderByTransactionTimeDesc(Account account);
}
