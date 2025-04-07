import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfesores, deleteProfesor } from "../store/slices/profesorSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const colors = {
  deepAqua: "#003B46",
  ocean: "#07575B",
  wave: "#66A5AD",
  seafoam: "#C4DFE6",
  coral: "#FF6F61",  
};

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: ${colors.seafoam};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  color: ${colors.deepAqua};
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${colors.ocean};
  color: white;
  padding: 10px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${colors.wave};
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 5px;
  background: ${(props) => (props.$danger ? "#d9534f" : props.$warning ? "#f0ad4e" : "#5bc0de")};
  &:hover {
    opacity: 0.8;
  }
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: ${colors.coral}; 
  color: white;
  cursor: pointer;
  &:hover {
    background: ${colors.deepAqua};
  }
`;

const ProfesoresLista = () => {
  const dispatch = useDispatch();
  const { profesores, loading, error } = useSelector((state) => state.profesores);
  const navigate = useNavigate();
    const userRole = useSelector((state) => state.auth.rol);

  useEffect(() => {
    dispatch(fetchProfesores());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este profesor?");
    if (confirmDelete) {
      dispatch(deleteProfesor(id)).then(() => dispatch(fetchProfesores()));
    }
  };

  return (
    <Container>
      <Title>Listado de Profesores</Title>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && profesores.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Nro Documento</Th>
              <Th>Celular</Th>
              <Th>Correo Institucional</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
          {profesores.map((profesor, index) => (
            <tr key={profesor.ID_Profesores || `profesor-${index}`}>
              <Td>{profesor.Nombre_completo}</Td>
              <Td>{profesor.Nro_Documento}</Td>
              <Td>{profesor.Celular}</Td>
              <Td>{profesor.Correo_institucional}</Td>
              <Td>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button onClick={() => navigate(`/profesores/detalles/${profesor.ID_Profesores}`)}>Detalles</Button>
                {userRole === "admin" &&(
                  <>
                   <Button $warning onClick={() => navigate(`/profesores/editar/${profesor.ID_Profesores}`)}>Editar</Button>
                   <Button $danger onClick={() => handleDelete(profesor.ID_Profesores)}>Eliminar</Button>
                  </>
                  
                )}
              </div>
            </Td>
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <p>No hay profesores registrados.</p>
      )}
      <BackButton onClick={() => navigate("/profesores")}>🔙 Volver</BackButton>
    </Container>
  );
};

export default ProfesoresLista;
