package eu.waterlineproject.app.supply.water.application.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class AccessTokenResponse {
    private final String token;
    private final String refreshToken;
    private final String type = "Bearer";
    private final UUID id;
    private final String username;
    private final List<String> roles;
}

