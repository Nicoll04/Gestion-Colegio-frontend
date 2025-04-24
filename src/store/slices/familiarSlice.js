import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import familiaresService from "../../services/familiarService";

// Thunks para manejar peticiones asincrónicas
export const fetchFamiliares = createAsyncThunk(
  "familiares/fetchFamiliares",
  async (_, { rejectWithValue }) => {
    try {
      return await familiaresService.getFamiliares();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFamiliar = createAsyncThunk(
  "familiares/addFamiliar",
  async (familiarData, { rejectWithValue }) => {
    try {
      return await familiaresService.addFamiliar(familiarData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFamiliar = createAsyncThunk(
  "familiares/updateFamiliar",
  async ({ id, familiarData }, { rejectWithValue }) => {
    try {
      return await familiaresService.updateFamiliar(id, familiarData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFamiliar = createAsyncThunk(
  "familiares/deleteFamiliar",
  async (id, { rejectWithValue }) => {
    try {
      await familiaresService.deleteFamiliar(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asociarFamiliarEstudiante = createAsyncThunk(
  "familiares/asociarFamiliarEstudiante",
  async ({ ID_Familiar, ID_Estudiante }, { rejectWithValue }) => {
    try {
      return await familiaresService.asociarFamiliarEstudiante(ID_Familiar, ID_Estudiante);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const buscarFamiliarPorDocumentoOCelular = createAsyncThunk(
  "familiares/buscarFamiliarPorDocumentoOCelular",
  async ({ Nro_Documento, Celular }, { rejectWithValue }) => {
    try {
      return await familiaresService.buscarFamiliarPorDocumentoOCelular(Nro_Documento, Celular);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const familiaresSlice = createSlice({
  name: "familiares",
  initialState: {
    familiares: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamiliares.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamiliares.fulfilled, (state, action) => {
        state.loading = false;
        state.familiares = action.payload;
      })
      .addCase(fetchFamiliares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener familiares";
      })
      .addCase(addFamiliar.fulfilled, (state, action) => {
        state.familiares.push(action.payload);
      })
      .addCase(addFamiliar.rejected, (state, action) => {
        state.error = action.payload || "Error al agregar familiar";
      })
      .addCase(updateFamiliar.fulfilled, (state, action) => {
        const index = state.familiares.findIndex(
          (f) => f.ID_Familiar === action.payload.ID_Familiar
        );
        if (index !== -1) {
          state.familiares[index] = action.payload;
        }
      })
      .addCase(updateFamiliar.rejected, (state, action) => {
        state.error = action.payload || "Error al actualizar familiar";
      })
      .addCase(deleteFamiliar.fulfilled, (state, action) => {
        state.familiares = state.familiares.filter(
          (f) => f.ID_Familiar !== action.payload
        );
      })
      .addCase(deleteFamiliar.rejected, (state, action) => {
        state.error = action.payload || "Error al eliminar familiar";
      })
      .addCase(asociarFamiliarEstudiante.rejected, (state, action) => {
        state.error = action.payload || "Error al asociar familiar con estudiante";
      })
      .addCase(buscarFamiliarPorDocumentoOCelular.rejected, (state, action) => {
        state.error = action.payload || "Error al buscar familiar existente";
      });
  },
});

export default familiaresSlice.reducer;
