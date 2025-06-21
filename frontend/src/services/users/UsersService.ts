import axios from "../../api/axiosConfig.ts"
import authHeader from "../users/AuthHeader.ts";
import UserEntity from "../../constants/users/UserEntity.ts";
import FormEntity from "../../constants/inputs/forms/FormEntity.ts";
import {UserAuthDto} from "../../constants/users/UserAuthDto.ts";

const getUsers = () => {
    return axios.get<Array<UserEntity>>(
        "/users/list",
        {headers: authHeader()}
    );
}

const getUserById = (userId: string | undefined) => {
    return axios.get(
        `/users/${userId}`,
        {headers: authHeader()}
    )
}

const updateUser = (user: UserEntity) => {
    return axios.put<UserAuthDto>(
        "/users/update",
        user,
        {
            headers: authHeader()
        }
    );
}

const changePassword = (user: UserAuthDto) => {
    return axios.put<UserAuthDto>(
        "/users/updatePassword",
        user,
        {
            headers: authHeader()
        }
    );
}

const deleteUserById = (userId: string | undefined) => {
    return axios.delete<FormEntity>(
        `/users/${userId}`,
        {
            headers: authHeader()
        }
    );
}

const UsersService = {
    getUsers,
    getUserById,
    updateUser,
    changePassword,
    deleteUserById
}

export default UsersService;