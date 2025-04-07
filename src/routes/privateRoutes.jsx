import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
        console.warn("🔴 No hay token, redirigiendo al login...");
        return <Navigate to="/" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.Rol; 

        if (!allowedRoles.includes(userRole)) {
            console.warn("🔴 Acceso denegado para el rol:", userRole);
            return <Navigate to="/unauthorized" />;
        }

        return children;
    } catch (error) {
        console.error("🔴 Error al decodificar el token:", error);
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;
