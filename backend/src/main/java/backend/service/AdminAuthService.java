package backend.service;

import backend.config.JwtService;
import backend.dto.AdminLoginRequest;
import backend.dto.AdminSetupRequest;
import backend.dto.AuthResponse;
import backend.model.Admin;
import backend.repository.AdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminAuthService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public boolean isSetupRequired() {
        return adminRepository.count() == 0;
    }

    public AuthResponse setup(AdminSetupRequest request) {
        if (adminRepository.count() > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Admin account already exists"
            );
        }

        String email = normalizeEmail(request.getEmail());

        Admin admin = new Admin(
                request.getFullName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                "ADMIN",
                true
        );

        Admin savedAdmin = adminRepository.save(admin);
        String token = jwtService.generateToken(savedAdmin);

        return new AuthResponse(
                token,
                savedAdmin.getRole(),
                savedAdmin.getEmail(),
                savedAdmin.getFullName()
        );
    }

    public AuthResponse login(AdminLoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!Boolean.TRUE.equals(admin.getEnabled())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin account is disabled"
            );
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                admin.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        admin.setLastLoginAt(LocalDateTime.now());
        adminRepository.save(admin);

        String token = jwtService.generateToken(admin);

        return new AuthResponse(
                token,
                admin.getRole(),
                admin.getEmail(),
                admin.getFullName()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}