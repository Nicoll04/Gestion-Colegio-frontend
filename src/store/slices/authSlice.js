import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axiosConfig"; 

const API_URL = "/auth"; 

// Acción asíncrona para iniciar sesión
export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await API.post(`${API_URL}/login`, userData);

        // Guardar token y rol en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.rol);

        return { token: response.data.token, rol: response.data.rol };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Acción asíncrona para registrar usuario
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        const response = await API.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token") || null,
        rol: localStorage.getItem("userRole") || null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.rol = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
        },
        setAuth: (state, action) => {
            state.token = action.payload.token;
            state.rol = action.payload.rol;
            state.user = action.payload.nombre || null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.rol = action.payload.rol;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Error en el inicio de sesión";
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload?.message || "Usuario registrado exitosamente";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Error en el registro";
            });
    },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
