package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.dto.FormDto;
import eu.waterlineproject.app.supply.water.application.exception.DuplicateEntityException;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.service.FormsService;
import eu.waterlineproject.app.supply.water.model.forms.FormEntity;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@AllArgsConstructor
@RestController
@RequestMapping("/forms")
public class FormsController {
    private final FormsService formsService;

    @GetMapping("/list")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FormEntity>> getAllForms() {
        return new ResponseEntity<>(formsService.getAllForms(), HttpStatus.OK);
    }

    @GetMapping("/list-by-ids")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FormEntity>> getAllFormsByIds(@RequestParam List<UUID> ids) {
        return new ResponseEntity<>(formsService.getAllFormsByIds(ids), HttpStatus.OK);
    }

    @GetMapping("/{spotId}/list")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FormEntity>> getAllFormsBySpotId(@PathVariable UUID spotId) {
        try {
            return new ResponseEntity<>(formsService.getAllFormsBySpotId(spotId), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FormEntity> addForm(@RequestBody FormDto formDto) {
        try {
            return new ResponseEntity<>(formsService.addForm(toFormEntity(formDto)), HttpStatus.OK);
        } catch (DuplicateEntityException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    // TODO editing and deleting forms should be more like adding to archive - results in unrecoverable data in db
    @PutMapping("/{formID}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FormEntity> updateForm(
            @PathVariable("formID") UUID id,
            @RequestBody FormDto updatedForm) {
        try {
            return new ResponseEntity<>(formsService.updateForm(id, toFormEntity(updatedForm)), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // TODO editing and deleting forms should be more like adding to archive - results in unrecoverable data in db
    @DeleteMapping("/{formID}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteForm(@PathVariable("formID") UUID id) {
        formsService.deleteFormById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private FormEntity toFormEntity(FormDto formDto) {
        return new FormEntity(formDto.name(),
                formDto.parameters()
                        .stream()
                        .map(parameter -> new FormEntity.Parameter(parameter.name(), parameter.type()))
                        .toList());
    }
}
