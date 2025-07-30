package eu.waterlineproject.app.supply.water.application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.waterlineproject.app.supply.water.application.service.ImageService;
import eu.waterlineproject.app.supply.water.model.image.ImageEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity<Void> uploadImage(@PathVariable("spotID") UUID spotID,
                                            @RequestPart("file") List<MultipartFile> images,
                                            HttpServletResponse response) throws IOException { 
        if (images.isEmpty()) {
            log.error("List of files is empty");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            for (MultipartFile image : images) {
                imageService.validateAndSaveImage(spotID, image);
            }
            log.info("Images were uploaded and processed successfully");
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Invalid file uploaded: {}", e.getMessage());
            
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            final Map<String, Object> body = new HashMap<>();
            body.put("status", HttpServletResponse.SC_BAD_REQUEST);
            body.put("error", "Bad Request");
            body.put("message", e.getMessage());

            final ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getOutputStream(), body);
            
            return null;
        } catch (IOException e) {
            log.error("Unable to read file", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") UUID id) {
        imageService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}