import axios from "axios";

// ==========================================
// API CONFIGURATION
// ==========================================

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("fittrack_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

API.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("fittrack_token");
            localStorage.removeItem("fittrack_user");
        }

        return Promise.reject(error);
    }
);


// ==========================================
// AUTHENTICATION APIs
// ==========================================

export const registerUser = async (userData) => {
    const response = await API.post(
        "/auth/register",
        userData
    );

    return response.data;
};


export const loginUser = async (loginData) => {
    const response = await API.post(
        "/auth/login",
        loginData
    );

    return response.data;
};


export const getCurrentUser = async () => {
    const response = await API.get("/auth/me");

    return response.data;
};


// ==========================================
// EXPORT API
// ==========================================

export default API;