package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.dto.CreateSpotDto;
import eu.waterlineproject.app.supply.water.application.exception.DuplicateEntityException;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.service.SpotService;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import lombok.AllArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RestController
@RequestMapping("/spots")
public class SpotController {

    private final SpotService spotService;

    @GetMapping("/list")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<SpotEntity>> getSpots(@ParameterObject Pageable pageable) {
        return new ResponseEntity<>(spotService.getAllSpots(Objects.requireNonNullElseGet(pageable, Pageable::unpaged)), HttpStatus.OK);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getSpotsCount() {
        return new ResponseEntity<>(spotService.getSpotsCount(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SpotEntity> getSpotById(@PathVariable("id") UUID id) {
        try {
            return new ResponseEntity<>(spotService.getSpotById(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpotEntity> addSpot(@RequestBody CreateSpotDto spot) {
        try {
            return new ResponseEntity<>(spotService.addSpot(spot), HttpStatus.OK);
        } catch (DuplicateEntityException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateSpot(@PathVariable("id") UUID id, @RequestBody CreateSpotDto spot) {
        try {
            spotService.updateSpot(id, spot);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpot(@PathVariable("id") UUID id) {
        spotService.deleteSpot(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
