package eu.waterlineproject.app.supply.water.model.refreshtoken;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserId(UUID userId);
    void deleteByToken(String token);
    boolean existsByUserId(UUID userId);
}
