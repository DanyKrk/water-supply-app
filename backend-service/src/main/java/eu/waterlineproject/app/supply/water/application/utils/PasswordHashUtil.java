package eu.waterlineproject.app.supply.water.application.utils;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordHashUtil {
    /**
     * Length of salt. Minimum recommended is 16
     **/
    private static final int SALT_LENGTH = 16;
    private static final int HASH_LENGTH = 32;
    /**
     *  Degree of parallelism.Minimum recommended is 1.
     */
    private static final int PARALLELISM_DEGREE = 1;
    /**
     * Minimum memory size of 19 MiB. Minimum recommended is 19 MiB.
     **/
    private static final int MINIMUM_MEMORY_SIZE = 19 * 1024;
    /**
     * Iteration count. Minimum recommended is 2.
     **/
    private static final int ITERATIONS = 2;
    public static final Argon2PasswordEncoder arg2SpringSecurity = new Argon2PasswordEncoder(
            SALT_LENGTH,
            HASH_LENGTH,
            PARALLELISM_DEGREE,
            MINIMUM_MEMORY_SIZE,
            ITERATIONS);


    // For manual user creating 
    public static String generateHash(String password) {
        return arg2SpringSecurity.encode(password);
    }
}
