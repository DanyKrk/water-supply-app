package eu.waterlineproject.app.supply.water.model.common;

import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpotAwareEntityDao<T extends SpotAwareEntity> {

    Page<T> findAllBySpotId(Pageable pageable, UUID spotId);

    List<T> findAllBySpotId(UUID spotId);

    Optional<T> findByIdAndSpotId(UUID id, UUID spotId);

    void deleteByIdAndSpotId(UUID id, UUID spotId);

    void deleteAllBySpotId(UUID spotId);

    boolean existsByIdAndSpotId(UUID id, UUID spotId);

    T save(T entity);

    List<T> saveAll(List<T> entities);

    T update(UUID id, UUID spotId, T entity) throws EntityNotFoundException;
}
