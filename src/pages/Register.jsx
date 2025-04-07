import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [rol, setRol] = useState("secretaria"); // Valor por defecto

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ Nombre: nombre, Correo: correo, Contraseña: contraseña, Rol: rol }))
            .then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    navigate("/"); // Redirige a login después del registro
                }
            });
    };

    return (
        <div className="login-container">
            <div className="card-container">
                <div className="card">
                    <h2>Registro de Usuario</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="form-control mb-3" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        <input type="email" className="form-control mb-3" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                        <input type="password" className="form-control mb-3" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                        <select className="form-control mb-3" value={rol} onChange={(e) => setRol(e.target.value)}>
                            <option value="admin">Administrador</option>
                            <option value="secretaria">Secretaria</option>
                            <option value="coordinadora">Coordinadora</option>
                        </select>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Registrando..." : "Registrar"}</button>
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
