package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.request.LoginRequest;
import eu.waterlineproject.app.supply.water.application.request.SignUpRequest;
import eu.waterlineproject.app.supply.water.application.response.AccessTokenResponse;
import eu.waterlineproject.app.supply.water.application.response.MessageResponse;
import eu.waterlineproject.app.supply.water.application.response.RefreshTokenRequest;
import eu.waterlineproject.app.supply.water.application.response.RefreshTokenResponse;
import eu.waterlineproject.app.supply.water.application.service.RefreshTokenService;
import eu.waterlineproject.app.supply.water.application.service.UserService;
import eu.waterlineproject.app.supply.water.model.refreshtoken.RefreshToken;
import eu.waterlineproject.app.supply.water.model.user.*;
import eu.waterlineproject.app.supply.water.security.jwt.JwtUtils;
import eu.waterlineproject.app.supply.water.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RequestMapping("/auth")
@Controller
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateJwtToken(userPrincipal.getUsername());
        String jwtRefresh = jwtUtils.generateRefreshJwtToken(userPrincipal.getUsername());

        refreshTokenService.findByUser(userPrincipal.getUsername())
                .ifPresent(refreshTokenService::delete);
        refreshTokenService.add(jwtRefresh, userPrincipal.getUsername());

        final UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        final List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(new AccessTokenResponse(jwtToken,
                jwtRefresh,
                userDetails.getId(),
                userDetails.getUsername(),
                roles)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        UserEntity user = new UserEntity(
                signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                signUpRequest.getUnit(),
                switch (signUpRequest.getRole()) {
                    case "ROLE_ADMIN" -> ERole.ROLE_ADMIN;
                    case "ROLE_USER" -> ERole.ROLE_USER;
                    default -> throw new IllegalStateException("Unexpected role: " + signUpRequest.getRole());
                });

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.refreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserId)
                .map(userService::findById)
                .map(user -> {
                    String accessToken = jwtUtils.generateJwtToken(user.getUsername());
                    return ResponseEntity.ok(new RefreshTokenResponse(accessToken));
                }).orElseThrow(() -> new RuntimeException(
                        "Refresh token is not in database!"));
    }
}
