import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axiosConfig";

const API_URL = "/auth";

// Login tradicional
export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await API.post(`${API_URL}/login`, userData);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.rol);
        return { token: response.data.token, rol: response.data.rol };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Registro usuario
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        const response = await API.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// *** NUEVO: Login con Google ***
export const loginWithGoogle = createAsyncThunk(
    "auth/loginGoogle",
    async (credential, thunkAPI) => {
        try {
            const response = await API.post(`${API_URL}/google-token`, { credential });
            // Guardar token y datos
            localStorage.setItem("token", response.data.token);
            if (response.data.rol) localStorage.setItem("userRole", response.data.rol);
            if (response.data.nombre) localStorage.setItem("userName", response.data.nombre);
            if (response.data.correo) localStorage.setItem("userEmail", response.data.correo);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error en login Google");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token") || null,
        rol: localStorage.getItem("userRole") || null,
        loading: false,
        error: null,
        successMessage: null,
        isNewUser: false,  // Para saber si debe seleccionar rol
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.rol = null;
            state.isNewUser = false;
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
        },
        setAuth: (state, action) => {
            state.token = action.payload.token;
            state.rol = action.payload.rol;
            state.user = action.payload.nombre || null;
            state.isNewUser = false;
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
                state.error = null;
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
            })
            // Cases para loginGoogle
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.rol = action.payload.rol || null;
                state.user = action.payload.nombre || null;
                // Si no tiene rol asignado, marcar como usuario nuevo
                state.isNewUser = !action.payload.rol;
                state.error = null;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Error en login con Google";
            });
    },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
