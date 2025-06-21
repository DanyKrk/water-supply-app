package eu.waterlineproject.app.supply.water.model.spot;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SpotRepository extends MongoRepository<SpotEntity, UUID> {
}
