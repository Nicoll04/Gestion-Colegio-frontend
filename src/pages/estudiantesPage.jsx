import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../store/slices/studentSlice";
import { fetchCursos } from "../store/slices/cursoSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";


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
  max-width: 700px;
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
  justify-content: space-between;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 48%;
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

const Select = styled.select`
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
    background-color: ${colors.sunset};
  }
`;

const EstudiantesPage = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { cursos } = useSelector((state) => state.cursos);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editingId = queryParams.get("editar");
  const [selectedFile, setSelectedFile] = useState(null);
  const userRole = useSelector((state) => state.auth.rol);
  const API_URL = import.meta.env.VITE_API_URL;


  const initialFormState = {
    ID_Curso: "",
    Nombre_completo: "",
    Fecha_nacimiento: "",
    Tipo_documento: "",
    Nro_Documento: "",
    RH: "",
    EPS: "",
    Correo_institucional: "",
    Estado: "",
    Direccion_Residencia: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCursos());
  }, [dispatch]);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    return new Date(fechaISO).toISOString().split("T")[0];
  };
  
  useEffect(() => {
    if (editingId) {
      const studentToEdit = students.find(s => s.ID_estudiante.toString() === editingId);
      if (studentToEdit) {
        setFormData({
          ID_Curso: studentToEdit.ID_Curso || "",
          Nombre_completo: studentToEdit.Nombre_completo || "",
          Fecha_nacimiento: formatearFecha(studentToEdit.Fecha_nacimiento),
          Tipo_documento: studentToEdit.Tipo_documento || "",
          Nro_Documento: studentToEdit.Nro_Documento || "",
          RH: studentToEdit.RH || "",
          EPS: studentToEdit.EPS || "",
          Correo_institucional: studentToEdit.Correo_institucional || "",
          Estado: studentToEdit.Estado || "", 
          Direccion_Residencia: studentToEdit.Direccion_Residencia || "",
          Foto: studentToEdit.Foto || "",
        });
      }
    }
  }, [editingId, students]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 

    let dataToSend = { ...formData, ID_Curso: parseInt(formData.ID_Curso) };

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
                throw new Error("⛔ No se recibió la URL de la imagen.");
            }

            dataToSend.Foto = result.secure_url;
        } catch (error) {
            console.error("⛔ Error subiendo imagen:", error);
            alert("Error subiendo la imagen. Intenta de nuevo.");
            return;
        }
    }

    try {
      const response = await fetch(
          `${API_URL}/api/estudiantes/${editingId ? editingId : ""}`,   
          { 
              method: editingId ? "PUT" : "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": token ? `Bearer ${token}` : ""
              },
              body: JSON.stringify(dataToSend),
          }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
          throw new Error(result.message || "Error en la solicitud al backend");
      }
  
      dispatch(fetchStudents());
      setFormData(initialFormState);
      setSelectedFile(null);
  } catch (error) {
      console.error("⛔ Error al enviar datos al backend:", error);
      alert("Error al guardar el estudiante.");
  }  
};


  const handleFileChange = (event) => {
    console.log(event.target.files[0])
        setSelectedFile(event.target.files[0]);
      };

  return (
    <Container>
      <HomeButton onClick={() => navigate("/dashboard")}> 
        <img src="/icons/pagina-de-inicio.png" alt="Ir al Dashboard" />
      </HomeButton>
      <Title>Gestión de Estudiantes</Title>
      <Form onSubmit={handleSubmit}>
        <Row>
          <InputGroup>
            <Label>Curso</Label>
            <Select name="ID_Curso" value={formData.ID_Curso} onChange={handleChange} required>
              <option value="">Seleccione un curso</option>
              {cursos.map((course) => (
                <option key={course.ID_Curso} value={course.ID_Curso}>
                  {course.Nombre_curso}
                </option>
              ))}
            </Select>   
          </InputGroup>
          <InputGroup>
            <Label>Nombre completo</Label>
            <Input type="text" name="Nombre_completo" value={formData.Nombre_completo} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>Fecha de nacimiento</Label>
            <Input type="date" name="Fecha_nacimiento" value={formData.Fecha_nacimiento} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>Tipo de documento</Label>
            <Select name="Tipo_documento" value={formData.Tipo_documento} onChange={handleChange} required>
              <option value="">Seleccione</option>
              <option value="CC">Cédula de Ciudadania</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="NUIP">NUIP</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Número de Documento</Label>
            <Input type="text" name="Nro_Documento" value={formData.Nro_Documento} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>RH</Label>
            <Input type="text" name="RH" value={formData.RH} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>EPS</Label>
            <Input type="text" name="EPS" value={formData.EPS} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>Correo Institucional</Label>
            <Input type="email" name="Correo_institucional" value={formData.Correo_institucional} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>Estado</Label>
            <Select name="Estado" value={formData.Estado} onChange={handleChange} required>
              <option value="">Seleccione</option>
              <option value="Activo">Activo</option>
              <option value="Retirado">Retirado</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Dirección de Residencia</Label>
            <Input type="text" name="Direccion_Residencia" value={formData.Direccion_Residencia} onChange={handleChange} required />
          </InputGroup>
          <InputGroup>
            <Label>Foto:</Label>
            <Input type="file" onChange={handleFileChange} accept="image/*" />
          </InputGroup>
        </Row>
        <Button $primary type="submit" disabled={userRole !== "admin"}>
          {editingId ? "Actualizar Estudiante" : "Agregar Estudiante"}
        </Button>
        <Button onClick={() => navigate("/estudiantes/registrados")}>Registrados</Button>
      </Form>
    </Container>
  );
};

export default EstudiantesPage;
