import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCursosService,
  addCursoService,
  updateCursoService,
  deleteCursoService,
} from "../../services/cursoService";

// Thunks para realizar peticiones al backend
export const fetchCursos = createAsyncThunk("cursos/fetchCursos", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCursosService();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const addCurso = createAsyncThunk("cursos/addCurso", async (curso) => {
  const response = await addCursoService(curso);
  return response;
});

export const updateCurso = createAsyncThunk("cursos/updateCurso", async ({ id, cursoData }) => {
  const response = await updateCursoService(id, cursoData);
  return response;
});

export const deleteCurso = createAsyncThunk("cursos/deleteCurso", async (id) => {
  await deleteCursoService(id);
  return id;
});

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
        state.cursos = state.cursos.filter((curso) => curso.ID_Curso !== action.payload);
      });
  },
});

export default cursoSlice.reducer;
