// services -- functions to communicate with backend, just send data in parameters and function will communicate with backend using this data, reduce redundancy (whenever we need to communicate with backend)

// no need to specify .js extension (Vite module will take care of it)
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred'};
    }
};

const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.resgister?.data || { message: "An unknown error occurred" };
    }
};


const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        throw error.resgister?.data || { message: "An unknown error occurred" };
    }
};

const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, userData);
        return response.data;
    } catch (error) {
        throw error.resgister?.data || { message: "An unknown error occurred" };
    }
};

const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.GET_PROFILE, passwords);
        return response.data;
    } catch (error) {
        throw error.resgister?.data || { message: "An unknown error occurred" };
    }
};

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword
};

export default authService;