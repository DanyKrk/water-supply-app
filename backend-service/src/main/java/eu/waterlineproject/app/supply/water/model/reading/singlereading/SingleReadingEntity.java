package eu.waterlineproject.app.supply.water.model.reading.singlereading;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;

public record SingleReadingEntity(@JsonProperty String parameter,
                                  @JsonProperty String parameterValue,
                                  @JsonProperty ParameterType parameterType) {
}
