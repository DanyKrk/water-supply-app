package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.utils.DateUtil;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventEntity;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventRepository;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventType;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class HistoryService {
    public final HistoryEventRepository historyEventRepository;

    public void addHistoryEvent(HistoryEventType type, String userName, Map<String, String> metadata) {
        historyEventRepository.save(new HistoryEventEntity(DateUtil.now(), type, userName, metadata));
    }

    public Page<HistoryEventEntity> getAllHistoryEvents(Pageable pageable) {
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(HistoryEventEntity.TIMESTAMP_MAPPING).descending());
        return historyEventRepository.findAll(pageable);
    }
}
