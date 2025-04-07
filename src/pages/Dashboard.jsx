import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Estilos con styled-components


const Container = styled.div`
    max-width: 900px;
    margin: auto;
    padding: 20px;
    text-align: center;
`;

const Title = styled.h1`
    color: #333;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Montserrat', sans-serif; 
    text-transform: uppercase; 
`;

const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const LargeIcon = styled.img`
    width: 500px;
    height: auto;
`;

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;

const Card = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    width: 180px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const Icon = styled.img`
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
`;

const CardText = styled.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: #555;
`;

// Estilos del botón de cerrar sesión
const LogoutButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #003B46; 
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background-color: #003B46;
    }
`;

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Eliminar el token
        navigate("/"); // Redirigir al login
    };

    return (
        <Container>
            <Title>Bienvenido al Sistema de Gestión Escolar ISMC</Title>
            <IconContainer>
                <LargeIcon src="/icons/sol ismc.jpg" alt="Logo" />
            </IconContainer>
            <GridContainer>
                <Card onClick={() => navigate("/estudiantes")}>
                    <Icon src="/icons/estudiantes.png" alt="Estudiantes" />
                    <CardText>Estudiantes</CardText>
                </Card>
                <Card onClick={() => navigate("/profesores")}>
                    <Icon src="/icons/profesores.png" alt="Profesores" />
                    <CardText>Profesores</CardText>
                </Card>
                <Card onClick={() => navigate("/cursos")}>
                    <Icon src="/icons/biblioteca.png" alt="Cursos" />
                    <CardText>Cursos</CardText>
                </Card>
                <Card onClick={() => navigate("/familiares")}>
                    <Icon src="/icons/familia.png" alt="Familiares" />
                    <CardText>Familiares</CardText>
                </Card>
            </GridContainer>
            <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
        </Container>
    );
};

export default Dashboard;
