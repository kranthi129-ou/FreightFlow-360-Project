package backend.dto;

public class AuthResponse {

    private String token;
    private String role;
    private String email;
    private String fullName;

    public AuthResponse(String token, String role, String email, String fullName) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.fullName = fullName;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}