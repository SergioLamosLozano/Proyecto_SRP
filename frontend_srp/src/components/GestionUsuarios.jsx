import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import '../styles/Dashboard.css';
import '../styles/GestionUsuarios.css';
// import Navbar from './Navbar';
import Logout from './Logout';
import Footer from './Footer';
import '../styles/Coordinacion.css';

const GestionUsuarios = ({ onBack }) => {
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Inicio', path: '/coordinacion' },
        { label: 'Coordinación Administrativa', path: '/coordinacion' },
        { label: 'Gestión de Usuarios', path: '/coordinacion/gestion-usuarios' }
    ];

    const handleVolver = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/coordinacion');
        }
    };

    return (
        <div className="dashboard">
            <Breadcrumbs items={breadcrumbItems} onNavigate={onBack} />
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
        </div>
    );
};

export default GestionUsuarios;