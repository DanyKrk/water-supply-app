package eu.waterlineproject.app.supply.water.model.refreshtoken;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Document(collection = "tokens")
public class RefreshToken {
    private UUID id;

    @Indexed(unique = true)
    private UUID userId;

    private String token;

    private Instant expiryDate;
    public RefreshToken(@NotNull UUID userId, String token, Instant expiryDate) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.token = token;
        this.expiryDate = expiryDate;
    }
}
