import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import studentsReducer from "./slices/studentSlice";
import familiaresReducer from "./slices/familiarSlice";
import profesorReducer from "./slices/profesorSlice";
import cursosReducer from "./slices/cursoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
    familiares: familiaresReducer,
    profesores: profesorReducer,
    cursos: cursosReducer,
  },
});


export default store;

