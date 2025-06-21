package eu.waterlineproject.app.supply.water.application.dto;

import eu.waterlineproject.app.supply.water.model.user.ERole;
import eu.waterlineproject.app.supply.water.model.user.UserEntity;

import java.util.List;
import java.util.UUID;

public record UserDto(UUID id,
                      String username,
                      String name,
                      String email,
                      String unit,
                      ERole role) {

    public static UserDto fromUserEntity(UserEntity userEntity) {
        return new UserDto(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getName(),
                userEntity.getEmail(),
                userEntity.getUnit(),
                userEntity.getERole()
        );
    }
}
