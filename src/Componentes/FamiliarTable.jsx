import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFamiliares, deleteFamiliar } from "../store/slices/familiarSlice";
import { useNavigate } from "react-router-dom";
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
  max-width: 1100px;
  margin: 40px auto;
  padding: 20px;
  background-color: ${colors.seafoam};
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Thead = styled.thead`
  background-color: ${colors.deepAqua};
  color: white;
`;

const Th = styled.th`
  padding: 12px;
  text-align: center;
`;

const Td = styled.td`
  padding: 10px;
  text-align: center;
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
    background: ${colors.wave};
  }
`;

const FamiliarTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { familiares } = useSelector((state) => state.familiares);
  const userRole = useSelector((state) => state.auth.rol);


  useEffect(() => {
    dispatch(fetchFamiliares());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este familiar?")) {
      dispatch(deleteFamiliar(id)).then(() => dispatch(fetchFamiliares()));
    }
  };

  const handleEdit = (id) => {
    navigate(`/familiares`, { state: { editId: id } });
  };

  const handleDetails = (id) => {
    navigate(`/familiares/${id}`);
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center", color: colors.deepAqua }}>Listado de Familiares</h2>
      <Table>
        <Thead>
          <tr>
            <Th>ID Estudiante</Th>
            <Th>Representante</Th>
            <Th>Parentesco</Th>
            <Th>Nombre</Th>
            <Th>Celular</Th>
            <Th>Acciones</Th>
          </tr>
        </Thead>
        <tbody>
          {Array.isArray(familiares) && familiares.map((familiar) => (
            <tr key={familiar.ID_Familiar}>
              <Td>{familiar.ID_Estudiante}</Td>
              <Td>{familiar.Representante}</Td>
              <Td>{familiar.Parentesco}</Td>
              <Td>{familiar.Nombre_completo}</Td>
              <Td>{familiar.Celular}</Td>
              <Td>
                <Button onClick={() => handleDetails(familiar.ID_Familiar)}>Detalles</Button>
                {userRole === "admin" && (
                  <>
                     <Button $warning onClick={() => handleEdit(familiar.ID_Familiar)}>Editar</Button>
                     <Button $danger onClick={() => handleDelete(familiar.ID_Familiar)}>Eliminar</Button>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BackButton onClick={() => navigate("/familiares")}>🔙 Volver</BackButton>
    </Container>
  );
};

export default FamiliarTable;
