import API from "./axiosConfig";

const API_URL = "/estudiantes";

const studentsService = {
    // Obtener todos los estudiantes
    getStudents: async () => {
        const response = await API.get(API_URL);
        return response.data;
    },

    // Obtener un estudiante por ID
    getStudentById: async (id) => {
        const response = await API.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Crear un nuevo estudiante
    addStudent: async (studentData) => {
        const response = await API.post(API_URL, studentData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },

    // Actualizar un estudiante
    updateStudent: async (id, studentData) => {
        const response = await API.put(`${API_URL}/${id}`, studentData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },

    // Eliminar un estudiante
    deleteStudent: async (id) => {
        await API.delete(`${API_URL}/${id}`);
    },
};

export default studentsService;
