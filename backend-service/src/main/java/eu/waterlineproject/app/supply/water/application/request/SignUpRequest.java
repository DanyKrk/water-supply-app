package eu.waterlineproject.app.supply.water.application.request;

import jakarta.validation.constraints.NotBlank;
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
    private String password;

    private String name;

    private String email;

    private String unit;
}
