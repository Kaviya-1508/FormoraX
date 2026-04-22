package com.example.formoraxbackend.service;

import com.example.formoraxbackend.dto.AuthResponse;
import com.example.formoraxbackend.dto.LoginRequest;
import com.example.formoraxbackend.dto.SignupRequest;
import com.example.formoraxbackend.model.User;
import com.example.formoraxbackend.repository.UserRepository;
import com.example.formoraxbackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(saved.getEmail())
                .name(saved.getName())
                .userId(saved.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .userId(user.getId())
                .build();
    }
}