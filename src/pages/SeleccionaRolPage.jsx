// src/pages/SeleccionarRolPage.jsx
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

            const res = await API.post("/auth/asignar-rol", { rol: rolSeleccionado }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userRole", res.data.rol);

                dispatch(setAuth({
                    token: res.data.token,
                    rol: res.data.rol,
                    nombre: res.data.nombre || null
                }));

                navigate("/dashboard");
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
                <option value="secretaria">Secretaría</option>
            </select>
            <button className="btn btn-primary" onClick={handleSeleccionar} disabled={!rolSeleccionado}>
                Confirmar Rol
            </button>
        </div>
    );
};

export default SeleccionarRolPage;
