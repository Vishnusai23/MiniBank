package com.example.demo.dto;

import com.example.demo.model.AccountType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class AccountCreateRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Phone number must be a valid 10-digit Indian number"
    )
    private String phoneNumber;

    @NotBlank(message = "PAN number is required")
    @Pattern(
        regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
        message = "PAN must be in format ABCDE1234F"
    )
    private String panNumber;

    @NotBlank(message = "Aadhaar number is required")
    @Pattern(
        regexp = "^[0-9]{12}$",
        message = "Aadhaar number must be exactly 12 digits"
    )
    private String aadhaarNumber;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 200, message = "Address must be between 10 and 200 characters")
    private String address;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    // Getters & Setters

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }
}
