import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteStudent, fetchStudents } from "../store/slices/studentSlice";
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

const StudentTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students } = useSelector((state) => state.students);
  const { cursos } = useSelector((state) => state.cursos);
  const userRole = useSelector((state) => state.auth.rol);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este estudiante?");
    if (confirmDelete) {
      await dispatch(deleteStudent(id));
      dispatch(fetchStudents());
    }
  };

  const handleEdit = (student) => {
    navigate(`/estudiantes?editar=${student.ID_estudiante}`);
  };

  const handleRead = (student) => {
    navigate(`/estudiante/${student.ID_estudiante}`);
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center", color: colors.deepAqua }}>Listado de Estudiantes</h2>
      <Table>
        <Thead>
          <tr>
            <Th>Curso</Th>
            <Th>Nombre</Th>
            <Th>Tipo Doc</Th>
            <Th>Número</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </tr>
        </Thead>
        <tbody>
        {Array.isArray(students) && students.map((student) => (
            <tr key={student.ID_estudiante}>
              <Td>{cursos.find((c) => c.ID_Curso === student.ID_Curso)?.Nombre_curso || "Sin curso"}</Td>
              <Td>{student.Nombre_completo}</Td>
              <Td>{student.Tipo_documento}</Td>
              <Td>{student.Nro_Documento}</Td>
              <Td>{student.Estado}</Td>
            <Td>
              <Button $primary onClick={() => handleRead(student)}>Detalles</Button>
              {userRole === "admin" && (
                <>
                  <Button $warning onClick={() => handleEdit(student)}>Editar</Button>
                  <Button $danger onClick={() => handleDelete(student.ID_estudiante)}>Eliminar</Button>
                  <Button onClick={() => navigate(`/familiares?estudianteId=${student.ID_estudiante}`)}>
                    Agregar Familiar
                  </Button>
                </>
              )}
            </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BackButton onClick={() => navigate("/estudiantes")}>🔙 Volver</BackButton>
    </Container>
  );
};

export default StudentTable;
