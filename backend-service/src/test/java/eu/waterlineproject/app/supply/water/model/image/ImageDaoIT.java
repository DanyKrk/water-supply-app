package eu.waterlineproject.app.supply.water.model.image;

import eu.waterlineproject.app.supply.water.BaseIT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ImageDaoIT extends BaseIT {

    private final UUID SPOT_ID_1 = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UUID SPOT_ID_2 = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Autowired
    private ImageRepository imageRepository;

    private ImageDao imageDao;

    @BeforeEach
    public void initialize() {
        imageDao = new ImageDao(imageRepository);
    }

    @Test
    void canFindAllBySpotId() {
        // given
        byte[] image1 = new byte[]{1, 2, 3, 4, 5, 6, 7, 8};
        byte[] image2 = new byte[]{8, 7, 6, 5, 4, 3, 2, 1};


        imageDao.save(new ImageEntity(SPOT_ID_1, image1));
        imageDao.save(new ImageEntity(SPOT_ID_1, image2));
        imageDao.save(new ImageEntity(SPOT_ID_2, image1));
        imageDao.save(new ImageEntity(SPOT_ID_2, image2));

        // when
        List<ImageEntity> results = imageDao.findAllBySpotId(SPOT_ID_1);

        // then
        assertEquals(2, results.size());
        assertEquals(SPOT_ID_1, results.get(0).getSpotId());
        assertEquals(SPOT_ID_1, results.get(1).getSpotId());
        assertArrayEquals(image1, results.get(0).getImage());
        assertArrayEquals(image2, results.get(1).getImage());
    }

    @Test
    void canDeleteById() {
        // given
        byte[] image = new byte[]{1, 2, 3, 4, 5, 6, 7, 8};
        for (int i = 0; i < 10; i++) {
            imageDao.save(new ImageEntity(UUID.fromString("00000000-0000-0000-0000-00000000000" + i), image));
        }
        ImageEntity imageEntity = imageDao.save(new ImageEntity(SPOT_ID_1, image));

        // when
        imageDao.deleteById(imageEntity.getId());

        // then
        assertTrue(imageDao.findByIdAndSpotId(imageEntity.getId(), SPOT_ID_1).isEmpty());
        for (int i = 0; i < 10; i++) {
            assertEquals(1, imageDao.findAllBySpotId(UUID.fromString("00000000-0000-0000-0000-00000000000" + i)).size());
        }
    }
}
