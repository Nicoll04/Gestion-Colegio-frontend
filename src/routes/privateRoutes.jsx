import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
console.log("jwtDecode importado:", jwtDecode);

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
        console.warn("🔴 No hay token, redirigiendo al login...");
        return <Navigate to="/" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        console.log("✅ Decoded token:", decodedToken);

        // 🔍 Validación de expiración
        const currentTime = Date.now() / 1000;
        console.log("⏳ Exp:", new Date(decodedToken.exp * 1000));
        console.log("🕒 Now:", new Date());

        if (decodedToken.exp < currentTime) {
            console.warn("⚠️ Token expirado. Cerrando sesión...");
            localStorage.clear();
            sessionStorage.clear();
            return <Navigate to="/" />;
        }

        const userRole = decodedToken.Rol || decodedToken.rol || decodedToken.role;

        if (!allowedRoles.includes(userRole)) {
            console.warn("🔴 Acceso denegado para el rol:", userRole);
            return <Navigate to="/unauthorized" />;
        }

        return children;
    } catch (error) {
        console.error("🔴 Error al decodificar el token:", error);
        localStorage.clear();
        sessionStorage.clear();
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;
