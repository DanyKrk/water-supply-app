package eu.waterlineproject.app.supply.water.model.image;

import eu.waterlineproject.app.supply.water.model.common.SpotAwareEntityDao;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Component
public class ImageDao implements SpotAwareEntityDao<ImageEntity> {

    private final ImageRepository imageRepository;

    @Override
    public Page<ImageEntity> findAllBySpotId(Pageable pageable, UUID spotId) {
        return imageRepository.findAllBySpotId(pageable, spotId);
    }

    @Override
    public List<ImageEntity> findAllBySpotId(UUID spotId) {
        return imageRepository.findAllBySpotId(spotId);
    }

    @Override
    public Optional<ImageEntity> findByIdAndSpotId(UUID id, UUID spotId) {
        return imageRepository.findByIdAndSpotId(id, spotId);
    }

    @Override
    public void deleteByIdAndSpotId(UUID id, UUID spotId) {
        imageRepository.deleteByIdAndSpotId(id, spotId);
    }

    @Override
    public void deleteAllBySpotId(UUID spotId) {
        imageRepository.deleteAllBySpotId(spotId);
    }

    @Override
    public boolean existsByIdAndSpotId(UUID id, UUID spotId) {
        return imageRepository.existsByIdAndSpotId(id, spotId);
    }

    @Override
    public ImageEntity save(ImageEntity entity) {
        return imageRepository.save(entity);
    }

    @Override
    public List<ImageEntity> saveAll(List<ImageEntity> entities) {
        return imageRepository.saveAll(entities);
    }

    @Override
    public ImageEntity update(UUID id, UUID spotId, ImageEntity entity) {
        throw new UnsupportedOperationException("Update operation not supported for images");
    }

    public void deleteById(UUID id) {
        imageRepository.deleteById(id);
    }
}
