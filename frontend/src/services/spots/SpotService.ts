import axios from "../../api/axiosConfig.ts"
import authHeader from "../users/AuthHeader.ts";
import CreateSpotRequest from "../../constants/spots/CreateSpotRequest.ts";

const getSpotById = (spotId: string | undefined) => {
    return axios.get(
        `/spots/${spotId}`,
        {headers: authHeader()}
    )
}

const getSpotsPage = (page: number, pageSize: number) => {
    return axios.get(
        "/spots/list",
        {
            params: {
                page: page,
                size: pageSize
            },
            headers: authHeader()
        }
    )
}

const getAllSpots = () => {
    return axios.get(
        "/spots/list",
        {headers: authHeader()}
    )
}

const getSpotsCount = () => {
    return axios.get<number>("/spots/count",
        {headers: authHeader()});
}

const addSpot = (spot: CreateSpotRequest) => {
    return axios.post("/spots", spot,
        {headers: authHeader()});
}

const updateSpot = (spotId: string | undefined, spot: CreateSpotRequest) => {
    return axios.put(`/spots/${spotId}`, spot,
        {headers: authHeader()});
}

const deleteSpot = (spotId: string | undefined) => {
    return axios.delete(
        `/spots/${spotId}`,
        {headers: authHeader()}
    );
}

const SpotService = {
    getSpotById,
    getSpotsPage,
    getAllSpots,
    getSpotsCount,
    addSpot,
    updateSpot,
    deleteSpot
}
export default SpotService