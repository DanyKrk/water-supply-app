package eu.waterlineproject.app.supply.water.model.image;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
class ImageDaoTest {

    private final UUID SPOT_ID_1 = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UUID SPOT_ID_2 = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @MockBean
    private ImageRepository imageRepository;

    @Autowired
    private ImageDao imageDao;

    @Test
    void daoProxiesRepository() {
        // given
        List<ImageEntity> allImages = List.of(
                new ImageEntity(SPOT_ID_1, new byte[]{1, 2, 3}),
                new ImageEntity(SPOT_ID_1, new byte[]{4, 5, 6}),
                new ImageEntity(SPOT_ID_1, new byte[]{7, 8, 9}),
                new ImageEntity(SPOT_ID_2, new byte[]{10, 11, 12}),
                new ImageEntity(SPOT_ID_2, new byte[]{13, 14, 15}),
                new ImageEntity(SPOT_ID_2, new byte[]{16, 17, 18})
        );

        when(imageRepository.findAllBySpotId(SPOT_ID_1)).thenReturn(allImages.stream().filter(imageEntity -> imageEntity.getSpotId().equals(SPOT_ID_1)).toList());
        when(imageRepository.findAllBySpotId(SPOT_ID_2)).thenReturn(allImages.stream().filter(imageEntity -> imageEntity.getSpotId().equals(SPOT_ID_2)).toList());

        // when
        List<ImageEntity> imagesFromSpot1 = imageDao.findAllBySpotId(SPOT_ID_1);
        List<ImageEntity> imagesFromSpot2 = imageDao.findAllBySpotId(SPOT_ID_2);

        // then
        assertEquals(3, imagesFromSpot1.size());
        assertEquals(3, imagesFromSpot2.size());
        assertEquals(allImages.stream().filter(imageEntity -> imageEntity.getSpotId().equals(SPOT_ID_1)).collect(Collectors.toList()), imagesFromSpot1);
        assertEquals(allImages.stream().filter(imageEntity -> imageEntity.getSpotId().equals(SPOT_ID_2)).collect(Collectors.toList()), imagesFromSpot2);
    }
}
