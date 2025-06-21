import axios from "../../api/axiosConfig.ts"
import authHeader from "../users/AuthHeader.ts";

const addImages = (spotId: string | undefined, data: FormData) => {
    return axios.post(`/images/${spotId}`,
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
};

const getImages = (spotId: string | undefined) => {
    return axios.get(`/images/${spotId}`,
        {
            headers: authHeader(),
        });
};

const deleteImage = (id: string | undefined) => {
    return axios.delete(`/images/${id}`,
        {
            headers: authHeader()
        });
};

const ImageService = {
    addImages,
    getImages,
    deleteImage
}
export default ImageService