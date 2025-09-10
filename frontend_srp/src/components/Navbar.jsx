import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const url = () =>
    window.open(
      "https://contableyfinancier7.wixsite.com/rafaelpombotulua",
      "_blank"
    );

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div onClick={url} className="logo-container">
          <img className="rafaelpombo-logo" src="./Logo.png" />
          <a>INSTITUTO RAFAEL POMBO - TULUA</a>
        </div>

        {username && (
          <div className="user-info">
            <span className="user-welcome">Bienvenido(a), {username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
