import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProfesoresService,
  addProfesorService,
  updateProfesorService,
  deleteProfesorService,
} from "../../services/profesorService";

// Thunks para realizar peticiones al backend
export const fetchProfesores = createAsyncThunk("profesores/fetchProfesores", async () => {
  const response = await fetchProfesoresService();
  return response;
});

export const addProfesor = createAsyncThunk("profesores/addProfesor", async (profesor) => {
  const response = await addProfesorService(profesor);
  return response;
});

export const updateProfesor = createAsyncThunk("profesores/updateProfesor", async ({ id, profesorData }) => {
  const response = await updateProfesorService(id, profesorData);
  return response;
});

export const deleteProfesor = createAsyncThunk("profesores/deleteProfesor", async (id) => {
  await deleteProfesorService(id);
  return id;
});

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
      })
      .addCase(fetchProfesores.fulfilled, (state, action) => {
        state.loading = false;
        state.profesores = action.payload;
      })
      .addCase(fetchProfesores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProfesor.fulfilled, (state, action) => {
        state.profesores.push(action.payload);
      })
      .addCase(updateProfesor.fulfilled, (state, action) => {
        state.profesores = state.profesores.map((profesor) =>
          profesor.ID_Profesores === action.payload.ID_Profesores ? action.payload : profesor
        );
      })
      .addCase(deleteProfesor.fulfilled, (state, action) => {
        state.profesores = state.profesores.filter((profesor) => profesor.ID_Profesores !== action.payload);
      });
  },
});

export default profesorSlice.reducer;
