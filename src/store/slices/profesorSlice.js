import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProfesoresService,
  addProfesorService,
  updateProfesorService,
  deleteProfesorService,
} from "../../services/profesorService";

// Thunks para realizar peticiones al backend
export const fetchProfesores = createAsyncThunk(
  "profesores/fetchProfesores",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchProfesoresService();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProfesor = createAsyncThunk(
  "profesores/addProfesor",
  async (profesor, { rejectWithValue }) => {
    try {
      const response = await addProfesorService(profesor);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfesor = createAsyncThunk(
  "profesores/updateProfesor",
  async ({ id, profesorData }, { rejectWithValue }) => {
    try {
      const response = await updateProfesorService(id, profesorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProfesor = createAsyncThunk(
  "profesores/deleteProfesor",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProfesorService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice de profesores
const profesorSlice = createSlice({
  name: "profesores",
  initialState: {
    profesores: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfesores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfesores.fulfilled, (state, action) => {
        state.loading = false;
        state.profesores = action.payload;
      })
      .addCase(fetchProfesores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener profesores";
      })
      .addCase(addProfesor.fulfilled, (state, action) => {
        state.profesores.push(action.payload);
      })
      .addCase(addProfesor.rejected, (state, action) => {
        state.error = action.payload || "Error al agregar profesor";
      })
      .addCase(updateProfesor.fulfilled, (state, action) => {
        state.profesores = state.profesores.map((profesor) =>
          profesor.ID_Profesores === action.payload.ID_Profesores ? action.payload : profesor
        );
      })
      .addCase(updateProfesor.rejected, (state, action) => {
        state.error = action.payload || "Error al actualizar profesor";
      })
      .addCase(deleteProfesor.fulfilled, (state, action) => {
        state.profesores = state.profesores.filter(
          (profesor) => profesor.ID_Profesores !== action.payload
        );
      })
      .addCase(deleteProfesor.rejected, (state, action) => {
        state.error = action.payload || "Error al eliminar profesor";
      });
  },
});

export default profesorSlice.reducer;
