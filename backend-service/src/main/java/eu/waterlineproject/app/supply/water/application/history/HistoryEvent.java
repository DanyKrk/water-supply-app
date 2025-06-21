package eu.waterlineproject.app.supply.water.application.history;

import eu.waterlineproject.app.supply.water.model.history.HistoryEventType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface HistoryEvent {
    HistoryEventType type() default HistoryEventType.OTHER;
}
