package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.model.image.ImageDao;
import eu.waterlineproject.app.supply.water.model.image.ImageEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
public class ImageService {
    private final ImageDao imageDao;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png");
    private static final byte[] JPEG_SIGNATURE = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_SIGNATURE = new byte[]{(byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47};

    public List<ImageEntity> getAllImages(UUID spotId)  {
        return imageDao.findAllBySpotId(spotId);
    }

    public void deleteById(UUID id) {
        imageDao.deleteById(id);
    }

    public ImageEntity validateAndSaveImage(UUID spotId, MultipartFile file) throws IOException, IllegalArgumentException {
        validateImage(file);
        ImageEntity imageEntity = new ImageEntity(spotId, file.getBytes());
        return imageDao.save(imageEntity);
    }

    private void validateImage(MultipartFile file) throws IOException, IllegalArgumentException {
        // Krok 1: Walidacja typu MIME
        if (file.getContentType() == null || !ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Niedozwolony typ pliku (Content-Type): " + file.getContentType());
        }

        // Krok 2: Walidacja sygnatury (Magic Bytes)
        try (InputStream is = file.getInputStream()) {
            byte[] signature = new byte[4];
            int bytesRead = is.read(signature, 0, 4);

            if (bytesRead < 3) {
                throw new IllegalArgumentException("Plik jest zbyt mały, aby zweryfikować sygnaturę.");
            }

            boolean isJpeg = Arrays.equals(Arrays.copyOf(signature, 3), JPEG_SIGNATURE);
            boolean isPng = (bytesRead >= 4) && Arrays.equals(signature, PNG_SIGNATURE);

            if (!isJpeg && !isPng) {
                throw new IllegalArgumentException("Nieprawidłowa zawartość pliku. Plik nie jest obrazem JPEG ani PNG.");
            }
        }
    }
}