import axios from "../../api/axiosConfig.ts";
import authHeader from "../users/AuthHeader.ts";

const getHistory = (page: number, pageSize: number) => {
    return axios.get("/history", {
        params: {
            page: page,
            size: pageSize
        },
        headers: authHeader()
    });
}

const HistoryService = {
    getHistory
}

export default HistoryService;