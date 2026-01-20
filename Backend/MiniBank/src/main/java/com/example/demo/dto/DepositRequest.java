package com.example.demo.dto;

import com.example.demo.model.DepositMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DepositRequest {

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "1.0", message = "Deposit amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Deposit method is required")
    private DepositMethod method;

    // UPI (only when method = UPI)
    private String upiId;

    // Card (only when method = DEBIT_CARD)
    private String cardNumber;
    private String expiry;
    private String cvv;

    // ✅ GETTERS & SETTERS (REQUIRED)

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public DepositMethod getMethod() {
        return method;
    }

    public void setMethod(DepositMethod method) {
        this.method = method;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpiry() {
        return expiry;
    }

    public void setExpiry(String expiry) {
        this.expiry = expiry;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}
