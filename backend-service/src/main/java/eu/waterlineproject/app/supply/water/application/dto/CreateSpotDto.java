package eu.waterlineproject.app.supply.water.application.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record CreateSpotDto(
        String name,
        LocalDate foundationDate,
        String type,
        String address,
        Double longitude,
        Double latitude,
        String description,
        List<UUID> selectedFormIds,
        Map<String, String> additionalInfo) {
}
