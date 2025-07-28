package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.BaseIT;
import eu.waterlineproject.app.supply.water.application.request.LoginRequest;
import eu.waterlineproject.app.supply.water.application.service.RefreshTokenService;
import eu.waterlineproject.app.supply.water.application.service.UserService;
import eu.waterlineproject.app.supply.water.application.utils.PasswordHashUtil;
import eu.waterlineproject.app.supply.water.model.refreshtoken.RefreshTokenRepository;
import eu.waterlineproject.app.supply.water.model.user.ERole;
import eu.waterlineproject.app.supply.water.model.user.UserEntity;
import eu.waterlineproject.app.supply.water.model.user.UserRepository;
import eu.waterlineproject.app.supply.water.security.jwt.JwtDenylistService;
import eu.waterlineproject.app.supply.water.security.jwt.JwtUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.reactive.server.WebTestClient;

public abstract class ControllerBaseIT extends BaseIT {

    public static final String USERNAME = "user";

    public static final String PASSWORD = "password";
    public static final String NAME = "name";
    public static final String EMAIL = "email";
    public static final String UNIT = "unit";

    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    JwtDenylistService jwtDenylistService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    AuthController authController;

    String jwtToken;

    @BeforeEach
    public void setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:" + port).build();
        
        authController = new AuthController(authenticationManager, userRepository, userService, encoder, jwtUtils, refreshTokenService, jwtDenylistService);

        UserEntity user = new UserEntity(
                USERNAME,
                PasswordHashUtil.generateHash(PASSWORD),
                NAME,
                EMAIL,
                UNIT,
                ERole.ROLE_ADMIN
        );
        userRepository.save(user);

        jwtToken = authController.authenticateUser(new LoginRequest(USERNAME, PASSWORD)).getBody().getToken();
    }

    @AfterEach
    public void afterEach() {
        userRepository.deleteAll();
        refreshTokenRepository.deleteAll();
    }
}