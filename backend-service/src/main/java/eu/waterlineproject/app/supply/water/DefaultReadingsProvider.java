package eu.waterlineproject.app.supply.water;

import eu.waterlineproject.app.supply.water.application.utils.DateUtil;
import eu.waterlineproject.app.supply.water.application.utils.PasswordHashUtil;
import eu.waterlineproject.app.supply.water.application.service.SpotService;
import eu.waterlineproject.app.supply.water.application.dto.CreateSpotDto;
import eu.waterlineproject.app.supply.water.model.forms.FormEntity;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.application.service.FormsService;
import eu.waterlineproject.app.supply.water.model.history.HistoryEventRepository;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.ReadingsDao;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import eu.waterlineproject.app.supply.water.model.refreshtoken.RefreshTokenRepository;
import eu.waterlineproject.app.supply.water.model.spot.SpotRepository;
import eu.waterlineproject.app.supply.water.model.user.*;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

// TODO remove when adding data is implemented
@Deprecated
@AllArgsConstructor
@Component
public class DefaultReadingsProvider {
    private final ReadingsDao readingsDao;
    private final FormsService formsService;
    private final SpotService spotService;
    private final SpotRepository spotRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final HistoryEventRepository historyEventRepository;
    private final Random random = new Random();
    private static final String SHORT_DESCRIPTION = "Rok powstania - 2020.   A well is an excavation or structure created in the ground by digging, driving, "
            +
            "or drilling to access liquid resources, usually water. The oldest and most common kind of well is a water well, "
            +
            "to access groundwater in underground aquifers. The well water is drawn up by a pump, or using containers, "
            +
            "such as buckets or large water bags that are raised mechanically or by hand. Water can also be injected back "
            +
            "into the aquifer through the well. Wells were first constructed at least eight thousand years ago and historically "
            +
            "vary in construction from a simple scoop in the sediment of a dry watercourse to the qanats of Iran, and the stepwells "
            +
            "and sakiehs of India.";

    private static List<FormEntity> getFormEntityList() {
        List<String> wellNumericalParameterStrings = new ArrayList<>();
        wellNumericalParameterStrings.add("pH");
        wellNumericalParameterStrings.add("Twardość węglanowa [mg/l]");
        wellNumericalParameterStrings.add("Twardość ogólna [mg/l]");
        wellNumericalParameterStrings.add("Żelazo [µg/l]");
        wellNumericalParameterStrings.add("Mangan [µg/l]");
        wellNumericalParameterStrings.add("Azotyny [mg/l]");
        wellNumericalParameterStrings.add("Azotany [mg/l]");
        wellNumericalParameterStrings.add("Chlorki [mg/l]");
        wellNumericalParameterStrings.add("Siarczany [mg/l]");
        wellNumericalParameterStrings.add("Radon [Bq/1]");

        List<FormEntity.Parameter> wellNumericalParameters = new ArrayList<>();
        for (String parameter : wellNumericalParameterStrings) {
            wellNumericalParameters.add(new FormEntity.Parameter(parameter, ParameterType.NUMBER));
        }

        List<String> wellNumericalAndTextParameterStrings = new ArrayList<>();
        wellNumericalAndTextParameterStrings.add("Barwa");
        wellNumericalAndTextParameterStrings.add("Smak");
        wellNumericalAndTextParameterStrings.add("Jakość");
        wellNumericalAndTextParameterStrings.add("pH");
        wellNumericalAndTextParameterStrings.add("Twardość węglanowa [mg/l]");
        wellNumericalAndTextParameterStrings.add("Twardość ogólna [mg/l]");
        wellNumericalAndTextParameterStrings.add("Żelazo [µg/l]");
        wellNumericalAndTextParameterStrings.add("Mangan [µg/l]");
        wellNumericalAndTextParameterStrings.add("Azotyny [mg/l]");
        wellNumericalAndTextParameterStrings.add("Azotany [mg/l]");
        wellNumericalAndTextParameterStrings.add("Chlorki [mg/l]");
        wellNumericalAndTextParameterStrings.add("Siarczany [mg/l]");
        wellNumericalAndTextParameterStrings.add("Radon [Bq/1]");

        List<FormEntity.Parameter> wellNumericalAndTextParameters = new ArrayList<>();
        for (String parameter : wellNumericalAndTextParameterStrings) {
            if (parameter.equals("Barwa") || parameter.equals("Smak") || parameter.equals("Jakość")) {
                wellNumericalAndTextParameters
                        .add(new FormEntity.Parameter(parameter, ParameterType.TEXT));
            } else {
                wellNumericalAndTextParameters
                        .add(new FormEntity.Parameter(parameter, ParameterType.NUMBER));
            }
        }

        return List.of(
                new FormEntity("Parametry fizykochemiczne", wellNumericalParameters),
                new FormEntity("Parametry organoleptyczne i fizykochemiczne", wellNumericalAndTextParameters),
                new FormEntity("Parametry mikrobiologiczne", List.of(
                        new FormEntity.Parameter("Escherichia coli [l. mikroorganizmów jtk lub NPL w próbce 100ml]", ParameterType.NUMBER),
                        new FormEntity.Parameter("Enterokoki [l. mikroorganizmów jtk lub NPL w próbce 100ml]", ParameterType.NUMBER))),

                new FormEntity("Wymagania organoleptyczne i fizykochemiczne II", List.of(
                        new FormEntity.Parameter("Glin (Al) [µg/l]", ParameterType.NUMBER),
                        new FormEntity.Parameter("Jon amounu [mg/l]", ParameterType.NUMBER),
                        new FormEntity.Parameter("Barwa", ParameterType.TEXT),
                        new FormEntity.Parameter("Chlorki [mg/l]", ParameterType.NUMBER),
                        new FormEntity.Parameter("Mangan [µg/l]", ParameterType.NUMBER),
                        new FormEntity.Parameter("Żelazo [µg/l]", ParameterType.NUMBER))));
    }

    @PostConstruct
    @Transactional
    public void initialize() {
        historyEventRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        UserEntity user = new UserEntity(
                "test",
                PasswordHashUtil.generateHash("test"),
                "test name",
                "test@test.com",
                "test unit",
                ERole.ROLE_ADMIN
        );
        userRepository.save(user);

        spotRepository.findAll().forEach(a -> formsService.deleteAllForms());
        spotRepository.deleteAll();
        for (int i = 1; i < 5; i++) {
            HashMap<String, String> initialParameters = new HashMap<>();

            initialParameters.put("Wysokość kryzy nad pow terenu", "10.5");
            initialParameters.put("Zwp statyczne (głębokość od kryzy)", "7.2");
            initialParameters.put("Zwp statyczne (rzędna w układzie: układ PL-EVRF2007-NH)", "120.3");
            initialParameters.put("Zwp statyczne (rzędna pierwotna)", "125.6");
            initialParameters.put("Zwp dynamiczne (głębokość od kryzy)", "8.9");
            initialParameters.put("Zwp dynamiczne (rzędna w układzie: układ PL-EVRF2007-NH)", "130.2");
            initialParameters.put("Zwp dynamiczne (rzędna pierwotna)", "135.4");
            initialParameters.put("Czas pracy pompy głębinowej do momentu pomiaru", "24");
            initialParameters.put("Depresja [m]", "5.2");
            initialParameters.put("Wydajność _Q_[m3/h]", "500");
            initialParameters.put("q [m3/h / 1m _s_]", "1.2");
            initialParameters.put("s/Q [m/m3/h]", "0.008");
            initialParameters.put("Wartość B - Wartość przecięcia wykresu s/Q f(Q) z OY", "0.025");
            initialParameters.put("Warotść C - Wartość nachylenia wykresu s/Q f(Q) w punkcie przecięcia z OY", "0.003");
            initialParameters.put("EC [uS/cm]", "350");
            initialParameters.put("Temperatura [C]", "25");
            initialParameters.put("Pobór próbki [T/N]", "T");
            initialParameters.put("Głębokość probówki", "5");
            initialParameters.put("Rzędna próbki", "130.8");
            initialParameters.put("Nazwa jednostki posiadającej studnię", "Wydział Produkcji Wody");
            initialParameters.put("Adres jednostki i nr telefonu", "ul. Studzienna 1, Częstochowa, +48 111 111 111");
            initialParameters.put("Komórka odpowiedzialna za gospodarkę w Zakładzie", "Wydział Produkcji Wody");
            initialParameters.put("Jednostka nadrzędna", "PWiK Okręgu Częstochowskiego SA w Częstochowie");
            initialParameters.put("Ilość studni istniejących na terenie jednostki (nazwa jednostki)", "5");
            initialParameters.put("Ilość studni eksploatywnych na terenie jednostki", "3");
            initialParameters.put("Ilość studni nie czynnych na terenie jednostki", "2");
            initialParameters.put(
                    "Czy istnieje domukantacja hydrologiczna rejestrowanej studni i gdzie jest przechowywana",
                    "Tak, w Biurze Hydrologii");
            initialParameters.put("Numer studni", "ST-001");
            initialParameters.put("Głębokość studni", "15");
            initialParameters.put("Wykonawca studni", "ABC Drilling Company");

            spotService.addSpot(new CreateSpotDto("Studnia " + i, LocalDate.now(),
                    "studnia", "Powiat częstochowski, gmina Kłobuck, Biała, ul. Studzienna", random.nextDouble(19, 19.2), random.nextDouble(50.7,51), SHORT_DESCRIPTION,  null,
                    initialParameters));

        }

        UUID spotId1 = spotService.getAllSpots(Pageable.unpaged()).getContent().get(0).getId();
        UUID spotId2 = spotService.getAllSpots(Pageable.unpaged()).getContent().get(1).getId();
        UUID spotId3 = spotService.getAllSpots(Pageable.unpaged()).getContent().get(2).getId();
        UUID spotId4 = spotService.getAllSpots(Pageable.unpaged()).getContent().get(3).getId();

        readingsDao.deleteAllBySpotId(spotId1);
        readingsDao.deleteAllBySpotId(spotId2);
        readingsDao.deleteAllBySpotId(spotId3);
        readingsDao.deleteAllBySpotId(spotId4);

        formsService.deleteAllForms();

        getFormEntityList().forEach(formsService::addForm);

        List<String> wellNumericalParameters = new ArrayList<>();
        wellNumericalParameters.add("pH");
        wellNumericalParameters.add("Twardość węglanowa [mg/l]");
        wellNumericalParameters.add("Twardość ogólna [mg/l]");
        wellNumericalParameters.add("Żelazo [µg/l]");
        wellNumericalParameters.add("Mangan [µg/l]");
        wellNumericalParameters.add("Azotyny [mg/l]");
        wellNumericalParameters.add("Azotany [mg/l]");
        wellNumericalParameters.add("Chlorki [mg/l]");
        wellNumericalParameters.add("Siarczany [mg/l]");
        wellNumericalParameters.add("Radon (Bq/1)");

        List<String> wellNumericalAndTextParameters = new ArrayList<>();
        wellNumericalAndTextParameters.add("Barwa");
        wellNumericalAndTextParameters.add("Smak");
        wellNumericalAndTextParameters.add("Jakość");
        wellNumericalAndTextParameters.add("pH");
        wellNumericalAndTextParameters.add("Twardość węglanowa [mg/l]");
        wellNumericalAndTextParameters.add("Twardość ogólna [mg/l]");
        wellNumericalAndTextParameters.add("Żelazo [µg/l]");
        wellNumericalAndTextParameters.add("Mangan [µg/l]");
        wellNumericalAndTextParameters.add("Azotyny [mg/l]");
        wellNumericalAndTextParameters.add("Azotany [mg/l]");
        wellNumericalAndTextParameters.add("Chlorki [mg/l]");
        wellNumericalAndTextParameters.add("Siarczany [mg/l]");
        wellNumericalAndTextParameters.add("Radon [Bq/1]");

        for (int i = 0; i < 5; i++) {
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).toInstant()),
                    List.of(
                    new SingleReadingEntity("Glin (Al) [µg/l]", "300", ParameterType.NUMBER),
                    new SingleReadingEntity("Jon amonu [mg/l]", "0.55", ParameterType.NUMBER),
                    new SingleReadingEntity("Barwa", "Akceptowalna przez konsumentów", ParameterType.TEXT),
                    new SingleReadingEntity("Chlorki [mg/l]", "150", ParameterType.NUMBER),
                    new SingleReadingEntity("Mangan [µg/l]", "55", ParameterType.NUMBER),
                    new SingleReadingEntity("Żelazo [µg/l]", "220", ParameterType.NUMBER))));
        }

        for (int i = 0; i < 3; i++) {
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).minusDays(2).toInstant()),
                    List.of(
                    new SingleReadingEntity("Glin (Al) [µg/l]", "200", ParameterType.NUMBER),
                    new SingleReadingEntity("Jon amonu [mg/l]", "0.50", ParameterType.NUMBER),
                    new SingleReadingEntity("Barwa", "Akceptowalna przez konsumentów", ParameterType.TEXT),
                    new SingleReadingEntity("Chlorki [mg/l]", "250", ParameterType.NUMBER),
                    new SingleReadingEntity("Mangan [µg/l]", "50", ParameterType.NUMBER),
                    new SingleReadingEntity("Żelazo [µg/l]", "200", ParameterType.NUMBER))));
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).minusDays(2).toInstant()),
                    List.of(
                    new SingleReadingEntity("Bromodichlorometan [mg/l]", "0.015", ParameterType.NUMBER),
                    new SingleReadingEntity("Chlor wolny [mg/l]", "0.3", ParameterType.NUMBER),
                    new SingleReadingEntity("Chloraminy [mg/l]", "0.5", ParameterType.NUMBER),
                    new SingleReadingEntity("Σ chloranów i chlorynów [mg/l]", "0.7", ParameterType.NUMBER),
                    new SingleReadingEntity("Ozon [mg/l]", "0.05", ParameterType.NUMBER),
                    new SingleReadingEntity("Trichlorometan (chloroform) [mg/l]", "0.030", ParameterType.NUMBER))));
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).minusDays(2).toInstant()),
                    List.of(
                    new SingleReadingEntity("Magnez [mg/l]", "105", ParameterType.NUMBER),
                    new SingleReadingEntity("Srebro [mg/l]", "0.010", ParameterType.NUMBER),
                    new SingleReadingEntity("Twardość [mg/l]", "300", ParameterType.NUMBER))));
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).minusDays(2).toInstant()),
                    List.of(
                    new SingleReadingEntity("Radon [Bq/1]", "100", ParameterType.NUMBER),
                    new SingleReadingEntity("Tryt [Bq/1]", "100", ParameterType.NUMBER))));
            readingsDao.save(new ReadingEntity(spotId1,
                    Date.from(OffsetDateTime.now().minus(i, ChronoUnit.HOURS).minusDays(2).toInstant()),
                    List.of(
                    new SingleReadingEntity("Escherichia coli [l. mikroorganizmów jtk lub NPL w próbce 100ml]", "0", ParameterType.NUMBER),
                    new SingleReadingEntity("Enterokoki [l. mikroorganizmów jtk lub NPL w próbce 100ml]", "0", ParameterType.NUMBER))));
        }
        for (int j = 0; j < 30; j++) {
            for (int i = 0; i < 3; i++) {
                readingsDao.save(new ReadingEntity(spotId1,
                        Date.from(OffsetDateTime.now().minus(j, ChronoUnit.HOURS).minusDays(4).toInstant()),
                        List.of(
                        new SingleReadingEntity("Glin (Al) [µg/l]", "200", ParameterType.NUMBER),
                        new SingleReadingEntity("Jon amonu [mg/l]", "0.50", ParameterType.NUMBER),
                        new SingleReadingEntity("Barwa", "Akceptowalna przez konsumentów", ParameterType.TEXT),
                        new SingleReadingEntity("Chlorki [mg/l]", "250", ParameterType.NUMBER),
                        new SingleReadingEntity("Mangan [µg/l]", "50", ParameterType.NUMBER),
                        new SingleReadingEntity("Żelazo [µg/l]", "200", ParameterType.NUMBER))));
            }
            for (int i = 0; i < 3; i++) {
                readingsDao.save(new ReadingEntity(spotId1,
                        Date.from(OffsetDateTime.now().minus(j, ChronoUnit.HOURS).minusDays(5).toInstant()),
                        List.of(
                        new SingleReadingEntity("Escherichia coli [l. mikroorganizmów jtk lub NPL w próbce 100ml]", "0", ParameterType.NUMBER),
                        new SingleReadingEntity("Enterokoki [l. mikroorganizmów jtk lub NPL w próbce 100ml]", "0", ParameterType.NUMBER))));
            }
        }

        for (int j = 0; j < 30; j++) {
            for (int i = 0; i < 3; i++) {
                readingsDao.save(new ReadingEntity(spotId2,
                        Date.from(OffsetDateTime.now().minus(j, ChronoUnit.HOURS).minusDays(2).toInstant()),
                        List.of(
                        new SingleReadingEntity("Glin (Al) [µg/l]", String.valueOf(j*10), ParameterType.NUMBER),
                        new SingleReadingEntity("Jon amonu [mg/l]", "0.50", ParameterType.NUMBER),
                        new SingleReadingEntity("Barwa", "Akceptowalna przez konsumentów", ParameterType.TEXT),
                        new SingleReadingEntity("Chlorki [mg/l]", "250", ParameterType.NUMBER),
                        new SingleReadingEntity("Mangan [µg/l]", "50", ParameterType.NUMBER),
                        new SingleReadingEntity("Żelazo [µg/l]", "200", ParameterType.NUMBER))));
            }
            for (int i = 0; i < 3; i++) {
                readingsDao.save(new ReadingEntity(spotId2,
                        Date.from(OffsetDateTime.now().minus(j, ChronoUnit.HOURS).minusDays(5).toInstant()),
                        List.of(
                        new SingleReadingEntity("Escherichia coli [l. mikroorganizmów jtk lub NPL w próbce 100ml]", String.valueOf(i), ParameterType.NUMBER),
                        new SingleReadingEntity("Enterokoki [l. mikroorganizmów jtk lub NPL w próbce 100ml]", String.valueOf(j), ParameterType.NUMBER))));
            }
        }

        for (int j = 0; j < 8; j++) {
            List<SingleReadingEntity> singleReadings = new ArrayList<>();
            for (String parameter : wellNumericalParameters) {
                int randomValue = random.nextInt(35 - 18 + 1) + 18;
                singleReadings.add(new SingleReadingEntity(parameter, String.valueOf(randomValue), ParameterType.NUMBER));
            }

            readingsDao.save(new ReadingEntity(spotId4, DateUtil.now(), singleReadings));
            readingsDao.save(new ReadingEntity(spotId3, DateUtil.now(), singleReadings));
        }

        for (int j = 0; j < 8; j++) {
            List<SingleReadingEntity> singleReadings = new ArrayList<>();
            for (int i = 0; i < wellNumericalAndTextParameters.size(); i++) {
                String parameter = wellNumericalAndTextParameters.get(i);
                switch (parameter) {
                    case "Jakość" -> {
                        singleReadings.add(new SingleReadingEntity(parameter, "Dobra", ParameterType.TEXT));
                    }
                    case "Barwa" -> {
                        singleReadings.add(new SingleReadingEntity(parameter, "Zielonkawa", ParameterType.TEXT));
                    }
                    case "Smak" -> {
                        singleReadings.add(new SingleReadingEntity(parameter, "Akcepotwalny", ParameterType.TEXT));
                    }
                    default -> {
                        int randomValue = random.nextInt(35 - 18 + 1) + 18;
                        singleReadings
                                .add(new SingleReadingEntity(parameter, String.valueOf(randomValue), ParameterType.NUMBER));
                    }
                }
            }

            readingsDao.save(new ReadingEntity(spotId4, DateUtil.now(), singleReadings));
        }
    }
}
