package eu.waterlineproject.app.supply.water.model.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record UserPasswordDto(
    UUID id,
    String username,

    @NotBlank
    @Size(min = 12, message = "Password must be at least 12 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$",
        message = "Password must contain at least one uppercase and lowercase letter, a digit, and a special character"
    )
    String password
) {}