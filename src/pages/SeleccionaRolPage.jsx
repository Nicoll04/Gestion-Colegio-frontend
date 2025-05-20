import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axiosConfig";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";


const SeleccionarRolPage = () => {
    const [rolSeleccionado, setRolSeleccionado] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

  
    const handleSeleccionar = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("No se encontró el token. Vuelve a iniciar sesión.");
            navigate("/login");
            return;
        }

        const res = await API.post("/auth/asignar-rol", { Rol: rolSeleccionado }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.data.token) {
            const rol = res.data.Rol || res.data.rol;

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userRole", rol);

            console.log("Token guardado:", localStorage.getItem("token"));  // <-- aquí

            dispatch(setAuth({
                token: res.data.token,
                rol: rol,
                nombre: res.data.nombre || null
            }));

            setTimeout(() => {
                navigate("/dashboard");
            }, 200);
        }

    } catch (error) {
        console.error("Error asignando rol:", error);
        alert("No se pudo asignar el rol.");
    }
};


    return (
        <div className="container mt-5">
            <h2>Selecciona tu rol</h2>
            <select
                className="form-control my-3"
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
            >
                <option value="">-- Seleccionar --</option>
                <option value="admin">Admin</option>
                <option value="coordinacion">Coordinación</option>
                <option value="secretaria">Secretaria</option>
                <option value="orientacion">Orientación</option>
                <option value="profesor">Profesor</option>
            </select>
            <button className="btn btn-primary" onClick={handleSeleccionar} disabled={!rolSeleccionado}>
                Confirmar Rol
            </button>
        </div>
    );
};

export default SeleccionarRolPage;
