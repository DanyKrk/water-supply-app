package eu.waterlineproject.app.supply.water.model.user;


import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.waterlineproject.app.supply.water.application.dto.UserDto;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Document(collection = "users")
public class UserEntity {

    @Setter(AccessLevel.NONE)
    @Id
    private UUID id;

    @Indexed(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    private String name;

    private String email;

    private String unit;

    private ERole eRole;

    public UserEntity(String username,
                      String password,
                      String name,
                      String email,
                      String unit,
                      ERole eRole) {
        this.id = UUID.randomUUID();
        this.username = username;
        this.name = name;
        this.email = email;
        this.unit = unit;
        this.password = password;
        this.eRole = eRole;
    }

    public void update(UserDto updatedUser) {
        this.username = updatedUser.username();
        this.name = updatedUser.name();
        this.email = updatedUser.email();
        this.unit = updatedUser.unit();
        this.eRole = updatedUser.role();
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof UserEntity that)) return false;
        return Objects.equals(id, that.id)
                && Objects.equals(username, that.username)
                && Objects.equals(password, that.password)
                && Objects.equals(name, that.name)
                && Objects.equals(email, that.email)
                && Objects.equals(unit, that.unit)
                && eRole == that.eRole;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, name, email, unit, eRole);
    }
}
