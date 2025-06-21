
export enum HistoryEventType {
    ADD_READING = "ADD_READING",
    UPDATE_READING = "UPDATE_READING",
    UPLOAD_READINGS = "UPLOAD_READINGS",
    DELETE_READING = "DELETE_READING",
    OTHER = "OTHER"
}

export default interface HistoryEvent {
    id: string;
    timestamp: Date;
    type: HistoryEventType;
    userName: string;
    metadata: string;
}

export const HistoryEventTypeNames = {
    [HistoryEventType.ADD_READING]: "Dodano odczyt",
    [HistoryEventType.UPDATE_READING]: "Edytowano odczyt",
    [HistoryEventType.UPLOAD_READINGS]: "Dodano odczyty z pliku",
    [HistoryEventType.DELETE_READING]: "Usunięto odczyt",
    [HistoryEventType.OTHER]: "Inne"
}