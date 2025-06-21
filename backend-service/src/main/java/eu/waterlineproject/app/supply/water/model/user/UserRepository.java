package eu.waterlineproject.app.supply.water.model.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUsername(String username);
    Boolean existsByUsername(String username);

}
