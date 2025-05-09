import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../store/slices/studentSlice";
import { fetchCursos } from "../store/slices/cursoSlice"; 
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

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid ${colors.ocean}; 
  color: ${colors.deepAqua};
`;

const BackButton = styled.button`
  background-color: ${colors.sunset};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  transition: 0.3s;

  &:hover {
    background-color: ${colors.wave};
  }
`;

const StudentPhoto = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  object-position: center 20%; 
  border-radius: 10px;
  border: 4px solid ${colors.ocean};
  margin: 25px auto 20px;
  display: block;
`;

const StudentDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { students, loading } = useSelector((state) => state.students);
  const { cursos } = useSelector((state) => state.cursos);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
    if (cursos.length === 0) {
      dispatch(fetchCursos());
    }
  }, [dispatch, students.length, cursos.length]);

  useEffect(() => {
    if (students.length > 0) {
      const foundStudent = students.find((s) => Number(s.ID_estudiante) === Number(id));
      setStudent(foundStudent);
    }
  }, [students, id]);

  if (loading) {
    return <p>Cargando información del estudiante...</p>;
  }

  if (!student) {
    return <p>No se encontró información del estudiante.</p>;
  }

  const cursoNombre = cursos.find((c) => c.ID_Curso === student.ID_Curso)?.Nombre_curso || "Sin curso";

  return (
    <Container>
      <Title>Detalles del Estudiante</Title>
      
      {student.Foto && <StudentPhoto src={student.Foto} alt="Foto del estudiante" />}
  
      <DetailsGrid>
       {Object.entries(student).map(([key, value]) => {
        if (key === "familiares" && Array.isArray(value)) {
          return (
            <ListItem key={key} style={{ gridColumn: "span 2" }}>
              <strong>Familiares:</strong>
              <ul>
                {value.length > 0 ? (
                  value.map((familiar, index) => (
                    <li key={index}>
                      {familiar.ID_Familiar ? (
                        <Link to={`/familiares/${familiar.ID_Familiar}`}>
                          {familiar.nombre_completo} ({familiar.representante})
                        </Link>
                      ) : (
                        <span>
                          {familiar.nombre_completo} ({familiar.representante})
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <p>No hay familiares registrados.</p>
                )}
              </ul>
            </ListItem>
          );
        }

        if (key === "ID_Curso") {
          return (
            <ListItem key={key}>
              <strong>Curso:</strong> {cursoNombre}
            </ListItem>
          );
        }

        if (key === "Foto") return null;

        if (key === "Correo") {
          return (
            <ListItem key={key}>
              <strong>Correo:</strong>{" "}
              <a href={`mailto:${value}`} style={{ color: colors.coral }}>
                {value}
              </a>
            </ListItem>
          );
        }

        return (
          <ListItem key={key}>
            <strong>{key.replace(/_/g, " ")}:</strong>{" "}
            {typeof value === "string" && !isNaN(Date.parse(value)) && value.includes("T")
              ? new Date(value).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : value}
          </ListItem>
        );
      })}
      </DetailsGrid>
  
      <BackButton onClick={() => window.history.back()}>🔙 Volver</BackButton>
    </Container>
  );
  
};

export default StudentDetailPage;
