import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/Logoprincipal.png'; // Importamos la imagen del logo


const Navbar = ({ username, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo-container">
                    <a href="https://contableyfinancier7.wixsite.com/rafaelpombotulua" target="_blank" rel="noopener noreferrer" title="Rafael Pombo">
                        <img src={logo} alt="Rafael Pombo" className="rafaelpombo-logo"/>
                    </a>
                </div>
                
                {username && (
                    <div className="user-info">
                        <span className="user-welcome">Bienvenido(a), {username}</span>
                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;