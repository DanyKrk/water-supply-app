import axios from "../../api/axiosConfig.ts";
import SingleReadingEntity from "../../constants/common/SingleReadingEntity.ts";
import authHeader from "../users/AuthHeader.ts";

const addReading = (
    spotId: string | undefined,
    readings: Array<SingleReadingEntity>
) => {
    return axios.post(`/readings/${spotId}`, readings,
        {
            headers: authHeader(),
        });
};

const uploadReadings = (spotId: string | undefined, data: FormData) => {
    return axios.post(`/readings/${spotId}/upload`, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
};

const updateReading = (
    readingId: string | undefined,
    spotId: string | undefined,
    updatedReadings: Array<SingleReadingEntity>
) => {
    return axios.put(`/readings/${spotId}/${readingId}`, updatedReadings,
        {
            headers: authHeader()
        });
};

const deleteReading = (
    readingId: string | undefined,
    spotId: string | undefined
) => {
    return axios.delete(`/readings/${spotId}/${readingId}`,
        {
            headers: authHeader(),
        });
}

const getAllReadings = (
    spotId: string | undefined,
    page: number,
    pageSize: number
) => {
    return axios.get(`/readings/${spotId}/list`,
        {
            params: {
                page: page,
                size: pageSize
            },
            headers: authHeader()
        });
};

const getReadingBySpotIdAndId = (
    spotId: string | undefined,
    id: string | undefined
) => {
    return axios.get(`/readings/${spotId}/${id}`, {
        headers: authHeader()
    });
};

const getChartKeys = (spotId: string | undefined) => {
    return axios.get(`charts/keys`, {
        params: {
            spotID: encodeURIComponent(spotId),
        },
        headers: authHeader()
    });
};

const getSelectedChartKeys = (spotId: string | undefined, selectedColums: Array<String>) => {
    return axios.post(`charts/keys/selected`,
        selectedColums, {
        params: {
            spotID: encodeURIComponent(spotId),
        },
        headers: authHeader()
    });
};

const getChartData = (spotId: string | undefined, key: string | undefined) => {
    return axios.get(`charts`, {
        params: {
            spotID: encodeURIComponent(spotId),
            key: encodeURIComponent(key)
        },
        headers: authHeader()
    });
};

const getPeriodicChartData = (spotId: string | undefined, key: string | undefined, startDateTime: Date | undefined, endDateTime: Date | undefined) => {
    return axios.get(`charts/periodic`, {
        params: {
            spotID: encodeURIComponent(spotId),
            key: encodeURIComponent(key),
            startDateTime: startDateTime,
            endDateTime: endDateTime
        },
        headers: authHeader()
    });
};

const ReadingService = {
    addReading,
    updateReading,
    deleteReading,
    getAllReadings,
    getReadingBySpotIdAndId,
    getChartKeys,
    getChartData,
    getPeriodicChartData,
    uploadReadings,
    getSelectedChartKeys
};

export default ReadingService