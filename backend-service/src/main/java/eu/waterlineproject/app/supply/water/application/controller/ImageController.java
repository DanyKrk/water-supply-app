package eu.waterlineproject.app.supply.water.application.controller;

import eu.waterlineproject.app.supply.water.application.service.ImageService;
import eu.waterlineproject.app.supply.water.model.image.ImageEntity;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RestController
@RequestMapping("/images")
public class ImageController {
    private final ImageService imageService;

    @GetMapping("/{spotID}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ImageEntity>> getSpotsImages(@PathVariable("spotID") UUID spotID) {
        return new ResponseEntity<>(imageService.getAllImages(spotID), HttpStatus.OK);
    }

    @PostMapping("/{spotID}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> uploadImage(@PathVariable("spotID") UUID spotID, @RequestPart("file") List<MultipartFile> images) {
        if (images.isEmpty()) {
            log.error("List of files is empty");
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        try {
            for (MultipartFile image : images) {
                imageService.addImage(new ImageEntity(spotID, image.getBytes()));
            }
            log.info("Image was uploaded and processed successfully");
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (IOException e) {
            log.error("Unable to read file");
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") UUID id) {
        imageService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
