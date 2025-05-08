import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchEstudiantesByCurso, fetchCursoById } from "../services/cursoService";
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
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: ${colors.seafoam};
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  color: ${colors.deepAqua};
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid ${colors.wave};
  &:last-child {
    border-bottom: none;
  }
  a {
    text-decoration: none;
    color: black;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: ${colors.sunset};
    }
  }
`;

const BackButton = styled.button`
  background-color: ${colors.ocean};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
  &:hover {
    background-color: ${colors.deepAqua};
  }
`;

const EstudiantesCursoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const cursoData = await fetchCursoById(id);
        setCurso(cursoData);

        const estudiantesData = await fetchEstudiantesByCurso(id);
        const estudiantesFormateados = estudiantesData.map(est => ({
          ...est,
          Nombre_formateado: formatearNombre(est.Nombre_completo)
        }));
        setEstudiantes(estudiantesFormateados);
      } catch (err) {
        setError("Error al cargar los datos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  const formatearNombre = (nombreCompleto) => {
    const partes = nombreCompleto.trim().split(" ");
    if (partes.length < 2) return nombreCompleto;
    
    
    const apellidos = partes.slice(-2).join(" ");
    const nombres = partes.slice(0, -2).join(" ");
    return `${apellidos} ${nombres}`;
  };
  

  return (
    <Container>
      <Title>Estudiantes del Curso: {curso ? curso.Nombre_curso : "Desconocido"}</Title>

      {estudiantes.length === 0 ? (
        <p>No hay estudiantes registrados en este curso.</p>
      ) : (
        <List>
          {[...estudiantes]
          .sort((a, b) => a.Nombre_formateado.localeCompare(b.Nombre_formateado))
          .map((est) => (
            <ListItem key={est.ID_estudiante}>
            <Link to={`/estudiante/${est.ID_estudiante}`}>
            {est.Nombre_formateado}
            </Link>
            </ListItem>
        ))}
        </List>
      )}

      <BackButton onClick={() => navigate(-1)}>🔙 Volver</BackButton>
    </Container>
  );
};

export default EstudiantesCursoPage;
