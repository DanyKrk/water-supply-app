package eu.waterlineproject.app.supply.water.application.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DuplicateEntityException extends RuntimeException {
    public DuplicateEntityException(String message) {
        super(message);
    }
}
