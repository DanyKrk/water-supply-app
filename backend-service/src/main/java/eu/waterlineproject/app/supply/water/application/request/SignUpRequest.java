package eu.waterlineproject.app.supply.water.application.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class SignUpRequest {

    @NotBlank
    private String username;

    private String role;

    @NotBlank
    @Size(min = 12, message = "Hasło musi mieć co najmniej 12 znaków")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$",
        message = "Hasło musi zawierać co najmniej jedną wielką i małą literę, cyfrę oraz znak specjalny"
    )
    String password;

    private String name;

    private String email;

    private String unit;
}
