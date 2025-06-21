package eu.waterlineproject.app.supply.water.application.history;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.service.HistoryService;
import eu.waterlineproject.app.supply.water.application.service.ReadingsService;
import eu.waterlineproject.app.supply.water.application.service.SpotService;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import eu.waterlineproject.app.supply.water.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.OffsetDateTime;
import java.util.*;

@Slf4j
@Aspect
@Component
@AllArgsConstructor
public class HistoryAspect {

    private final HistoryService historyService;

    private final SpotService spotService;

    private final ReadingsService readingsService;

    private final JwtUtils jwtUtils;

    @Around("@annotation(HistoryEvent)")
    public Object logHistoryEvent(ProceedingJoinPoint joinPoint) throws Throwable {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();

        Map<String, Object> parameters = new HashMap<>();
        for (int i = 0; i < method.getParameters().length; i++) {
            parameters.put(method.getParameters()[i].getName(), joinPoint.getArgs()[i]);
        }

        HistoryEventType type = method.getAnnotation(HistoryEvent.class).type();
        String userName = getUserName(parameters);
        Map<String, String> metadata = parseParameters(parameters, type);

        Object proceed =  joinPoint.proceed();
        if ((ResponseEntity.class.isAssignableFrom(method.getReturnType()) && ((ResponseEntity<?>) proceed).getStatusCode().is2xxSuccessful())) {
            historyService.addHistoryEvent(type, userName, metadata);
        }
        return proceed;
    }

    private String getUserName(Map<String, Object> parameters) {
        return Optional.ofNullable(parameters.get("token"))
                .map(Object::toString)
                .map(username -> username.replace("Bearer ", ""))
                .map(jwtUtils::extractUsername)
                .orElse("Unknown user");
    }

    private Map<String, String> parseParameters(Map<String, Object> parameters, HistoryEventType type) throws EntityNotFoundException {
        Optional<UUID> spotID = Optional.ofNullable(parameters.get("spotID"))
                .map(Object::toString)
                .map(UUID::fromString);
        if (spotID.isPresent()) {
            SpotEntity spot = spotService.getSpotById(spotID.get());
            parameters.put("spotName", spot.getName());

            if ((parameters.get("readingId") != null) && (type == HistoryEventType.UPDATE_READING || type == HistoryEventType.DELETE_READING)) {
                UUID readingId = UUID.fromString(parameters.get("readingId").toString());
                try {
                    ReadingEntity reading = readingsService.getReadingByIdAndSpotId(readingId, spotID.get());
                    parameters.put("entities", reading.getReadings());
                    parameters.put("originalDateTime",
                            OffsetDateTime.ofInstant(reading.getTimestamp().toInstant(), OffsetDateTime.now().getOffset()).toString());
                } catch (EntityNotFoundException e) {
                    log.warn("Could not find reading with id {} for spot {}", readingId, spotID.get());
                }
            }
        }

        ObjectMapper objectMapper = new ObjectMapper();
        return parameters.entrySet().stream()
                .filter(entry -> !entry.getKey().equals("token"))
                .collect(HashMap::new, (m, v) -> {
                            try {
                                m.put(v.getKey(), objectMapper.writeValueAsString(v.getValue()));
                            } catch (JsonProcessingException e) {
                                m.put(v.getKey(), v.getValue().toString());
                                log.warn("Could not serialize parameter {} of type {} to JSON", v.getKey(), v.getValue().getClass().getName());
                            }
                        },
                        HashMap::putAll);
    }
}
