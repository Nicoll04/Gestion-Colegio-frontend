import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./privateRoutes";
import EstudiantesPage from "../pages/estudiantesPage";
import FamiliaresPage from "../pages/familiarPage";
import ProfesoresPage from "../pages/profesorPage";
import CursosPage from "../pages/cursosPage";
import Register from "../pages/Register";
import StudentDetailPage from "../pages/EstudianteDetailsPage";
import FamiliarDetailPage from "../pages/FamiliaDetailsPage";
import ProfesorDetailPage from "../pages/ProfesoresDetailsPage";
import EstudiantesCursoPage from "../pages/cursoListaPage";
import StudentTable from "../Componentes/studentTable";
import FamiliaresTable from "../Componentes/FamiliarTable";
import ProfesoresLista from "../Componentes/ProfesoresTable";
import UnauthorizedPage from "../pages/Unauthorized"; 
import SeleccionarRolPage from "../pages/SeleccionarRolPage";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/seleccionar-rol" element={<SeleccionarRolPage />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/estudiantes" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <EstudiantesPage />
          </PrivateRoute>
        } />

        <Route path="/familiares" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <FamiliaresPage />
          </PrivateRoute>
        } />

        <Route path="/profesores" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <ProfesoresPage />
          </PrivateRoute>
        } />

        <Route path="/cursos" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <CursosPage />
          </PrivateRoute>
        } />

        <Route path="/estudiante/:id" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <StudentDetailPage />
          </PrivateRoute>
        } />

        <Route path="/familiares/:id" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <FamiliarDetailPage />
          </PrivateRoute>
        } />

        <Route path="/profesores/detalles/:id" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <ProfesorDetailPage />
          </PrivateRoute>
        } />

        <Route path="/cursos/:id/estudiantes" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaría"]}>
            <EstudiantesCursoPage />
          </PrivateRoute>
        } />

        <Route path="/estudiantes/registrados" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <StudentTable />
          </PrivateRoute>
        } />

        <Route path="/tabla-familiares" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <FamiliaresTable />
          </PrivateRoute>
        } />

        <Route path="/profesores-lista" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <ProfesoresLista />
          </PrivateRoute>
        } />

        <Route path="/profesores/editar/:id" element={
          <PrivateRoute allowedRoles={["admin", "coordinacion", "secretaria"]}>
            <ProfesoresPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

