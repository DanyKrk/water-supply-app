package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.service.ChartsService;
import eu.waterlineproject.app.supply.water.model.charts.DataPoint;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@AllArgsConstructor
@RestController
@RequestMapping("/charts")
public class ChartsController {
    ChartsService chartsService;

    @GetMapping("/keys")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<String>> getChartKeys(@RequestParam("spotID") UUID spotId) {
        return new ResponseEntity<>(chartsService.getChartKeys(spotId), HttpStatus.OK);
    }

    @PostMapping("/keys/selected")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<String>> getSelectedChartKeys(@RequestParam("spotID") UUID spotId, @RequestBody List<String> selectedKeys) {
        return new ResponseEntity<>(chartsService.getSelectedChartKeys(spotId, selectedKeys), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<DataPoint>> getChartData(@RequestParam("spotID") UUID spotId, @RequestParam("key") String key) {
        String decodedKey = URLDecoder.decode(key, StandardCharsets.UTF_8);
        return new ResponseEntity<>(chartsService.getChartData(spotId, decodedKey), HttpStatus.OK);
    }

    @GetMapping("/periodic")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<DataPoint>> getPeriodicChartData(
            @RequestParam("spotID") UUID spotId,
            @RequestParam("key") String key,
            @RequestParam("startDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDateTime,
            @RequestParam("endDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDateTime) {

        String decodedKey = URLDecoder.decode(key, StandardCharsets.UTF_8);
        return new ResponseEntity<>(chartsService.getPeriodicChartData(spotId, decodedKey, startDateTime, endDateTime), HttpStatus.OK);
    }
}
