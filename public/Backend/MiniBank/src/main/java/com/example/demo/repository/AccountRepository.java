package com.example.demo.repository;

import com.example.demo.model.Account;
import com.example.demo.model.AccountStatus;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByUser(User user);

    Optional<Account> findByUser(User user);

    Optional<Account> findByAccountNumber(Long accountNumber);
    List<Account> findByStatus(AccountStatus status);

}
