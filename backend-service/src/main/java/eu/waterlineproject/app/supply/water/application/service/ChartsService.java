package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.model.charts.DataPoint;
import eu.waterlineproject.app.supply.water.model.forms.ParameterType;
import eu.waterlineproject.app.supply.water.model.reading.ReadingEntity;
import eu.waterlineproject.app.supply.water.model.reading.singlereading.SingleReadingEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@AllArgsConstructor
@Service
@Transactional
public class ChartsService {

    ReadingsService readingsService;

    public List<String> getChartKeys(UUID spotID) {
        List<ReadingEntity> readingEntities = readingsService.findDistinctReadingsParameterBySpotId(spotID);
        Set<String> distinctParameters = new HashSet<>();

        for (ReadingEntity readingEntity : readingEntities) {
            List<SingleReadingEntity> singleReadings = readingEntity.getReadings();
            for (SingleReadingEntity singleReading : singleReadings) {
                if (singleReading.parameterType() == ParameterType.NUMBER) {
                    distinctParameters.add(singleReading.parameter());
                }
            }
        }
        return distinctParameters.stream().toList();
    }

    public List<String> getSelectedChartKeys(UUID spotID, List<String> selectedKeys) {
        List<ReadingEntity> readingEntities = readingsService.findDistinctReadingsParameterBySpotId(spotID);
        Set<String> distinctNumericParameters = new HashSet<>();

        for (ReadingEntity readingEntity : readingEntities) {
            List<SingleReadingEntity> singleReadings = readingEntity.getReadings();
            for (SingleReadingEntity singleReading : singleReadings) {
                if (singleReading.parameterType() == ParameterType.NUMBER && selectedKeys.contains(singleReading.parameter())) {
                    distinctNumericParameters.add(singleReading.parameter());
                }
            }
        }
        return distinctNumericParameters.stream().toList();
    }

    public List<DataPoint> getChartData(UUID spotID, String key) {
        List<ReadingEntity> readingEntities = readingsService.findByReadingsParameter(spotID, key);

        List<DataPoint> dataPoints = new ArrayList<>();

        for (ReadingEntity readingEntity : readingEntities) {
            List<SingleReadingEntity> singleReadings = readingEntity.getReadings();
            for (SingleReadingEntity singleReading : singleReadings) {
                if (key.equals(singleReading.parameter())) {
                    DataPoint dataPoint;
                    try {
                        dataPoint = new DataPoint(readingEntity.getTimestamp().getTime(), Integer.parseInt(singleReading.parameterValue()));
                    } catch (NumberFormatException | NullPointerException e) {
                        dataPoint = new DataPoint(readingEntity.getTimestamp().getTime(), 0);
                    }
                    dataPoints.add(dataPoint);
                }
            }
        }
        return dataPoints;
    }

    public List<DataPoint> getPeriodicChartData(UUID spotID, String key, Date startDate, Date endDate) {
        List<ReadingEntity> readingEntities = readingsService.findByReadingsParameterAndDateBetween(spotID, key, startDate, endDate);

        List<DataPoint> dataPoints = new ArrayList<>();
        for (ReadingEntity readingEntity : readingEntities) {
            List<SingleReadingEntity> singleReadings = readingEntity.getReadings();
            for (SingleReadingEntity singleReading : singleReadings) {
                if (key.equals(singleReading.parameter())) {
                    DataPoint dataPoint;
                    try {
                        dataPoint = new DataPoint(readingEntity.getTimestamp().getTime(), Float.parseFloat(singleReading.parameterValue().replace(',', '.')));
                        dataPoints.add(dataPoint);
                    } catch (NumberFormatException | NullPointerException ignored) {}
                }
            }
        }
        return dataPoints;
    }
}
