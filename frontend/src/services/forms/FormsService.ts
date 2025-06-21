import axios from "../../api/axiosConfig.ts"
import FormEntity from "../../constants/inputs/forms/FormEntity.ts";
import FormDto from "../../constants/inputs/forms/FormDto.ts";
import authHeader from "../users/AuthHeader.ts";

const getForms = () => {
    const forms = axios.get<Array<FormEntity>>(
        "/forms/list",
        {headers: authHeader()}
    );
    return forms
}

const getFormsByIds = (ids: string[]) => {
    const forms = axios.get<Array<FormEntity>>(
        `/forms/list-by-ids`,
        {
            headers: authHeader(),
            params: {
                ids: ids
            }
        }
    );
    return forms
}

const getFormsBySpotId = (spotId: string | undefined) => {
    const forms = axios.get<Array<FormEntity>>(
        `/forms/${spotId}/list`,
        {headers: authHeader()}
    );
    return forms
}

const addForm = (form: FormDto) => {
    return axios.post<FormEntity>(
        "/forms",
        form,
        {headers: authHeader()}
    );
}

const updateForm = (formId: string, form: FormEntity) => {
    return axios.put<FormEntity>(
        `/forms/${formId}`,
        form,
        {
            headers: authHeader()
        }
    );
}


const deleteForm = (formId: string) => {
    return axios.delete(`/forms/${formId}`,
        {headers: authHeader()})
};

const FormsService = {
    getForms,
    getFormsByIds,
    getFormsBySpotId,
    addForm,
    updateForm,
    deleteForm
}

export default FormsService