package eu.waterlineproject.app.supply.water.model.forms;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Document(collection = "forms")
public class FormEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @JsonProperty
    private UUID id;

    @Indexed(unique = true)
    private String name;

    @JsonManagedReference
    private List<Parameter> parameters;

    public FormEntity(String name,
                      List<Parameter> parameters) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.parameters = parameters;
    }

    public record Parameter(@JsonProperty String name, @JsonProperty ParameterType type) {

    }
}
