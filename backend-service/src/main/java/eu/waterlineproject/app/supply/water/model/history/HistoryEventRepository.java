package eu.waterlineproject.app.supply.water.model.history;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HistoryEventRepository extends MongoRepository<HistoryEventEntity, UUID> {
}
