package eu.waterlineproject.app.supply.water.model.image;

import eu.waterlineproject.app.supply.water.model.common.SpotAwareRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
interface ImageRepository extends SpotAwareRepository<ImageEntity> {
    List<ImageEntity> findAllBySpotId(UUID spotId);
}