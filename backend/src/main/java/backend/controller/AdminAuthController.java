package backend.controller;

import backend.dto.AdminLoginRequest;
import backend.dto.AdminSetupRequest;
import backend.dto.AuthResponse;
import backend.dto.SetupStatusResponse;
import backend.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @GetMapping("/setup-status")
    public SetupStatusResponse setupStatus() {
        return new SetupStatusResponse(adminAuthService.isSetupRequired());
    }

    @PostMapping("/setup")
    public AuthResponse setup(@Valid @RequestBody AdminSetupRequest request) {
        return adminAuthService.setup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AdminLoginRequest request) {
        return adminAuthService.login(request);
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        return Map.of(
                "email", authentication.getName(),
                "authenticated", authentication.isAuthenticated(),
                "authorities", authentication.getAuthorities()
        );
    }
}