package com.example.demo.dto;

import com.example.demo.model.AccountStatus;
import com.example.demo.model.AccountType;

import java.math.BigDecimal;

public class AccountDetailsResponse {

    private Long accountNumber;
    private String fullName;
    private String phoneNumber;
    private String address;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;

    // getters & setters
    public Long getAccountNumber() { return accountNumber; }
    public void setAccountNumber(Long accountNumber) { this.accountNumber = accountNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }
}
