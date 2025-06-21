package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.model.user.ERole;
import eu.waterlineproject.app.supply.water.model.user.UserEntity;
import eu.waterlineproject.app.supply.water.application.dto.UserDto;
import eu.waterlineproject.app.supply.water.model.user.UserRepository;
import eu.waterlineproject.app.supply.water.model.user.dto.UserPasswordDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    public UserEntity findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with id: " + id));
    }

    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    }

    public UUID getUserId(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return user.getId();
    }

    public void updateUser(UserDto userDto) throws EntityNotFoundException {
        UserEntity user = userRepository.findById(userDto.id())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.update(userDto);
        userRepository.save(user);
    }

    public UserEntity changePassword(UserPasswordDto userDto) throws EntityNotFoundException {
        UserEntity user = userRepository.findById(userDto.id())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setPassword(encoder.encode(userDto.password()));
        return userRepository.save(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromUserEntity)
                .toList();
    }

    public List<UserDto> getAllByERole(ERole eRole) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getERole() == eRole)
                .map(UserDto::fromUserEntity)
                .toList();
    }

    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }
}
