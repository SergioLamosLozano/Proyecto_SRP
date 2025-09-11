import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Loginpage.css"
import { login } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import 'boxicons/css/boxicons.min.css';

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Agregar clase al body para estilos específicos de login
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
      // Limpiar estilos del #root para evitar conflictos
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.style.display = '';
        rootElement.style.justifyContent = '';
        rootElement.style.alignItems = '';
        rootElement.style.flexDirection = '';
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(form.username, form.password);
      const token = res.data.access;
      localStorage.setItem("token", token);
      onLogin();
      const decoded = jwtDecode(token);
      const rol = decoded.rol || decoded.role || decoded["user"]["rol"];

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Inicio de sesión exitoso`,
        text: `Bienvenido ${decoded.username}`,
      });

      if (rol === "secretaria") {
        navigate("/secretaria");
      } else if (rol === "coordinacion") {
        navigate("/coordinacion");
      } else if (rol === "docente") {
        navigate("/docente");
      } else {
        navigate("/NotFound");
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Credenciales no válidas",
        text: `Por favor intente nuevamente.`,
      });
      setForm({ username: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Panel lateral izquierdo */}
      <div className="toggle-panel">
        <div className="toggle-content">
          <img src="/Logoprincipal.png" alt="Logo Rafael Pombo" className="login-logo" />
          <h1>Hello, Welcome!</h1>
          <p>Accede al Sistema de Registro de Profesores</p>
          
          <div className="social-login">
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=100063483346748" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="social-link facebook">
                <i className='bx bxl-facebook'></i>
              </a>
              <a href="https://www.instagram.com/rafaelpombotulua/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="social-link instagram">
                <i className='bx bxl-instagram'></i>
              </a>
              <a href="https://api.whatsapp.com/message/E3XV7S5IKPXJD1?autoload=1&app_absent=0" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="social-link whatsapp">
                <i className='bx bxl-whatsapp'></i>
              </a>
              <a href="https://contableyfinancier7.wixsite.com/rafaelpombotulua" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="social-link website">
                <i className='bx bx-globe'></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Cargando..." : "Login"}
          </button>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
