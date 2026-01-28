package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.EmailOtp;
import com.example.demo.model.IdentityKyc;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.EmailOtpRepository;
import com.example.demo.repository.IdentityKycRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.util.OtpUtil;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailOtpRepository emailOtpRepository;

    @Autowired
    private EmailService emailService;

   
    
    @Autowired
    private IdentityKycRepository identityKycRepository;
    
    

 // ✅ REGISTER
    public String register(RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(UserStatus.PENDING_VERIFICATION);

        userRepository.save(user);

        // 🔐 Generate OTP
        String otp = OtpUtil.generateOtp();

        // 💾 Save OTP
        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(user.getEmail());
        emailOtp.setOtp(otp);
        emailOtp.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        emailOtp.setVerified(false);
        emailOtpRepository.save(emailOtp);

        // 📧 SEND EMAIL (THIS IS THE CALL YOU ASKED ABOUT)
        emailService.sendOtp(user.getEmail(), otp);

        return "OTP sent to email. Please verify.";
    }



    // ✅ LOGIN (RETURNS JWT)
// public String login(LoginRequest request) {
//
//    String username = request.getEmail().trim();
//    String password = request.getPassword().trim();
//
//    // 🔐 ADMIN LOGIN (HARDCODED)
//    if (username.equals("admin") && password.equals("admin123")) {
//        return jwtUtil.generateToken("admin");
//    }
//
//    // 👤 USER LOGIN (DATABASE)
//    User user = userRepository.findByEmail(username).orElse(null);
//
//    if (user == null) {
//        return "User not found";
//    }
//
//    if (!passwordEncoder.matches(password, user.getPassword())) {
//        return "Invalid password";
//    }
//
//    return jwtUtil.generateToken(user.getEmail());
//}
    public String login(LoginRequest request) {

        String username = request.getEmail().trim();
        String password = request.getPassword().trim();

        // 🔐 ADMIN LOGIN (HARDCODED)
        if ("admin".equals(username)) {

            if (!"admin123".equals(password)) {
                throw new RuntimeException("Invalid admin credentials");
            }

            return jwtUtil.generateToken("admin");
        }

        // 👤 USER LOGIN (DATABASE)
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🚫 EMAIL VERIFICATION CHECK (THIS IS THE KEY LINE)
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Please verify your email before login");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
    public String verifyEmailOtp(String email, String otp) {

        // 1️⃣ Find OTP that is not already used
        EmailOtp emailOtp = emailOtpRepository
                .findByEmailAndOtpAndVerifiedFalse(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        // 2️⃣ Check expiry
        if (emailOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        // 3️⃣ Mark OTP as used
        emailOtp.setVerified(true);
        emailOtpRepository.save(emailOtp);

        // 4️⃣ Activate user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        return "Email verified successfully. Please login.";
    }
    public String resendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new RuntimeException("Email already verified");
        }

        // generate new OTP
        String otp = OtpUtil.generateOtp();

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        emailOtp.setVerified(false);

        emailOtpRepository.save(emailOtp);

        emailService.sendOtp(email, otp);

        return "New OTP sent to your email";
    }




}
