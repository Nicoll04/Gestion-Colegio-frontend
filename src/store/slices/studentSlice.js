import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import studentsService from "../../services/studentsService";


// Thunks para manejar peticiones asincrónicas
export const fetchStudents = createAsyncThunk("students/fetchStudents", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await fetch("http://localhost:5000/api/estudiantes/con-familiares", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No autorizado o error en la API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const addStudent = createAsyncThunk("students/addStudent", async (studentData) => {
  const newStudent = await studentsService.addStudent(studentData);
  return newStudent; 
});

export const updateStudent = createAsyncThunk("students/updateStudent", async ({ id, studentData }) => {
  const updatedStudent = await studentsService.updateStudent(id, studentData);
  return updatedStudent;
});

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id) => {
  await studentsService.deleteStudent(id);
  return id;
});

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
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload; 
      })      
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        if (action.payload && action.payload.ID_estudiante) {
          state.students.push(action.payload);
        }
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.students = state.students.map((s) =>
          s.ID_estudiante === action.payload.ID_estudiante ? action.payload : s
        );
      })
      
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.ID_estudiante !== action.payload);
      });
  },
});

export default studentsSlice.reducer;
