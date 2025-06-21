package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.service.HistoryService;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventEntity;
import lombok.AllArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@AllArgsConstructor
@RestController
@RequestMapping("/history")
public class HistoryController {
    private final HistoryService historyService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<HistoryEventEntity> getHistory(@ParameterObject Pageable pageable) {
        return historyService.getAllHistoryEvents(pageable);
    }
}
