package eu.waterlineproject.app.supply.water.model.reading;

import eu.waterlineproject.app.supply.water.model.common.SpotAwareEntityDao;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.*;

@AllArgsConstructor
@Component
public class ReadingsDao implements SpotAwareEntityDao<ReadingEntity> {

    private final ReadingsRepository readingsRepository;

    @Override
    public Page<ReadingEntity> findAllBySpotId(Pageable pageable, UUID spotId) {
        return readingsRepository.findAllBySpotIdOrderByTimestampDesc(spotId, pageable);
    }

    @Override
    public List<ReadingEntity> findAllBySpotId(UUID spotId) {
        return readingsRepository.findAllBySpotId(spotId);
    }

    @Override
    public Optional<ReadingEntity> findByIdAndSpotId(UUID id, UUID spotId) {
        return readingsRepository.findByIdAndSpotId(id, spotId);
    }

    @Override
    public void deleteByIdAndSpotId(UUID id, UUID spotId) {
        readingsRepository.deleteByIdAndSpotId(id, spotId);
    }

    @Override
    public void deleteAllBySpotId(UUID spotId) {
        readingsRepository.deleteAllBySpotId(spotId);
    }

    @Override
    public boolean existsByIdAndSpotId(UUID id, UUID spotId) {
        return readingsRepository.existsByIdAndSpotId(id, spotId);
    }

    @Override
    public ReadingEntity save(ReadingEntity entity) {
        return readingsRepository.save(entity);
    }

    @Override
    public List<ReadingEntity> saveAll(List<ReadingEntity> entities) {
        return readingsRepository.saveAll(entities);
    }

    @Override
    public ReadingEntity update(UUID id, UUID spotID, ReadingEntity updatedReadingEntity) {
        return readingsRepository.save(updatedReadingEntity);
    }

    public List<ReadingEntity> findReadingsWithParameter(UUID spotID, String parameter) {
        return readingsRepository.findBySpotIdAndReadingsParameterOrderByTimestamp(spotID, parameter);
    }

    public List<ReadingEntity> findReadingsWithParameterAndDateBetween(UUID spotID, String parameter, Date startDate, Date endDate) {
        return readingsRepository.findBySpotIdAndReadingsParameterAndTimestampBetweenOrderByTimestamp(spotID, parameter, startDate, endDate);
    }

    public List<ReadingEntity> findDistinctReadingsParameterBySpotId(UUID spotId){
        return readingsRepository.findDistinctReadingsParameterBySpotId(spotId);
    }
}
