package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.utils.DateUtil;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final static String WRONG_DATE_ERROR = " znajdują się błędne dane (źle wprowadzona data)";
    private final static String WRONG_READING_VALUE_ERROR = " znajdują się błędne dane (brak parametru lub wartości)";
    private final static String NO_DATA_ERROR = ": brak daty lub danych";
    private final ReadingsService readingsService;

    public void processExcelFile(MultipartFile file, UUID spotID) throws IllegalArgumentException, IOException {
        Date date;
        final List<ReadingEntity> fileReadings = new ArrayList<>();
        final List<SingleReadingEntity> readings = new ArrayList<>();
        final Workbook workbook = new XSSFWorkbook(file.getInputStream());

        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            date = null;
            for (Row row : sheet) {
                if (checkForDate(row)) {
                    if (isCurrentDataCorrect(date, readings)) {
                        addReadingsToFinalList(fileReadings, spotID, date, readings);
                    }
                    try {
                        final LocalDateTime localDateTime = row.getCell(0).getLocalDateTimeCellValue();
                        date = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
                    } catch (RuntimeException e) {
                        workbook.close();
                        throw new RuntimeException(file.getOriginalFilename()
                                + " arkusz: " + sheet.getSheetName()
                                + " linia: " + (row.getRowNum() + 1)
                                + WRONG_DATE_ERROR);
                    }
                } else if (isRowEmpty(row)) {
                    continue;
                } else if (row.getPhysicalNumberOfCells() == 2) {
                    if (!Objects.equals(row.getCell(0), null)
                            && !Objects.equals(row.getCell(1), null)
                            && !Objects.equals(row.getCell(0).toString(), "")
                            && !Objects.equals(row.getCell(1).toString(), "")) {
                        readings.add(createSingleReading(row));
                    } else {
                        workbook.close();
                        throw new IllegalArgumentException(file.getOriginalFilename()
                                + " arkusz: " + sheet.getSheetName()
                                + " linia: " + (row.getRowNum() + 1)
                                + WRONG_READING_VALUE_ERROR);
                    }
                } else {
                    workbook.close();
                    throw new IllegalArgumentException(file.getOriginalFilename()
                            + " arkusz: " + sheet.getSheetName()
                            + " linia: " + (row.getRowNum() + 1));
                }
            }

            if (isCurrentDataCorrect(date, readings)) {
                addReadingsToFinalList(fileReadings, spotID, date, readings);
            } else {
                workbook.close();
                throw new IllegalArgumentException(file.getOriginalFilename() + NO_DATA_ERROR);
            }
            if (i == workbook.getNumberOfSheets() - 1) {
                addReadingsToDatabase(fileReadings);
            }
        }
        workbook.close();
    }

    private boolean checkForDate(Row row) {
        return row.getPhysicalNumberOfCells() == 2 && Objects.equals(row.getCell(1).toString(), "-");
    }

    private void addReadingsToFinalList(List<ReadingEntity> fileReadings, UUID spotID, Date date, List<SingleReadingEntity> readings) {
        fileReadings.add(new ReadingEntity(spotID, date, new ArrayList<>(readings)));
        readings.clear();
    }

    private void addReadingsToDatabase(List<ReadingEntity> fileReadings) {
        readingsService.addReadings(fileReadings);
    }

    private SingleReadingEntity createSingleReading(Row row) {
        ParameterType parameterType = DateUtil.isNumeric(row.getCell(1).toString()) ?
                ParameterType.NUMBER : ParameterType.TEXT;
        return new SingleReadingEntity(row.getCell(0).toString(), row.getCell(1).toString(), parameterType);
    }

    private boolean isCurrentDataCorrect(Date date, List<SingleReadingEntity> readings) {
        return date != null && !readings.isEmpty();
    }

    private boolean isRowEmpty(Row row) {
        return (Objects.equals(row.getCell(0), null) || Objects.equals(row.getCell(0).toString(), ""))
                && (Objects.equals(row.getCell(0), null) || Objects.equals(row.getCell(0).toString(), ""));
    }
}
