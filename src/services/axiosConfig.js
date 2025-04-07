import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", 
});

// Interceptor para agregar el token automáticamente en cada petición
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar tokens expirados o errores de autenticación
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error("Token expirado o no autorizado. Cerrando sesión...");
            localStorage.removeItem("token");
            window.location.href = "/"; // Redirige al login si el token no es válido
        }
        return Promise.reject(error);
    }
);

export default API;
