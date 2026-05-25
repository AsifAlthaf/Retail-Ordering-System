package com.ordering.retail.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ordering.retail.DTOs.AuthResponseDTO;
import com.ordering.retail.DTOs.LoginRequestDTO;
import com.ordering.retail.DTOs.SignupRequestDTO;
import com.ordering.retail.Entity.User;
import com.ordering.retail.Enum.Role;
import com.ordering.retail.Repository.UserRepository;
import com.ordering.retail.Security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Login user with email and password
     */
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return mapToAuthResponse(user);
    }

    /**
     * Sign up new user
     */
    public AuthResponseDTO signup(SignupRequestDTO request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(buildFullAddress(request));
        user.setRole(Role.USER);
        user.setLoyaltyPoints(0);

        user = userRepository.save(user);
        return mapToAuthResponse(user);
    }

    /**
     * Map User entity to AuthResponseDTO
     */
    private AuthResponseDTO mapToAuthResponse(User user) {
        return new AuthResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                jwtUtil.generateToken(user)
        );
    }

    private String buildFullAddress(SignupRequestDTO request) {
        return String.join(", ",
                request.getAddress().trim(),
                request.getCity().trim(),
                request.getState().trim(),
                request.getPostalCode().trim());
    }
}
