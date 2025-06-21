package eu.waterlineproject.app.supply.water.model.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Getter
@Document(collection = "changes_history")
public final class HistoryEventEntity {

    public static final String TIMESTAMP_MAPPING = "timestamp";

    @Id
    private UUID id;

    private final Date timestamp;

    private final HistoryEventType type;

    private final String userName;

    private final Map<String, String> metadata;

    private HistoryEventEntity(UUID id, Date timestamp, HistoryEventType type, String userName, Map<String, String> metadata) {
        this.id = id;
        this.timestamp = timestamp;
        this.type = type;
        this.userName = userName;
        this.metadata = metadata;
    }

    @PersistenceCreator
    public HistoryEventEntity(Date timestamp, HistoryEventType type, String userName, @JsonProperty("metadata") Map<String, String> metadata) {
        this(UUID.randomUUID(), timestamp, type, userName, metadata);
    }
}
