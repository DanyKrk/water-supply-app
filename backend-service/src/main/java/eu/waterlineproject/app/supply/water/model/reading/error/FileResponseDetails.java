package eu.waterlineproject.app.supply.water.model.reading.error;

public record FileResponseDetails(String errorMessage,
                                  int errorCode,
                                  String fileName) {
}