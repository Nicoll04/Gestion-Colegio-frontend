import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfesores } from "../store/slices/profesorSlice";
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

const ProfesorPhoto = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px; 
  border: 3px solid ${colors.ocean};
  margin: 20px auto;
  display: block;
`;

const ProfesorDetalles = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profesores, loading } = useSelector((state) => state.profesores);
  const [profesor, setProfesor] = useState(null);

  useEffect(() => {
    if (profesores.length === 0) {
      dispatch(fetchProfesores());
    }
  }, [dispatch, profesores.length]);

  useEffect(() => {
    if (profesores.length > 0) {
      const foundProfesor = profesores.find((p) => Number(p.ID_Profesores) === Number(id));
      setProfesor(foundProfesor);
    }
  }, [profesores, id]);

  if (loading) {
    return <p>Cargando información del profesor...</p>;
  }

  if (!profesor) {
    return <p>No se encontró información del profesor.</p>;
  }

  return (
    <Container>
      <Title>Detalles del Profesor</Title>
      
      {profesor.Foto && <ProfesorPhoto src={profesor.Foto} alt="Foto del profesor" />}
  
      <DetailsGrid>
  {console.log("Campos del profesor:", profesor)}
  {Object.entries(profesor).map(([key, value]) => {
    if (key === "Foto") return null;

    let displayValue = value;

    // Mostrar fecha formateada
    if (key.toLowerCase().includes("fecha") && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        displayValue = date.toISOString().split("T")[0];
      }
    }

    // Si es un correo electrónico, mostrar como enlace a Gmail
    if (key.toLowerCase().includes("correo") || key.toLowerCase().includes("email")) {
      displayValue = (
        <a
          href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(value)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.coral }}
        >
          {value}
        </a>
      );
    }

    return (
      <ListItem key={key}>
        <strong>{key.replace(/_/g, " ")}:</strong> {displayValue}
      </ListItem>
    );
  })}
</DetailsGrid>

  
      <BackButton onClick={() => window.history.back()}>🔙 Volver</BackButton>
    </Container>
  );
};

export default ProfesorDetalles;
