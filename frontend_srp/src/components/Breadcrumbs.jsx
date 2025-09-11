import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { allowNavigation } from '../utils/navigationControl';
import "../styles/Breadcrumbs.css";
import Coordinacion from "../pages/CoordinacionPage";

const Breadcrumbs = ({ currentSection, onSectionNavigation }) => {
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

    const paths = location.pathname.split("/").filter((x) => x);
    
    const formatPath = (path) => {
        return path
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const handleNavigation = (path) => {
        allowNavigation(() => {
            navigate(path);
        });
    };

    const handleSectionNavigation = (section) => {
        if (onSectionNavigation) {
            onSectionNavigation(section);
        }
    };

    return (
        <nav className="breadcrumbs">
            <ul>
                <li>
                    <button 
                        onClick={() => currentSection ? handleSectionNavigation('dashboard') : handleNavigation("/" + rol)}
                        className="breadcrumb-button home-button"
                    >
                        🏠 Inicio
                    </button>
                </li>
                
                {paths.map((path, index) => {
                    const fullPath = "/" + paths.slice(0, index + 1).join("/");
                    const isLast = index === paths.length - 1;
                    
                    return (
                        <li key={index}>
                            {isLast && !currentSection ? (
                                <span className="current-page">{formatPath(path)}</span>
                            ) : (
                                <button 
                                    onClick={() => currentSection ? handleSectionNavigation('dashboard') : handleNavigation(fullPath)}
                                    className="breadcrumb-button"
                                >
                                    {formatPath(path)}
                                </button>
                            )}
                        </li>
                    );
                })}
                
                {currentSection && (
                    <li>
                        <span className="current-page">{currentSection}</span>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;