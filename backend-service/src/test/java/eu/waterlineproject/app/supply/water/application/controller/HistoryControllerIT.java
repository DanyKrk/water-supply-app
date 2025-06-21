package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.request.LoginRequest;
import eu.waterlineproject.app.supply.water.application.utils.PasswordHashUtil;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.ReadingsDao;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import eu.waterlineproject.app.supply.water.model.spot.SpotRepository;
import eu.waterlineproject.app.supply.water.model.user.ERole;
import eu.waterlineproject.app.supply.water.model.user.UserEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HistoryControllerIT extends ControllerBaseIT {

    private static final String USERNAME2 = "user2";

    @Autowired
    private SpotRepository spotRepository;

    @Autowired
    private ReadingsDao readingsDao;

    @Test
    void getHistory() {
        // given
        SpotEntity spot = spotRepository.save(new SpotEntity("spot", null, null, null, new GeoJsonPoint(0, 0), null, new HashMap<>()));
        ReadingEntity reading = readingsDao.save(new ReadingEntity(spot.getId(), Date.valueOf("2020-01-01"), List.of(new SingleReadingEntity("param1", "value1", ParameterType.TEXT))));

        userRepository.save(new UserEntity(
                USERNAME2,
                PasswordHashUtil.generateHash(PASSWORD),
                "Name",
                "email@example.com",
                "Unit",
                ERole.ROLE_USER
        ));

        String jwtToken2 = authController.authenticateUser(new LoginRequest(USERNAME2, PASSWORD)).getBody().getToken();

        addReading(webTestClient, jwtToken, spot.getId());
        updateReading(webTestClient, jwtToken, spot.getId(), reading.getId());
        addReading(webTestClient, jwtToken2, spot.getId());
        addReading(webTestClient, jwtToken2, spot.getId());
        updateReading(webTestClient, jwtToken, spot.getId(), reading.getId());

        // when
        String response = webTestClient.get().uri(uriBuilder -> uriBuilder
                        .path("/history")
                        .queryParam("spotID", spot.getId().toString())
                        .queryParam("page", 0)
                        .queryParam("size", 10)
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult().getResponseBody();

        JSONObject resultsPage = new JSONObject(response);
        JSONArray resultsPageJSONArray = resultsPage.getJSONArray("content");

        // then
        assertEquals(5, resultsPageJSONArray.length());

        assertEquals(HistoryEventType.UPDATE_READING.toString(), resultsPageJSONArray.getJSONObject(0).getString("type"));
        assertEquals(HistoryEventType.ADD_READING.toString(), resultsPageJSONArray.getJSONObject(1).getString("type"));
        assertEquals(HistoryEventType.ADD_READING.toString(), resultsPageJSONArray.getJSONObject(2).getString("type"));
        assertEquals(HistoryEventType.UPDATE_READING.toString(), resultsPageJSONArray.getJSONObject(3).getString("type"));
        assertEquals(HistoryEventType.ADD_READING.toString(), resultsPageJSONArray.getJSONObject(4).getString("type"));

        assertEquals(USERNAME, resultsPageJSONArray.getJSONObject(0).getString("userName"));
        assertEquals(USERNAME2, resultsPageJSONArray.getJSONObject(1).getString("userName"));
        assertEquals(USERNAME2, resultsPageJSONArray.getJSONObject(2).getString("userName"));
        assertEquals(USERNAME, resultsPageJSONArray.getJSONObject(3).getString("userName"));
        assertEquals(USERNAME, resultsPageJSONArray.getJSONObject(4).getString("userName"));
    }

    @Test
    void historyEventIsNotAddedWhenMethodFailed() {
        // given
        SpotEntity spot = spotRepository.save(new SpotEntity("spot", null, null, null, new GeoJsonPoint(0, 0), null, new HashMap<>()));
        ReadingEntity reading = readingsDao.save(new ReadingEntity(spot.getId(), Date.valueOf("2020-01-01"), List.of(new SingleReadingEntity("param1", "value1", ParameterType.TEXT))));

        addReading(webTestClient, jwtToken, spot.getId());
        updateReadingWithStatusNotFound(webTestClient, jwtToken, spot.getId());
        updateReading(webTestClient, jwtToken, spot.getId(), reading.getId());

        // when
        String response = webTestClient.get().uri(uriBuilder -> uriBuilder
                        .path("/history")
                        .queryParam("page", 0)
                        .queryParam("size", 10)
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult().getResponseBody();

        JSONObject resultsPage = new JSONObject(response);
        JSONArray resultsPageJSONArray = resultsPage.getJSONArray("content");

        // then
        assertEquals(2, resultsPageJSONArray.length());
    }

    private static void addReading(WebTestClient client, String jwtToken, UUID spotID) {
        client.post().uri("/readings/{spotID}", spotID.toString())
                .header("Authorization", "Bearer " + jwtToken)
                .bodyValue(List.of(
                        new SingleReadingEntity("param1", "value1", ParameterType.TEXT),
                        new SingleReadingEntity("param5", "1", ParameterType.NUMBER))
                )
                .exchange()
                .expectStatus().isOk();
    }

    private static void updateReading(WebTestClient client, String jwtToken, UUID spotID, UUID readingID) {
        client.put().uri(uriBuilder -> uriBuilder
                        .path("/readings/" + spotID.toString() + "/" + readingID.toString())
                        .queryParam("spotID", spotID.toString())
                        .queryParam("readingId", readingID.toString())
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .bodyValue(List.of(
                        new SingleReadingEntity("param1", "newVal1", ParameterType.TEXT),
                        new SingleReadingEntity("param2", "newVal2", ParameterType.TEXT),
                        new SingleReadingEntity("param3", "newVal3", ParameterType.TEXT),
                        new SingleReadingEntity("param4", "newVal4", ParameterType.TEXT),
                        new SingleReadingEntity("param5", "11", ParameterType.NUMBER),
                        new SingleReadingEntity("param6", "22", ParameterType.NUMBER),
                        new SingleReadingEntity("param7", "33", ParameterType.NUMBER),
                        new SingleReadingEntity("param8", "44", ParameterType.NUMBER)))
                .exchange()
                .expectStatus().isOk();
    }

    // FIXME fix mock uploadFile and add to the tests
    private static void uploadFile(WebTestClient client, String jwtToken, UUID spotID) {
        byte[] content = "".getBytes();

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", new ByteArrayResource(content))
                .filename("test-file.txt")
                .contentType(MediaType.TEXT_PLAIN);
        bodyBuilder.part("file2", new ByteArrayResource(content))
                .filename("test-file2.txt")
                .contentType(MediaType.TEXT_PLAIN);

        client.post().uri(uriBuilder -> uriBuilder
                        .path("/readings/upload")
                        .queryParam("spotID", spotID.toString())
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .body(BodyInserters.fromMultipartData("file", bodyBuilder.build()))
                .exchange()
                .expectStatus().isOk();
    }

    private static void updateReadingWithStatusNotFound(WebTestClient client, String jwtToken, UUID spotID) {
        UUID notExistingReadingID = UUID.fromString("98765432-0000-0000-0000-000000000000");

        client.put().uri(uriBuilder -> uriBuilder
                        .path("/readings/" + spotID.toString() + "/" + notExistingReadingID)
                        .queryParam("spotID", spotID.toString())
                        .queryParam("readingId", notExistingReadingID.toString())
                        .build())
                .header("Authorization", "Bearer " + jwtToken)
                .bodyValue(List.of(
                        new SingleReadingEntity("param1", "newVal1", ParameterType.TEXT))
                )
                .exchange()
                .expectStatus().isNotFound();
    }
}
