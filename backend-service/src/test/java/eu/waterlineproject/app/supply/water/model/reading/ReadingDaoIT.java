package eu.waterlineproject.app.supply.water.model.reading;

import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.BaseIT;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReadingDaoIT extends BaseIT {

    private final UUID SPOT_ID_1 = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UUID SPOT_ID_2 = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Autowired
    private ReadingsRepository readingsRepository;

    private ReadingsDao readingsDao;

    @BeforeEach
    public void initialize() {
        readingsDao = new ReadingsDao(readingsRepository);
    }

    @Test
    void canFindAllBySpotId() {
        // given
        readingsDao.save(new ReadingEntity(SPOT_ID_1, null, List.of(new SingleReadingEntity("temperature", "20", ParameterType.NUMBER))));
        readingsDao.save(new ReadingEntity(SPOT_ID_2, null, List.of(new SingleReadingEntity("temperature", "21", ParameterType.NUMBER))));

        // when
        List<ReadingEntity> results = readingsDao.findAllBySpotId(SPOT_ID_1);

        // then
        assertEquals(1, results.size());
        assertEquals(SPOT_ID_1, results.get(0).getSpotId());
        assertEquals("temperature", results.get(0).getReadings().get(0).parameter());
        assertEquals("20", results.get(0).getReadings().get(0).parameterValue());
    }

    @Test
    void canFindByIdAndSpotId() {
        // given
        UUID readingId = readingsDao.save(new ReadingEntity(SPOT_ID_1, null, List.of(new SingleReadingEntity("temperature", "20", ParameterType.NUMBER)))).getId();
        readingsDao.save(new ReadingEntity(SPOT_ID_2, null, List.of(new SingleReadingEntity("temperature", "21", ParameterType.NUMBER))));
        readingsDao.save(new ReadingEntity(SPOT_ID_1, null, List.of(new SingleReadingEntity("temperature", "22", ParameterType.NUMBER))));
        readingsDao.save(new ReadingEntity(SPOT_ID_2, null, List.of(new SingleReadingEntity("temperature", "23", ParameterType.NUMBER))));

        // when
        Optional<ReadingEntity> result = readingsDao.findByIdAndSpotId(readingId, SPOT_ID_1);

        // then
        assertTrue(result.isPresent());
        assertEquals(SPOT_ID_1, result.get().getSpotId());
        assertEquals(readingId, result.get().getId());
    }

    @Test
    void canUpdateReading() throws EntityNotFoundException {
        // given
        UUID readingId = readingsDao.save(new ReadingEntity(SPOT_ID_1, null, List.of(new SingleReadingEntity("temperature", "20", ParameterType.NUMBER)))).getId();
        ReadingEntity reading = readingsDao.findByIdAndSpotId(readingId, SPOT_ID_1).orElseThrow();
        reading.addSingleReading(new SingleReadingEntity("temperature", "21", ParameterType.NUMBER));
        reading.addSingleReading(new SingleReadingEntity("temperature", "22", ParameterType.NUMBER));
        reading.addSingleReading(new SingleReadingEntity("temperature", "23", ParameterType.NUMBER));

        // when
        readingsDao.update(readingId, SPOT_ID_1, reading);

        // then
        Optional<ReadingEntity> result = readingsDao.findByIdAndSpotId(readingId, SPOT_ID_1);
        assertTrue(result.isPresent());
        assertEquals(4, result.get().getReadings().size());
    }
}
