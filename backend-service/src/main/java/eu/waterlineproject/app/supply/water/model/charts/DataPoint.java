package eu.waterlineproject.app.supply.water.model.charts;

import lombok.Getter;

public record DataPoint(@Getter long timestamp, @Getter float value) {
}
