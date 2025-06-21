package eu.waterlineproject.app.supply.water.model.reading;

import eu.waterlineproject.app.supply.water.model.common.SpotAwareRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
interface ReadingsRepository extends SpotAwareRepository<ReadingEntity> {

    Page<ReadingEntity> findAllBySpotIdOrderByTimestampDesc(UUID spotId, Pageable pageable);

    List<ReadingEntity> findBySpotIdAndReadingsParameterOrderByTimestamp(UUID spotId, String parameter);

    List<ReadingEntity> findBySpotIdAndReadingsParameterAndTimestampBetweenOrderByTimestamp(
            UUID spotId, String readings_parameter, Date startDate, Date endDate
    );

    List<ReadingEntity> findDistinctReadingsParameterBySpotId(UUID spotId);
}
