package eu.waterlineproject.app.supply.water.application.dto;

import eu.waterlineproject.app.supply.water.model.forms.ParameterType;

import java.util.List;

public record FormDto(String name, List<Parameter> parameters) {
    public record Parameter(String name, ParameterType type) {
    }
}
