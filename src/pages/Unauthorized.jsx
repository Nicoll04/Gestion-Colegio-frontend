import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚫 Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button 
        onClick={() => navigate("/dashboard")} 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        🔙 Volver al Dashboard
      </button>
    </div>
  );
};

export default UnauthorizedPage;
