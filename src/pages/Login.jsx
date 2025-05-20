import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginWithGoogle } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../assets/Login.css";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
            setCorreo(savedEmail);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ Correo: correo, Contraseña: contraseña })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                localStorage.setItem("userEmail", correo); // Guardar correo
                navigate("/dashboard");
            }
        });
    };

    const handleGoogleLogin = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;

        const res = await dispatch(loginWithGoogle(googleToken));

        if (res.meta.requestStatus === "fulfilled") {
            const { rol, correo } = res.payload;

            if (correo) {
                localStorage.setItem("userEmail", correo);
            }

            if (!rol) {
                navigate("/seleccionar-rol");
            } else {
                navigate("/dashboard");
            }
        } else {
            alert("Fallo el inicio de sesión con Google");
        }
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

                    <hr />
                    <div className="text-center">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => console.log("Fallo el login con Google")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
