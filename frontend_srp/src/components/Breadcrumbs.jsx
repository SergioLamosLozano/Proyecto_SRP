import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { allowNavigation } from '../utils/navigationControl';
import '../styles/Coordinacion.css';
import "../styles/Breadcrumbs.css";

const colors = {
  grisSecundario: 'var(--gris-secundario)',
  rojoInstitucional: 'var(--rojo-institucional)',
  grisPrincipal: 'var(--gris-principal)'
};

const Breadcrumbs = ({ items = [], onNavigate }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rol, setRol] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Buscar el rol en diferentes posibles ubicaciones del token
                let userRole = null;
                if (decoded.rol) {
                    userRole = decoded.rol;
                } else if (decoded.role) {
                    userRole = decoded.role;
                } else if (decoded.user && decoded.user.rol) {
                    userRole = decoded.user.rol;
                } else if (decoded.user && decoded.user.role) {
                    userRole = decoded.user.role;
                }
                
                console.log('Token decodificado:', decoded);
                console.log('Rol encontrado:', userRole);
                setRol(userRole);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleNavigation = (path) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            allowNavigation(() => {
                navigate(path);
            });
        }
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav className="breadcrumbs">
            <ul>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                        <li key={index}>
                            {isLast ? (
                                <span className="current-page">{item.label}</span>
                            ) : (
                                <button 
                                    onClick={() => handleNavigation(item.path)}
                                    className="breadcrumb-button"
                                >
                                    {item.label}
                                </button>
                            )}
                            {!isLast && <span className="separator"> / </span>}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;