package eu.waterlineproject.app.supply.water.application.exception;

import org.springframework.security.core.AuthenticationException;

public class TokenInvalidatedException extends AuthenticationException {
    public TokenInvalidatedException(String msg) {
        super(msg);
    }
}