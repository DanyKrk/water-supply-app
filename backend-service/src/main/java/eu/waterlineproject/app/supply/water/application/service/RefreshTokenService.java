package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.model.refreshtoken.RefreshToken;
import eu.waterlineproject.app.supply.water.model.refreshtoken.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Transactional
public class RefreshTokenService {
    @Value("${wsa.app.jwtRefreshExpirationMs}")
    private int jwtRefreshExpirationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;


    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public Optional<RefreshToken> findByUser(String username) {
        UUID userId = userService.findByUsername(username).getId();
        return refreshTokenRepository.findByUserId(userId);
    }

    public void delete(RefreshToken refreshToken) {
        refreshTokenRepository.delete(refreshToken);
    }

    public RefreshToken add(String token, String username) {
        UUID userId = userService.findByUsername(username).getId();
        RefreshToken refreshToken = new RefreshToken(
                userId,
                token,
                Instant.now().plusMillis(jwtRefreshExpirationMs)
        );
        return refreshTokenRepository.save(refreshToken);
    }
}
