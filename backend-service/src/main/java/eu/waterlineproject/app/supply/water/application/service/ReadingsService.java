package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.ReadingsDao;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
public class ReadingsService {

    private final ReadingsDao readingsDao;

    public Page<ReadingEntity> getAllReadings(Pageable pageable, UUID spotId) {
        return readingsDao.findAllBySpotId(pageable, spotId);
    }

    public ReadingEntity getReadingByIdAndSpotId(UUID id, UUID spotId) throws EntityNotFoundException {
        return readingsDao.findByIdAndSpotId(id, spotId).orElseThrow(EntityNotFoundException::new);
    }

    public ReadingEntity addReading(ReadingEntity readingEntity) {
        return readingsDao.save(readingEntity);
    }

    public List<ReadingEntity> addReadings(List<ReadingEntity> readingEntities) {
        return readingsDao.saveAll(readingEntities);
    }

    public ReadingEntity updateReading(UUID id, UUID spotID, List<SingleReadingEntity> updatedEntities) throws EntityNotFoundException {
        Optional<ReadingEntity> optionalReadingEntity = readingsDao.findByIdAndSpotId(id, spotID);
        if (optionalReadingEntity.isPresent()) {
            ReadingEntity readingEntity = optionalReadingEntity.get();

            readingEntity.getReadings().clear();
            readingEntity.getReadings().addAll(updatedEntities);
            return readingsDao.update(id, spotID, readingEntity);
        } else {
            throw new EntityNotFoundException();
        }
    }

    public void deleteReading(UUID id, UUID spotID) {
        readingsDao.deleteByIdAndSpotId(id, spotID);
    }

    public List<ReadingEntity> findByReadingsParameter(UUID spotID, String parameter) {
        return readingsDao.findReadingsWithParameter(spotID, parameter);
    }

    public List<ReadingEntity> findByReadingsParameterAndDateBetween(UUID spotID, String parameter, Date startDate, Date endDate) {
        return readingsDao.findReadingsWithParameterAndDateBetween(spotID, parameter, startDate, endDate);
    }

    public List<ReadingEntity> findDistinctReadingsParameterBySpotId(UUID spotId) {
        return readingsDao.findDistinctReadingsParameterBySpotId(spotId);
    }
}
