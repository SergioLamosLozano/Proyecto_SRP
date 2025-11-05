import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Loginpage.css";
import { login } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "boxicons/css/boxicons.min.css";
import Logout from "../components/Logout";
import Footer from '../components/Footer';

function LoginPage({ onLogin }) {
  const RP = () =>
    window.open(
      "https://contableyfinancier7.wixsite.com/rafaelpombotulua",
      "_blank"
    );
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Agregar clase al body para estilos específicos de login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
      // Limpiar estilos del #root para evitar conflictos
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.style.display = "";
        rootElement.style.justifyContent = "";
        rootElement.style.alignItems = "";
        rootElement.style.flexDirection = "";
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    try {
      const res = await login(form.username, form.password);
  const token = res.data.access;
  const refresh = res.data.refresh;
  // Guardar el token en sessionStorage para que persista mientras la pestaña/navegador esté abierta
  sessionStorage.setItem("token", token);
  if (refresh) sessionStorage.setItem('refreshToken', refresh);
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
      } else if (rol === "padre" || rol === "padres" || rol === "acudiente") {
        navigate("/padres");
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
    <>
      <section className="Login-padre">
        <div className="Login-fondo"></div>
        <div className="Login-container">
          <div className="Login-container-2">
            <div className="Login-container-3">
              <img className="Login-logo" onClick={RP} src="./Logo.png" />
              <a>¡Bienvenido!</a>
              <section>
                <p>
                  Pagina de administracion, institucion educativa Rafael Pombo
                </p>
              </section>
              <h1>Redes</h1>
              <div className="Login-container-4">
                <div className="whatsapp">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                    />
                  </svg>
                  <h2>Whatsapp</h2>
                </div>
                <div className="instagram">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                  <h2>Instagram</h2>
                </div>
                <div className="facebook">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  <h2>Facebook</h2>
                </div>
                <div className="network">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2 0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.477 2 2 6.477 2 12A10 10 0 0 0 12 22a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"
                    />
                  </svg>
                  <h2>Network</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="Login-container-5">
            <h1>Inicio de Sesión</h1>
            <div className="Login-conetendor-Inputs">
              <form className="Login-form" onSubmit={handleSubmit}>
                <input
                  name="username"
                  placeholder="Nombre de usuario"
                  className="Login-Inputs"
                  value={form.username || ""} // fallback para evitar undefined
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                  }}
                />

                <input
                  type={showPassword ? "text" : "password"} // alterna entre password y text
                  name="password"
                  placeholder="Contraseña"
                  className="Login-Inputs"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="show-password-btn"
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </form>
            </div>
            <div className="Login-conetendor-buttons">
              <button className="Login-buttons" onClick={handleSubmit}>
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
