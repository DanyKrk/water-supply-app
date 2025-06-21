package eu.waterlineproject.app.supply.water.model.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@NoRepositoryBean
public interface SpotAwareRepository<T extends SpotAwareEntity> extends MongoRepository<T, UUID> {

    Page<T> findAllBySpotId(Pageable pageable, UUID spotId);

    List<T> findAllBySpotId(UUID spotId);

    Optional<T> findByIdAndSpotId(UUID id, UUID spotId);

    void deleteByIdAndSpotId(UUID id, UUID spotId);

    void deleteAllBySpotId(UUID spotId);

    boolean existsByIdAndSpotId(UUID id, UUID spotId);
}
