package eu.waterlineproject.app.supply.water.model.spot;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.*;

@Getter
@Setter
@Document(collection = "spots")
public class SpotEntity {

    @Setter(AccessLevel.NONE)
    @Id
    private UUID id;

    @Indexed(unique = true)
    private String name;

    private LocalDate foundationDate;

    private String type;

    private String address;

    private GeoJsonPoint location;

    private String description;

    private List<UUID> selectedFormIds;

    @Setter(AccessLevel.NONE)
    private Map<String, String> additionalInfo;

    public SpotEntity(String name,
                      LocalDate foundationDate,
                      String type,
                      String address,
                      GeoJsonPoint location,
                      String description,
                      Map<String, String> additionalInfo) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.foundationDate = foundationDate;
        this.type = type;
        this.address = address;
        this.location = location;
        this.description = description;
        this.additionalInfo = additionalInfo;
    }

    public void addAdditionalInfo(String key, String value) {
        this.additionalInfo.put(key, value);
    }

    public void removeAdditionalInfo(String key) {
        this.additionalInfo.remove(key);
    }

    public void clearAdditionalInfo() {
        this.additionalInfo.clear();
    }
}
