package com.example.demo.model;

import jakarta.persistence.*;
@Entity
@Table( name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email") )
public class User {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Long userId;
	@Column(nullable = false, unique = true) private String email;
	@Column(nullable = false) private String password;
	@Enumerated(EnumType.STRING) @Column(nullable = false) private Role role; 
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserStatus status;
	public User() {} 
	public User(String email, String password, Role role,UserStatus status)
	{ this.email = email;
	this.password = password;
	this.role = role;
	this.status=status;
	}
	
	public UserStatus getStatus() {
		return status;
	}
	public void setStatus(UserStatus status) {
		this.status = status;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	} 
	
}