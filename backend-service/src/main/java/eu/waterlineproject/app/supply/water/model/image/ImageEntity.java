package eu.waterlineproject.app.supply.water.model.image;

import eu.waterlineproject.app.supply.water.model.common.SpotAwareEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Getter
@Setter
@Document(collection = "images")
public class ImageEntity extends SpotAwareEntity {

    private byte[] image;

    public ImageEntity(@NotNull UUID spotId, byte[] image) {
        super(UUID.randomUUID(), spotId);
        this.image = image;
    }
}
