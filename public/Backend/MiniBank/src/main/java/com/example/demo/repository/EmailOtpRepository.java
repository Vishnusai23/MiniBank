package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.EmailOtp;



public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findByEmailAndOtpAndVerifiedFalse(String email, String otp);

    Optional<EmailOtp> findTopByEmailOrderByExpiryTimeDesc(String email);
}

