import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/Logoprincipal.png"; // Importamos la imagen del logo

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
        <div>
          <a className="logo-container">
            <img src={logo} alt="Rafael Pombo" className="rafaelpombo-logo" />
            <h1 className="logo-text">Instituto Rafael Pombo - Tuluá</h1>
          </a>
        </div>

        {username && (
          <div className="user-info">
            <span className="user-welcome">Bienvenido(a), {username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <svg
                className="logout-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z" />
              </svg>
              <span className="logout-text">Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
