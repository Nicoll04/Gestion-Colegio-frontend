import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfesores, addProfesor, updateProfesor } from "../store/slices/profesorSlice";
import styled from "styled-components";

const colors = {
  deepAqua: "#003B46",
  ocean: "#07575B",
  wave: "#66A5AD",
  seafoam: "#C4DFE6",
  coral: "#FF6F61",
  sunset: "#FF7F50",
};

const Container = styled.div`
  position: relative;
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: ${colors.seafoam};
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HomeButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  
  img {
    width: 30px;
    height: auto;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: ${colors.deepAqua};
  margin-bottom: 20px;
`;

const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 40%;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${colors.ocean};
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  margin-top: 5px;
  border: 1px solid ${colors.wave};
  border-radius: 6px;
  background: white;
  color: ${colors.deepAqua};
`;

const Button = styled.button`
  background-color: ${(props) => (props.$primary ? colors.sunset : colors.coral)};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 8px;
  transition: 0.3s;

  &:hover {
    background-color: ${(props) => (props.$primary ? colors.wave : colors.wave)};
  }
`;


const ProfesoresPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profesores, loading } = useSelector((state) => state.profesores);
  const userRole = useSelector((state) => state.auth.rol);

  const [formData, setFormData] = useState({
    Nombre_completo: "",
    Nro_Documento: "",
    RH: "",
    Fecha_nacimiento: "",
    Celular: "",
    EPS: "",
    ARL: "",
    Correo_institucional: "",
    Correo_Personal: "",
    Nombre_familiar: "",
    Telefono_familiar: "",
    Parentesco: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(fetchProfesores());
  }, [dispatch]);

  useEffect(() => {
    if (id && profesores.length > 0) {
      const profesorExistente = profesores.find((p) => String(p.ID_Profesores) === id);
      if (profesorExistente) {
        const { Foto, Fecha_nacimiento, ...otrosDatos } = profesorExistente;
        const fechaFormateada = Fecha_nacimiento
          ? new Date(Fecha_nacimiento).toISOString().split("T")[0]
          : "";
        setFormData({
          ...otrosDatos,
          Fecha_nacimiento: fechaFormateada,
        });
      }
    }
  }, [id, profesores]);
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataToSend = { ...formData };
  
    
    if (selectedFile) {
      const formDataImage = new FormData();
      formDataImage.append("file", selectedFile);
      formDataImage.append("upload_preset", "imagenes_upload");
      formDataImage.append("folder", "imagenes");
  
      try {
        console.log("📤 Subiendo imagen a Cloudinary...");
        const response = await fetch("https://api.cloudinary.com/v1_1/dz9s8uiqw/image/upload", {
          method: "POST",
          body: formDataImage,
        });
  
        const result = await response.json();
        console.log("✅ Respuesta de Cloudinary:", result);
  
        if (!result.secure_url) {
          throw new Error("⛔ Error al obtener la URL de la imagen");
        }
  
        dataToSend.Foto = result.secure_url; 
        console.log("🖼 URL de imagen guardada en dataToSend:", dataToSend.Foto);
  
      } catch (error) {
        console.error("❌ Error al subir la imagen:", error);
        alert("Error subiendo la imagen. Intenta de nuevo.");
        return;
      }
    }
  
    if (id) {
      await dispatch(updateProfesor({ id, profesorData: dataToSend }));
    } else {
      await dispatch(addProfesor(dataToSend));
    }
  
    navigate("/profesores-lista");
  };  
  
  return (
    <Container>
      <HomeButton onClick={() => navigate("/dashboard")}>
        <img src="/icons/pagina-de-inicio.png" alt="Ir al Dashboard" />
      </HomeButton>
      <Title>Gestión de Profesores</Title>
      {loading && <p>Cargando datos...</p>}
      <Form onSubmit={handleSubmit}>
        <Row>
          {Object.keys(formData).map((key) => (
            <InputGroup key={key}>
              <Label>{key.replace(/_/g, " ")}:</Label>
              <Input
                type={key.includes("Correo") ? "email" : key.includes("Fecha") ? "date" : "text"}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>
          ))}
         <InputGroup>
          <Label>Foto:</Label>
          <Input type="file" onChange={handleFileChange} accept="image/*" />
        </InputGroup>
        </Row>
        <Button $primary type="submit" disabled={userRole !== "admin"}>
          {id ? "Actualizar Profesor" : "Agregar Profesor"}
        </Button>
        <Button onClick={() => navigate("/profesores-lista")}>Registrados</Button>
      </Form>
    </Container>
  );
};

export default ProfesoresPage;
