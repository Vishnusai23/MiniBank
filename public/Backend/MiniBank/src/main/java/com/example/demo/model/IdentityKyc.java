package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "identity_kyc")
public class IdentityKyc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identity_type", nullable = false)
    private String identityType;   // PASSPORT / AADHAAR

    @Column(name = "identity_number", nullable = false, unique = true)
    private String identityNumber;

    @Column(name = "country_code", nullable = false, length = 3)
    private String countryCode;    // IN, US, PK, etc.

    @Column(name = "address")
    private String address;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getIdentityType() {
        return identityType;
    }

    public void setIdentityType(String identityType) {
        this.identityType = identityType;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setIdentityNumber(String identityNumber) {
		this.identityNumber = identityNumber;
	}
    
}