import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFamiliares } from "../store/slices/familiarSlice";
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
`;

const Title = styled.h2`
  text-align: center;
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

const FamiliarDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { familiares, loading } = useSelector((state) => state.familiares);
  const [familiar, setFamiliar] = useState(null);

  useEffect(() => {
    if (familiares.length === 0) {
      dispatch(fetchFamiliares());
    }
  }, [dispatch, familiares.length]);

  useEffect(() => {
    if (familiares.length > 0) {
      const foundFamiliar = familiares.find(
        (f) => String(f.ID_Familiar).trim() === String(id).trim()
      );
      setFamiliar(foundFamiliar);
    }
  }, [familiares, id]);

  if (loading) {
    return <p className="text-center mt-4">Cargando información del familiar...</p>;
  }

  if (!familiar) {
    return <p className="text-center mt-4 text-danger">No se encontró información del familiar.</p>;
  }

  console.log("Familiar encontrado:", familiar);


  return (
    <Container>
      <Title>Detalles del Familiar</Title>
      <DetailsGrid>
        {Object.entries(familiar).map(([key, value]) => (
          <ListItem key={key}>
          <strong>{key.replace(/_/g, " ")}:</strong>{" "}
          {key.toLowerCase().includes("email") ? (
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(value)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.coral }}
            >
              {value}
            </a>
          ) : (
            value
          )}
        </ListItem>
        ))}
      </DetailsGrid>
      <BackButton onClick={() => window.history.back()}>🔙 Volver</BackButton>
    </Container>
  );
};

export default FamiliarDetailPage;