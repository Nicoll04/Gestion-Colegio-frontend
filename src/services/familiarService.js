import API from "./axiosConfig";

const API_URL = "/familiares";

const getFamiliares = async () => {
    const response = await API.get(API_URL);
    return response.data;
};

const getFamiliarById = async (id) => {
    const response = await API.get(`${API_URL}/${id}`);
    return response.data;
};

const addFamiliar = async (familiarData) => {
    try {
        const response = await API.post(API_URL, familiarData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al registrar familiar:", error);
        throw error;
    }
};

const updateFamiliar = async (id, familiarData) => {
    const response = await API.put(`${API_URL}/${id}`, familiarData);
    return response.data;
};

const deleteFamiliar = async (id) => {
    await API.delete(`${API_URL}/${id}`);
};

const buscarFamiliarPorDocumentoOCelular = async ({ Nro_Documento, Celular }) => {
    try {
        const response = await API.get(`/familiares/verificar`, {
            params: { Nro_Documento, Celular },
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar familiar:", error);
        throw error;
    }
};

const asociarFamiliarEstudiante = async ({ ID_Familiar, ID_Estudiante }) => {
    try {
        const response = await API.post(`/familiares/asociar`, {
            ID_Familiar,
            ID_Estudiante,
        });
        return response.data;
    } catch (error) {
        console.error("Error al asociar familiar con estudiante:", error);
        throw error;
    }
};


export default {
    getFamiliares,
    getFamiliarById,
    addFamiliar,
    updateFamiliar,
    deleteFamiliar,
    buscarFamiliarPorDocumentoOCelular,
    asociarFamiliarEstudiante,
};
