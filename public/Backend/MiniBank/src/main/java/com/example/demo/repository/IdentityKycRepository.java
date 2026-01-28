package com.example.demo.repository;

import com.example.demo.model.IdentityKyc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdentityKycRepository extends JpaRepository<IdentityKyc, Long> {

    Optional<IdentityKyc> findByIdentityTypeAndIdentityNumber(
            String identityType,
            String identityNumber
    );
}
