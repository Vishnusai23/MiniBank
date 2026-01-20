package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

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

    // ✅ REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);
        return "User registered successfully";
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

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }


}
