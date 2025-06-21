package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.application.history.HistoryEvent;
import eu.waterlineproject.app.supply.water.application.service.FileUploadService;
import eu.waterlineproject.app.supply.water.application.service.ReadingsService;
import eu.waterlineproject.app.supply.water.application.utils.DateUtil;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.error.FileResponseDetails;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@CrossOrigin
@AllArgsConstructor
@RestController
@RequestMapping("/readings")
public class ReadingsController {

    private final ReadingsService readingsService;
    private final FileUploadService fileUploadService;

    @GetMapping("/{spotID}/list")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ReadingEntity>> getReadings(@ParameterObject Pageable pageable,
                                                           @PathVariable(value = "spotID") UUID spotID) {
        return new ResponseEntity<>(readingsService.getAllReadings(Objects.requireNonNullElseGet(pageable, Pageable::unpaged), spotID), HttpStatus.OK);
    }

    @GetMapping("/{spotID}/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ReadingEntity> getReading(@PathVariable(value = "spotID") UUID spotID,
                                                    @PathVariable(value = "id") UUID id) {
        try {
            return new ResponseEntity<>(readingsService.getReadingByIdAndSpotId(id, spotID), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{spotID}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @HistoryEvent(type = HistoryEventType.ADD_READING)
    public ResponseEntity<ReadingEntity> addReading(@RequestHeader("Authorization") String token,
            @PathVariable(value = "spotID") UUID spotID, @RequestBody List<SingleReadingEntity> entities) {
        return new ResponseEntity<>(readingsService.addReading(new ReadingEntity(spotID, DateUtil.now(), entities)), HttpStatus.OK);
    }

    @PutMapping("/{spotID}/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @HistoryEvent(type = HistoryEventType.UPDATE_READING)
    public ResponseEntity<ReadingEntity> updateReading(@RequestHeader("Authorization") String token,
            @PathVariable("spotID") UUID spotID, @PathVariable("id") UUID readingId, @RequestBody List<SingleReadingEntity> updatedEntities) {
        try {
            return new ResponseEntity<>(readingsService.updateReading(readingId, spotID, updatedEntities), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{spotID}/{readingId}")
    @PreAuthorize("hasRole('ADMIN')")
    @HistoryEvent(type = HistoryEventType.DELETE_READING)
    public ResponseEntity<Void> deleteReading(@RequestHeader("Authorization") String token,
            @PathVariable("spotID") UUID spotID, @PathVariable("readingId") UUID readingId) {
        readingsService.deleteReading(readingId, spotID);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{spotID}/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @HistoryEvent(type = HistoryEventType.UPLOAD_READINGS)
    public ResponseEntity<FileResponseDetails> uploadFile(@RequestHeader("Authorization") String token,
            @PathVariable("spotID") UUID spotID, @RequestPart("file") List<MultipartFile> files) {
        if (files.isEmpty()) {
            log.error("List of files is empty");
            return ResponseEntity.badRequest().body(new FileResponseDetails("No files were uploaded", 3, ""));
        }

        try {
            for (MultipartFile file : files) {
                fileUploadService.processExcelFile(file, spotID);
            }
            log.info("Excel files uploaded and processed successfully");
            return ResponseEntity.ok(
                    new FileResponseDetails("Excel files uploaded and processed successfully", 0, ""));
        } catch (IllegalArgumentException e) {
            log.error("Invalid data in Excel file");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new FileResponseDetails("Invalid data in Excel file", 1, e.getMessage()));
        } catch (RuntimeException e) {
            log.error("Unable to read date");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new FileResponseDetails("Unable to read date", 2, e.getMessage()));
        } catch (IOException e) {
            log.error("Unable to read file");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new FileResponseDetails("Unable to read file", 3, e.getMessage()));
        }
    }
}
