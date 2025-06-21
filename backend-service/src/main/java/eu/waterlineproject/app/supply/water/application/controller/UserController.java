package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.dto.UserDto;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.service.UserService;
import eu.waterlineproject.app.supply.water.model.user.ERole;
import eu.waterlineproject.app.supply.water.model.user.UserEntity;
import eu.waterlineproject.app.supply.water.model.user.dto.UserPasswordDto;
import eu.waterlineproject.app.supply.water.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") UUID id,
                                               HttpServletRequest request) {
        final String token = jwtUtils.parseJwt(request);
        final String username = jwtUtils.extractUsername(token);
        final UserEntity requestingUser = userService.findByUsername(username);
        final UserEntity requestedUser = userService.findById(id);

        if (requestingUser == null || requestedUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (requestingUser.getERole() == ERole.ROLE_USER && !requestedUser.equals(requestingUser)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(UserDto.fromUserEntity(requestedUser), HttpStatus.OK);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@RequestBody UserDto userDto) {
        try {
            final List<UserDto> admins = userService.getAllByERole(ERole.ROLE_ADMIN);
            if(admins.size() == 1 && admins.get(0).id().equals(userDto.id()) && userDto.role() == ERole.ROLE_USER) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            userService.updateUser(userDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updatePassword")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> updatePassword(@RequestBody UserPasswordDto userDto,
                                               HttpServletRequest request) {
        final String token = jwtUtils.parseJwt(request);
        final String username = jwtUtils.extractUsername(token);
        if (!Objects.equals(userDto.username(), username)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        try {
            UserDto.fromUserEntity(userService.changePassword(userDto));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        final List<UserDto> admins = userService.getAllByERole(ERole.ROLE_ADMIN);
        if(admins.size() == 1 && admins.get(0).id().equals(id)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
