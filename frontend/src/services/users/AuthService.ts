import axios from "../../api/axiosConfig.ts";
import authHeader from "./AuthHeader.ts";
import {UserRegisterDto} from "../../constants/users/UserRegisterDto.ts";


export const register = (userRegister: UserRegisterDto) => {
    return axios.post("/auth/signup",
        userRegister,
        {headers: authHeader()}
    );
};

export const login = (username: string, password: string) => {
    return axios
        .post("/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refresh", response.data.refreshToken);
            }
            return response.data;
        });
};

const refresh = (refreshToken: string) => {
    return axios
        .post("/auth/refresh", {
            refreshToken
        })
};

export const logout = () => {
    axios.post("/auth/logout", {}, { headers: authHeader() });
    
    localStorage.clear();
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    refresh
}

export default AuthService;