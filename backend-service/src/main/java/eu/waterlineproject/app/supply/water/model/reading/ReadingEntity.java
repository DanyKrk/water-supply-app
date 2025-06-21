package eu.waterlineproject.app.supply.water.model.reading;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import eu.waterlineproject.app.supply.water.model.common.SpotAwareEntity;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Document(collection = "readings")
public class ReadingEntity extends SpotAwareEntity {

    private final Date timestamp;

    @JsonManagedReference
    private List<SingleReadingEntity> readings;

    @PersistenceCreator
    public ReadingEntity(@NotNull UUID spotId, Date timestamp, List<SingleReadingEntity> readings) {
        super(UUID.randomUUID(), spotId);
        this.timestamp = timestamp;
        this.readings = readings;
    }

    public void addSingleReading(SingleReadingEntity reading) {
        this.readings.add(reading);
    }
}
