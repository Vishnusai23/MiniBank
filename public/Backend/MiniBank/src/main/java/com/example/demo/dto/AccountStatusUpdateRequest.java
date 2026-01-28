package com.example.demo.dto;

import com.example.demo.model.AccountStatus;

public class AccountStatusUpdateRequest {

    private Long accountNumber;
    private AccountStatus status;

    public AccountStatusUpdateRequest() {
    }

    public AccountStatusUpdateRequest(Long accountNumber, AccountStatus status) {
        this.accountNumber = accountNumber;
        this.status = status;
    }

    public Long getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(Long accountNumber) {
        this.accountNumber = accountNumber;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }
}
