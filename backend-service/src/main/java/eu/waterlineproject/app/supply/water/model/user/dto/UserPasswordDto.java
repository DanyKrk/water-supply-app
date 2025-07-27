package eu.waterlineproject.app.supply.water.model.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record UserPasswordDto(
    UUID id,
    String username,

    @NotBlank
    @Size(min = 12, message = "Nowe hasło musi mieć co najmniej 12 znaków")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$",
        message = "Hasło musi zawierać co najmniej jedną wielką i małą literę, cyfrę oraz znak specjalny"
    )
    String password
) {}