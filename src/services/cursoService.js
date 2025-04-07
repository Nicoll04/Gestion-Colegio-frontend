import API from "./axiosConfig";

const API_URL = "/cursos"; 

export const fetchCursosService = async () => {
    const response = await API.get(API_URL);
    return response.data;
};

export const fetchEstudiantesByCurso = async (idCurso) => {
    const response = await API.get(`${API_URL}/${idCurso}/estudiantes`);
    return response.data;
};

export const fetchCursoById = async (id) => {
    try {
        const response = await API.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener curso:", error);
        throw error;
    }
};

export const addCursoService = async (curso) => {
    const response = await API.post(API_URL, curso);
    return response.data;
};

export const updateCursoService = async (id, cursoData) => {
    const response = await API.put(`${API_URL}/${id}`, cursoData);
    return response.data;
};

export const deleteCursoService = async (id) => {
    await API.delete(`${API_URL}/${id}`);
};
