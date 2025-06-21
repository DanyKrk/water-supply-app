package eu.waterlineproject.app.supply.water.model.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.UUID;

@AllArgsConstructor
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PROTECTED)
public abstract class SpotAwareEntity {

    @Id
    @Setter(AccessLevel.PRIVATE)
    @JsonProperty
    private UUID id;

    @Indexed
    private UUID spotId;

}
