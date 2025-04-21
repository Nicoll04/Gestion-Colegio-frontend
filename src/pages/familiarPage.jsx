import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchStudents } from "../store/slices/studentSlice";
import { fetchFamiliares, addFamiliar, updateFamiliar } from "../store/slices/familiarSlice";
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const FullWidth = styled.div`
  grid-column: span 2;
`;

const InputGroup = styled.div`
  text-align: left;
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


const FamiliaresPage = () => {
  const dispatch = useDispatch();
  const { students = [] } = useSelector((state) => state.students) || {};
  const navigate = useNavigate();
  const { familiares = [] } = useSelector((state) => state.familiares) || {};
  const [formData, setFormData] = useState({
    ID_Estudiante: "",
    Representante: "",
    Parentesco: "",
    Nombre_completo: "",
    Nro_Documento: "",
    Direccion_Residencia: "",
    Celular: "",
    Email: "",
  });
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  const editId = location.state?.editId || null;
  const userRole = useSelector((state) => state.auth.rol);
  

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchFamiliares());
  }, [dispatch]);

  useEffect(() => {
    if (editId && familiares.length > 0) {
      const familiarToEdit = familiares.find((f) => f.ID_Familiar === editId);
      if (familiarToEdit) {
        setFormData({ ...familiarToEdit });
        setEditingId(editId);
      }
    }
  }, [editId, familiares]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar que un estudiante ha sido seleccionado
    if (!formData.ID_Estudiante) {
      alert("Debes seleccionar un estudiante antes de continuar.");
      return;
    }
  
    // Eliminar los campos vacíos de formData antes de enviarlo
    let dataToSend = { ...formData };
    Object.keys(dataToSend).forEach((key) => {
      if (!dataToSend[key]) {
        delete dataToSend[key]; 
      }
    });
  
    // Enviar los datos según si es una actualización o un nuevo familiar
    if (editingId) {
      await dispatch(updateFamiliar({ id: editingId, familiarData: dataToSend }));
    } else {
      await dispatch(addFamiliar(dataToSend));
    }
  
    // Refrescar los familiares
    dispatch(fetchFamiliares());
  
    // Limpiar el formulario
    setFormData({
      ID_Estudiante: "",
      Representante: "",
      Parentesco: "",
      Nombre_completo: "",
      Nro_Documento: "",
      Direccion_Residencia: "",
      Celular: "",
      Email: "",
    });
    setEditingId(null);
  };
  

  return (
    <Container>
      <HomeButton onClick={() => navigate("/dashboard")}> 
        <img src="/icons/pagina-de-inicio.png" alt="Ir al Dashboard" />
      </HomeButton>
      <Title>Gestión de Familiares</Title>
      <Form onSubmit={handleSubmit}>
        <FullWidth>
          <Label>Buscar Estudiante:</Label>
          <Select
            options={students.map((est) => ({
              value: est.ID_estudiante,
              label: est.Nombre_completo,
            }))}
            onChange={(selectedOption) =>
              setFormData((prevData) => ({ ...prevData, ID_Estudiante: selectedOption.value }))
            }
            placeholder="Escribe para buscar..."
            isClearable
          />
        </FullWidth>
        {Object.keys(formData)
          .filter((key) => key !== "ID_Estudiante")
          .map((key) => (
            <InputGroup key={key}>
              <Label>{key.replace(/_/g, " ")}:</Label>
              {key === "Representante" ? (
                <Select
                  options={[
                    { value: "Primero", label: "Primero" },
                    { value: "Segundo", label: "Segundo" },
                    { value: "Emergencia", label: "Emergencia" },
                  ]}
                  value={
                    formData.Representante
                      ? { value: formData.Representante, label: formData.Representante }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData((prev) => ({ ...prev, Representante: selectedOption.value }))
                  }
                  placeholder="Selecciona tipo de representante"
                  isClearable
                />
              ) : (
                <Input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                />
              )}
            </InputGroup>
          ))}
        <FullWidth>
        <Button $primary type="submit" disabled={userRole !== "admin"}>
          {editingId ? "Actualizar Familiar" : "Agregar Familiar"}
        </Button>
          <Button onClick={() => navigate("/tabla-familiares")}>Registrados</Button>
        </FullWidth>
      </Form>
    </Container>
  );
};

export default FamiliaresPage;