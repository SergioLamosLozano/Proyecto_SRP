import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { allowNavigation } from "../utils/navigationControl";
import "../styles/Breadcrumbs.css";
import Coordinacion from "../pages/CoordinacionPage";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol || decoded.role || decoded["user"]["rol"]);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const paths = location.pathname.split("/").filter((x) => x);

  const formatPath = (path) => {
    return path.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleNavigation = (path) => {
    allowNavigation(() => {
      navigate(path);
    });
  };

  return (
    <nav className="breadcrumbs">
      <ul>
        <li>
          <button
            onClick={() => handleNavigation("/" + rol)}
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
              {isLast ? (
                <span className="current-page">{formatPath(path)}</span>
              ) : (
                <button
                  onClick={() => handleNavigation(fullPath)}
                  className="breadcrumb-button"
                >
                  {formatPath(path)}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
