import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../assets/Login.css";

const Login = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ Correo: correo, Contraseña: contraseña })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                navigate("/dashboard");
            }
        });
    };

    return (
        <div className="login-container">
            <div className="card-container">
                <div className="card">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Cargando..." : "Ingresar"}
                        </button>
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </form>
                    <p className="mt-3 text-center">
                        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
