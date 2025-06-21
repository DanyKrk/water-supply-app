package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.ReadingsDao;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ReadingsControllerIT extends ControllerBaseIT {

    private final UUID SPOT_ID_1 = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UUID SPOT_ID_2 = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Autowired
    private ReadingsDao readingsDao;

    @Test
    void getReading() {
        // given
        UUID readingId = readingsDao.save(new ReadingEntity(SPOT_ID_1, null, List.of(new SingleReadingEntity("temperature", "20", ParameterType.NUMBER)))).getId();

        // when
        webTestClient.get().uri("/readings/{spotID}/{id}", SPOT_ID_1, readingId)
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                // then
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.spotId").isEqualTo(SPOT_ID_1.toString())
                .jsonPath("$.readings[0].parameter").isEqualTo("temperature")
                .jsonPath("$.readings[0].parameterValue").isEqualTo("20");
    }

    @Test
    void getReadings() {
        // given
        for (int i = 20; i < 27; i++) {
            readingsDao.save(new ReadingEntity(SPOT_ID_1,
                    Date.from(OffsetDateTime.of(2021, 1, 30 - i, 0, 0, 0, 0, OffsetDateTime.now().getOffset()).toInstant()),
                    List.of(new SingleReadingEntity("temperature", String.valueOf(i), ParameterType.NUMBER))));
            readingsDao.save(new ReadingEntity(SPOT_ID_2,
                    Date.from(OffsetDateTime.of(2021, 1, 30 - i, 0, 0, 0, 1, OffsetDateTime.now().getOffset()).toInstant()),
                    List.of(new SingleReadingEntity("temperature", String.valueOf(i), ParameterType.NUMBER))));
        }

        // when
        String results = webTestClient.get().uri(uriBuilder -> uriBuilder
                        .path("/readings/" + SPOT_ID_2 + "/list")
                        .queryParam("page", 2)
                        .queryParam("size", 2)
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                // then
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        JSONObject resultsPage = new JSONObject(results);
        JSONArray resultsPageJSONArray = resultsPage.getJSONArray("content");

        assertEquals(2, resultsPageJSONArray.length());
        assertEquals("24", resultsPageJSONArray.getJSONObject(0).getJSONArray("readings").getJSONObject(0).getString("parameterValue"));
        assertEquals("25", resultsPageJSONArray.getJSONObject(1).getJSONArray("readings").getJSONObject(0).getString("parameterValue"));
    }
}
