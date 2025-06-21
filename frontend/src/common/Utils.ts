import SpotService from "../services/spots/SpotService.ts";
import EventBus from "./EventBus.ts";
import dayjs from 'dayjs';

export const formatTimestamp = (timestamp: number) => {
    const date = dayjs(timestamp);
    return date.format('DD/MM/YYYY HH:mm');
};

export const getSpotName = async (spotId: any, setSpotName: any) => {
    await SpotService.getSpotById(spotId).then(
        (response) => {
            setSpotName(response.data.name);
        }
    ).catch((error) => {
        if (error.response && error.response.status === 401) {
            EventBus.dispatch("refresh");
            location.reload();
        }
    });
}