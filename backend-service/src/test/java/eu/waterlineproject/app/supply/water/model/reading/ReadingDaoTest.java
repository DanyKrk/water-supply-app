package eu.waterlineproject.app.supply.water.model.reading;

import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class ReadingDaoTest {

    private final UUID SPOT_ID_1 = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UUID SPOT_ID_2 = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @MockBean
    private ReadingsRepository readingsRepository;

    @Autowired
    private ReadingsDao readingsDao;

    @Test
    void daoProxiesRepository() {
        // given
        List<ReadingEntity> allReadings = List.of(
                new ReadingEntity(SPOT_ID_1, new Date(), List.of(new SingleReadingEntity("temperature", "20", ParameterType.NUMBER))),
                new ReadingEntity(SPOT_ID_1, new Date(), List.of(new SingleReadingEntity("temperature", "21", ParameterType.NUMBER))),
                new ReadingEntity(SPOT_ID_1, new Date(), List.of(new SingleReadingEntity("temperature", "22", ParameterType.NUMBER))),
                new ReadingEntity(SPOT_ID_2, new Date(), List.of(new SingleReadingEntity("temperature", "23", ParameterType.NUMBER))),
                new ReadingEntity(SPOT_ID_2, new Date(), List.of(new SingleReadingEntity("temperature", "24", ParameterType.NUMBER))),
                new ReadingEntity(SPOT_ID_2, new Date(), List.of(new SingleReadingEntity("temperature", "25", ParameterType.NUMBER))));

        when(readingsRepository.findAllBySpotId(SPOT_ID_1)).thenReturn(allReadings.stream().filter(readingEntity -> readingEntity.getSpotId().equals(SPOT_ID_1)).collect(Collectors.toList()));
        when(readingsRepository.findAllBySpotId(SPOT_ID_2)).thenReturn(allReadings.stream().filter(readingEntity -> readingEntity.getSpotId().equals(SPOT_ID_2)).collect(Collectors.toList()));

        // when
        List<ReadingEntity> readingsFromSpot1 = readingsDao.findAllBySpotId(SPOT_ID_1);
        List<ReadingEntity> readingsFromSpot2 = readingsDao.findAllBySpotId(SPOT_ID_2);

        // then
        assertEquals(3, readingsFromSpot1.size());
        assertEquals(allReadings.stream().filter(readingEntity -> readingEntity.getSpotId().equals(SPOT_ID_1)).toList(), readingsFromSpot1);
        assertEquals(3, readingsFromSpot2.size());
        assertEquals(allReadings.stream().filter(readingEntity -> readingEntity.getSpotId().equals(SPOT_ID_2)).toList(), readingsFromSpot2);
    }
}
