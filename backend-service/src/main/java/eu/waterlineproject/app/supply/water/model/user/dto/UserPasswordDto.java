package eu.waterlineproject.app.supply.water.model.user.dto;

import java.util.UUID;

public record UserPasswordDto(UUID id,
                              String username,
                              String password) {
}