import axios from "axios";

// Assuming backend is running on port 8002 as per recent setup
const API_URL = "http://localhost:8002/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const auth = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return api.post("/auth/token", params);
    },
    register: async (email, password) => {
        return api.post("/auth/register", {
            email,
            password_hash: password
        });
    },
};

export const products = {
    list: async () => api.get("/products"),
};

export default api;
