import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import '../styles/Dashboard.css';
// import Navbar from './Navbar';
import Logout from './Logout';
import Footer from './Footer';

const GestionUsuarios = () => {
    const navigate = useNavigate();

    const handleVolver = () => {
        navigate('/coordinacion');
    };

    return (
        <div className="dashboard">
            <Breadcrumbs />
            <main className="content">
                <div className="dashboard-header">
                    <h1>Gestión de Usuarios</h1>
                    <p>Administración del personal del sistema</p>
                </div>
                
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>👥 Lista de Usuarios</h3>
                        <p>Ver y administrar todos los usuarios registrados</p>
                        <button className="btn-primary">Ver Lista</button>
                    </div>
                    
                    <div className="card">
                        <h3>➕ Agregar Usuario</h3>
                        <p>Registrar nuevo usuario en el sistema</p>
                        <button className="btn-primary">Agregar</button>
                    </div>
                    
                    <div className="card">
                        <h3>🔧 Permisos</h3>
                        <p>Gestionar roles y permisos de usuarios</p>
                        <button className="btn-primary">Configurar</button>
                    </div>
                </div>
            </main>
            <Logout />
            <Footer />
        </div>
    );
};

export default GestionUsuarios;