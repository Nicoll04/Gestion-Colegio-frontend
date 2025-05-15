import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCursos, addCurso, updateCurso, deleteCurso } from "../store/slices/cursoSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchProfesores } from "../store/slices/profesorSlice";



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
  max-width: 900px;
  margin: auto;
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

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid ${colors.wave};
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid ${colors.wave};
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.$primary ? colors.coral : colors.sunset)};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: 0.3s;

  &:hover {
    background-color: ${(props) => (props.$primary ? colors.deepAqua : colors.ocean)};
  }
`;


const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: ${colors.ocean};
  color: white;
  padding: 10px;
  text-align: center;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${colors.wave};
  text-align: center;
`;

const CursosPage = () => {
  const dispatch = useDispatch();
  const { cursos, loading, error } = useSelector((state) => state.cursos);
  const navigate = useNavigate();
  const [nombreCurso, setNombreCurso] = useState("");
  const [grado, setGrado] = useState("Preescolar");
  const [editingId, setEditingId] = useState(null);
  const userRole = useSelector((state) => state.auth.rol);
  const [idProfesor, setIdProfesor] = useState("");
  const { profesores } = useSelector((state) => state.profesores);


  useEffect(() => {
    dispatch(fetchCursos());       
    dispatch(fetchProfesores());   
  }, [dispatch]);

  const handleVerEstudiantes = (idCurso) => {
    navigate(`/cursos/${idCurso}/estudiantes`);
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const nuevoCurso = {
  Nombre_curso: nombreCurso,
  Grado: grado,
  ID_ProfesorDirector: idProfesor,
};

  if (editingId) {
    dispatch(updateCurso({ id: editingId, cursoData: nuevoCurso }))
      .then(() => {
        setEditingId(null);
        dispatch(fetchCursos()); 
      });
  } else {
    dispatch(addCurso(nuevoCurso))
      .then(() => {
        dispatch(fetchCursos()); 
      });
  }

  setNombreCurso("");
  setGrado("Preescolar");
  setIdProfesor("");
};

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este curso?");
    if (confirmDelete) {
      dispatch(deleteCurso(id)).then(() => {
        dispatch(fetchCursos());
      });
    }
  };

  return (
    <Container>
      <HomeButton onClick={() => navigate("/dashboard")}> 
        <img src="/icons/pagina-de-inicio.png" alt="Ir al Dashboard" />
      </HomeButton>
      <Title>Gestión de Cursos</Title>
      
      <Form onSubmit={handleSubmit}>
        <h4>{editingId ? "Editar Curso" : "Agregar Nuevo Curso"}</h4>
        <div>
          <label>Nombre del Curso</label>
          <Input
            type="text"
            value={nombreCurso}
            onChange={(e) => setNombreCurso(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Grado</label>
          <Select value={grado} onChange={(e) => setGrado(e.target.value)} required>
            <option value="Preescolar">Preescolar</option>
            <option value="Primaria">Primaria</option>
            <option value="Bachillerato">Bachillerato</option>
          </Select>
        </div>
        <div>
          <label>Director de Curso</label>
        <Select
          value={idProfesor}
          onChange={(e) => setIdProfesor(e.target.value)}
          required
        >
          <option value="">Selecciona un profesor</option>
          {profesores.length === 0 ? (
            <option disabled>Cargando profesores...</option>
          ) : (
            profesores.map((profesor) => (
              <option key={profesor.ID_Profesores} value={profesor.ID_Profesores}>
                {profesor.Nombre_completo}
              </option>
            ))
          )}
        </Select>
        </div>
        <Button $primary type="submit" style={{ marginTop: "10px" }} disabled={userRole !== "admin"}>
          {editingId ? "Actualizar Curso" : "Agregar Curso"}
        </Button>
      </Form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && cursos.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nombre del Curso</Th>
              <Th>Grado</Th>
              <Th>Director de Curso</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso, index) => (
              <tr key={curso.ID_Curso || `curso-${index}`}>
                <Td>{curso.ID_Curso}</Td>
                <Td>{curso.Nombre_curso}</Td>
                <Td>{curso.Grado}</Td>
                <Td>
                  {profesores.find((p) => p.ID_Profesores === curso.ID_ProfesorDirector)?.Nombre_completo || "Sin asignar"}
                </Td>
                <Td>
                  <Button $primary onClick={() => handleVerEstudiantes(curso.ID_Curso)}>
                    Ver Estudiantes
                  </Button>
                  {userRole === "admin" && (
                    <>
                      <Button
                      $primary
                      onClick={() => {
                        setEditingId(curso.ID_Curso);
                        setNombreCurso(curso.Nombre_curso);
                        setGrado(curso.Grado);
                        setIdProfesor(curso.ID_Profesores || "");  
                      }}
                    >
                      Editar
                    </Button>
                      <Button onClick={() => handleDelete(curso.ID_Curso)}>Eliminar</Button>
                    </>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CursosPage;
