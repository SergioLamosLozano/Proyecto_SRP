import React, { useState } from "react";
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
    <div className="container active">
      {/* Panel decorativo izquierdo */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" disabled>
            Register
          </button>
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
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
