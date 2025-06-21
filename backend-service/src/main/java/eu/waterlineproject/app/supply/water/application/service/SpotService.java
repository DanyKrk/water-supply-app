package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.dto.CreateSpotDto;
import eu.waterlineproject.app.supply.water.application.exception.DuplicateEntityException;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import eu.waterlineproject.app.supply.water.model.spot.SpotRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class SpotService {

    private final SpotRepository spotRepository;

    public Page<SpotEntity> getAllSpots(Pageable pageable) {
        return spotRepository.findAll(pageable);
    }

    public SpotEntity addSpot(CreateSpotDto spot) throws DuplicateEntityException{
        try {
            return spotRepository.save(
                    new SpotEntity(
                            spot.name(),
                            spot.foundationDate(),
                            spot.type(),
                            spot.address(),
                            new GeoJsonPoint(spot.longitude(), spot.latitude()),
                            spot.description(),
                            spot.additionalInfo()
                    )
            );
        } catch (DataIntegrityViolationException e) {
            if (e.getCause() instanceof com.mongodb.MongoWriteException) {
                throw new DuplicateEntityException("Spot for given name already exists");
            } else {
                throw e;
            }
        }
    }

    public SpotEntity getSpotById(UUID id) throws EntityNotFoundException {
        return spotRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public void updateSpot(UUID id, CreateSpotDto spot) throws EntityNotFoundException {
        SpotEntity spotEntity = spotRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        spotEntity.setName(spot.name());
        spotEntity.setFoundationDate(spot.foundationDate());
        spotEntity.setType(spot.type());
        spotEntity.setAddress(spot.address());
        spotEntity.setLocation(new GeoJsonPoint(spot.longitude(), spot.latitude()));
        spotEntity.setDescription(spot.description());
        spotEntity.setSelectedFormIds(spot.selectedFormIds());
        spotEntity.clearAdditionalInfo();
        spot.additionalInfo().forEach(spotEntity::addAdditionalInfo);
        spotRepository.save(spotEntity);
    }

    public void deleteSpot(UUID id) {
        spotRepository.deleteById(id);
    }

    public void addInfoToSpot(UUID id, String key, String value) throws EntityNotFoundException {
        SpotEntity spotEntity = getSpotById(id);
        spotEntity.addAdditionalInfo(key, value);
        spotRepository.save(spotEntity);
    }

    public void removeInfoFromSpot(UUID id, String key) throws EntityNotFoundException {
        SpotEntity spotEntity = getSpotById(id);
        spotEntity.removeAdditionalInfo(key);
        spotRepository.save(spotEntity);
    }

    public long getSpotsCount() {
        return spotRepository.count();
    }
}
