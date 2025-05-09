import React, { useEffect, useState } from "react";
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
  max-width: 1100px;
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
  table-layout: fixed;
`;

const Th = styled.th`
  background: ${colors.ocean};
  color: white;
  padding: 12px;
  text-align: center;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${colors.wave};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Button = styled.button`
  padding: 8px 14px;
  margin: 0 6px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${(props) =>
    props.$danger ? "#e74c3c" :
    props.$warning ? "#f39c12" :
    "#3498db"};
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$danger ? "#c0392b" :
      props.$warning ? "#d68910" :
      "#2980b9"};
    transform: scale(1.03);
  }

  &:focus {
    outline: none;
  }
`;


const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: ${colors.coral};
  color: white;
  cursor: pointer;
  &:hover {
    background: ${colors.deepAqua};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  background: ${(props) => (props.active ? colors.deepAqua : colors.wave)};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background: ${colors.ocean};
  }
`;

const ProfesoresLista = () => {
  const dispatch = useDispatch();
  const { profesores, loading, error } = useSelector((state) => state.profesores);
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.rol);

  const [currentPage, setCurrentPage] = useState(1);
  const profesoresPerPage = 5;

  useEffect(() => {
    dispatch(fetchProfesores());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este profesor?");
    if (confirmDelete) {
      dispatch(deleteProfesor(id)).then(() => dispatch(fetchProfesores()));
    }
  };

  const totalPages = Math.ceil(profesores.length / profesoresPerPage);
  const indexOfLast = currentPage * profesoresPerPage;
  const indexOfFirst = indexOfLast - profesoresPerPage;
  const currentProfesores = profesores.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Container>
      <Title>Listado de Profesores</Title>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && profesores.length > 0 ? (
        <>
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
              {currentProfesores.map((profesor, index) => (
                <tr key={profesor.ID_Profesores || `profesor-${index}`}>
                  <Td title={profesor.Nombre_completo}>{profesor.Nombre_completo}</Td>
                  <Td>{profesor.Nro_Documento}</Td>
                  <Td>{profesor.Celular}</Td>
                  <Td title={profesor.Correo_institucional}>{profesor.Correo_institucional}</Td>
                  <Td>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                      <Button onClick={() => navigate(`/profesores/detalles/${profesor.ID_Profesores}`)}>
                        Detalles
                      </Button>
                      {userRole === "admin" && (
                        <>
                          <Button $warning onClick={() => navigate(`/profesores/editar/${profesor.ID_Profesores}`)}>
                            Editar
                          </Button>
                          <Button $danger onClick={() => handleDelete(profesor.ID_Profesores)}>
                            Eliminar
                          </Button>
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ⬅ Anterior
            </PageButton>

            {[...Array(totalPages)].map((_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Siguiente ➡
            </PageButton>
          </Pagination>
        </>
      ) : (
        <p>No hay profesores registrados.</p>
      )}
      <BackButton onClick={() => navigate("/profesores")}>🔙 Volver</BackButton>
    </Container>
  );
};

export default ProfesoresLista;
