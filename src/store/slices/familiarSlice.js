import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import familiaresService from "../../services/familiarService";

// Thunks para manejar peticiones asincrónicas
export const fetchFamiliares = createAsyncThunk("familiares/fetchFamiliares", async () => {
  return await familiaresService.getFamiliares();
});

export const addFamiliar = createAsyncThunk("familiares/addFamiliar", async (familiarData) => {
  return await familiaresService.addFamiliar(familiarData);
});

export const updateFamiliar = createAsyncThunk("familiares/updateFamiliar", async ({ id, familiarData }) => {
  return await familiaresService.updateFamiliar(id, familiarData);
});

export const deleteFamiliar = createAsyncThunk("familiares/deleteFamiliar", async (id) => {
  await familiaresService.deleteFamiliar(id);
  return id;
});

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
      })
      .addCase(fetchFamiliares.fulfilled, (state, action) => {
        state.loading = false;
        state.familiares = action.payload;
      })      
      .addCase(fetchFamiliares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFamiliar.fulfilled, (state, action) => {
        state.familiares.push(action.payload);
      })
      .addCase(updateFamiliar.fulfilled, (state, action) => {
        const index = state.familiares.findIndex((f) => f.ID_Familiar === action.payload.ID_Familiar);
        if (index !== -1) {
          state.familiares[index] = action.payload;
        }
      })
      .addCase(deleteFamiliar.fulfilled, (state, action) => {
        state.familiares = state.familiares.filter((f) => f.ID_Familiar !== action.payload);
      });
  },
});

export default familiaresSlice.reducer;
