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
        <div className="dashboard-container">
            <Breadcrumbs items={breadcrumbItems} onNavigate={onBack} />
            
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Gestión de Usuarios</h1>
                    <p className="dashboard-subtitle">Administración del personal del sistema</p>
                </div>
                
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <span className="card-icon">👥</span>
                            <h3 className="card-title">Lista de Usuarios</h3>
                        </div>
                        <p className="card-description">Ver y administrar todos los usuarios registrados</p>
                        <button className="card-button">Ver Lista</button>
                    </div>
                    
                    <div className="dashboard-card">
                        <div className="card-header">
                            <span className="card-icon">➕</span>
                            <h3 className="card-title">Agregar Usuario</h3>
                        </div>
                        <p className="card-description">Registrar nuevo usuario en el sistema</p>
                        <button className="card-button">Agregar</button>
                    </div>
                    
                    <div className="dashboard-card">
                        <div className="card-header">
                            <span className="card-icon">🔧</span>
                            <h3 className="card-title">Permisos</h3>
                        </div>
                        <p className="card-description">Gestionar roles y permisos de usuarios</p>
                        <button className="card-button">Configurar</button>
                    </div>
                </div>
            </div>
            <Logout />
        </div>
    );
};

export default GestionUsuarios;