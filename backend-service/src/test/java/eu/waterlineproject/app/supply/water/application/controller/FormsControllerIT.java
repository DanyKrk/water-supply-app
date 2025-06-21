package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.dto.CreateSpotDto;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.service.SpotService;
import eu.waterlineproject.app.supply.water.model.forms.FormEntity;
import eu.waterlineproject.app.supply.water.model.forms.FormsRepository;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import org.json.JSONArray;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FormsControllerIT extends ControllerBaseIT {

    @Autowired
    SpotService spotService;

    @Autowired
    FormsRepository formsRepository;

    @Test
    void canGetFormsForSpot() throws EntityNotFoundException {
        // given
        SpotEntity spot = spotService.addSpot(new CreateSpotDto("Spot 1",
                null, null, null, (double) 0, (double) 0, null, null, Collections.emptyMap()));

        formsRepository.save(new FormEntity("Form1", List.of(new FormEntity.Parameter("param1", ParameterType.NUMBER))));
        FormEntity formEntity = formsRepository.save(new FormEntity("Form2", List.of(new FormEntity.Parameter("param1", ParameterType.NUMBER))));
        FormEntity formEntity2 = formsRepository.save(new FormEntity("Form3", List.of(new FormEntity.Parameter("param1", ParameterType.NUMBER))));
        formsRepository.save(new FormEntity("Form4", List.of(new FormEntity.Parameter("param1", ParameterType.NUMBER))));

        spotService.updateSpot(spot.getId(), new CreateSpotDto("Spot 1",
                null, null, null, (double) 0, (double) 0, null, List.of(formEntity.getId(), formEntity2.getId()), Collections.emptyMap()));

        // when
        String results = webTestClient.get().uri("/forms/" + spot.getId() + "/list")
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                // then
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult().getResponseBody();


        JSONArray resultsPageJSONArray = new JSONArray(results);

        assertEquals(2, resultsPageJSONArray.length());
        assertTrue(resultsPageJSONArray.toList().stream().anyMatch(o -> o.toString().contains("Form2")));
        assertTrue(resultsPageJSONArray.toList().stream().anyMatch(o -> o.toString().contains("Form3")));
    }
}
