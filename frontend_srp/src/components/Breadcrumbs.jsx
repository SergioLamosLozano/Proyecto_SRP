import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "../styles/Breadcrumbs.css";

const Breadcrumbs = () => {
    const location = useLocation();
    const [rol, setRol] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const decoded = jwtDecode(token);
            setRol(decoded.rol || decoded.role || decoded["user"]["rol"]);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            localStorage.removeItem('token');
        }
        }
    }, []);

    const paths = location.pathname.split("/").filter((x) => x);
    const formatPath = (path) => {
        return path
            .replace(/-/g, " ")               // quita guiones
            .replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza cada palabra
    };

    return (
        <nav className="breadcrumbs">
        <ul>
            <li>
                <Link to={"/"+rol}>🏠 Inicio</Link>
            </li>
            
            {paths.map((path, index) => {
            const fullPath = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;
            

            return (
                    <li key={index}>
                    {isLast ? (
                        <span>{formatPath(path)}</span>
                    ) : (
                        <Link to={fullPath}>{formatPath(path)}</Link>
                    )}
                    </li>
                );
            })}
        </ul>
        </nav>
    );
};

export default Breadcrumbs;