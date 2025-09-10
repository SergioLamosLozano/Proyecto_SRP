import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import Breadcrumbs from '../components/Breadcrumbs';
import '../styles/Dashboard.css';
import Footer from '../components/Footer';



const Coordinacion = () => {
    const navigate = useNavigate();

    const handleVerPersonal = () => {
        navigate('/coordinacion/gestion-usuarios');
    };

    return (
        <div className="dashboard">
            <Logout />
            <Breadcrumbs />
            <main className="content">
                <div className="dashboard-header">
                    <h1>Coordinación Administrativa</h1>
                    <p>Panel de control - Gestión administrativa y recursos</p>
                </div>
                
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>📋 Gestión de Personal</h3>
                        <p>Administrar usuarios y permisos del sistema</p>
                        <button className="btn-primary" onClick={handleVerPersonal}>Ver Personal</button>
                    </div>
                    
                    <div className="card">
                        <h3>⚙️ Configuración del Sistema</h3>
                        <p>Parámetros y ajustes generales</p>
                        <button className="btn-primary">Configurar</button>
                    </div>
                    
                    <div className="card">
                        <h3>📈 Estadísticas</h3>
                        <p>Resumen de actividades y métricas</p>
                        <button className="btn-primary">Ver Estadísticas</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Coordinacion;