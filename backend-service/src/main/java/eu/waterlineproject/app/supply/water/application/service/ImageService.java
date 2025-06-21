package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.model.image.ImageDao;
import eu.waterlineproject.app.supply.water.model.image.ImageEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
public class ImageService {
    private final ImageDao imageDao;

    public List<ImageEntity> getAllImages(UUID spotId)  {
        return imageDao.findAllBySpotId(spotId);
    }

    public void deleteById(UUID id) {
        imageDao.deleteById(id);
    }

    public ImageEntity addImage(ImageEntity image) {
        return imageDao.save(image);
    }
}
