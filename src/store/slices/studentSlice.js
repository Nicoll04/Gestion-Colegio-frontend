import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import studentsService from "../../services/studentsService";

// Obtener todos los estudiantes con familiares
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await studentsService.getStudentsWithFamiliares();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Crear estudiante
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const newStudent = await studentsService.addStudent(studentData);
      return newStudent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Actualizar estudiante
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const updatedStudent = await studentsService.updateStudent(id, studentData);
      return updatedStudent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar estudiante
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id, { rejectWithValue }) => {
    try {
      await studentsService.deleteStudent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener los estudiantes";
      })

      // ADD
      .addCase(addStudent.fulfilled, (state, action) => {
        if (action.payload && action.payload.ID_estudiante) {
          state.students.push(action.payload);
        }
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.error = action.payload || "Error al agregar estudiante";
      })

      // UPDATE
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.students = state.students.map((s) =>
          s.ID_estudiante === action.payload.ID_estudiante ? action.payload : s
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.error = action.payload || "Error al actualizar estudiante";
      })

      // DELETE
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.ID_estudiante !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.error = action.payload || "Error al eliminar estudiante";
      });
  },
});

export default studentsSlice.reducer;
