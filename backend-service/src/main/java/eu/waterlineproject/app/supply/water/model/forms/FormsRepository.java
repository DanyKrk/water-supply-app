package eu.waterlineproject.app.supply.water.model.forms;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FormsRepository extends MongoRepository<FormEntity, UUID> {
}
