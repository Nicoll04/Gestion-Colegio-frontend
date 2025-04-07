import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCursosService,
  addCursoService,
  updateCursoService,
  deleteCursoService,
} from "../../services/cursoService";

// Obtener todos los cursos
export const fetchCursos = createAsyncThunk(
  "cursos/fetchCursos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCursosService();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Agregar nuevo curso
export const addCurso = createAsyncThunk(
  "cursos/addCurso",
  async (curso, { rejectWithValue }) => {
    try {
      const response = await addCursoService(curso);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Actualizar curso existente
export const updateCurso = createAsyncThunk(
  "cursos/updateCurso",
  async ({ id, cursoData }, { rejectWithValue }) => {
    try {
      const response = await updateCursoService(id, cursoData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar curso
export const deleteCurso = createAsyncThunk(
  "cursos/deleteCurso",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice de cursos
const cursoSlice = createSlice({
  name: "cursos",
  initialState: {
    cursos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursos.fulfilled, (state, action) => {
        state.loading = false;
        state.cursos = action.payload;
      })
      .addCase(fetchCursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener los cursos";
      })
      .addCase(addCurso.fulfilled, (state, action) => {
        state.cursos.push(action.payload);
      })
      .addCase(updateCurso.fulfilled, (state, action) => {
        state.cursos = state.cursos.map((curso) =>
          curso.ID_Curso === action.payload.ID_Curso ? action.payload : curso
        );
      })
      .addCase(deleteCurso.fulfilled, (state, action) => {
        state.cursos = state.cursos.filter(
          (curso) => curso.ID_Curso !== action.payload
        );
      });
  },
});

export default cursoSlice.reducer;
