import API from "./axiosConfig";

const API_URL = "/profesores";

export const fetchProfesoresService = async () => {
    const response = await API.get(API_URL);
    return response.data;
};

export const addProfesorService = async (profesor) => {
    const response = await API.post(API_URL, profesor, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const updateProfesorService = async (id, profesorData) => {
    const response = await API.put(`${API_URL}/${id}`, profesorData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteProfesorService = async (id) => {
    await API.delete(`${API_URL}/${id}`);
};

