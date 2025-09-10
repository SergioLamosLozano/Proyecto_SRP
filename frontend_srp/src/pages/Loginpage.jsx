// Importamos los 'hooks' de React que vamos a necesitar.
// useState nos permite añadir estado a nuestros componentes funcionales.
import React, { useState } from "react";
// useNavigate es un hook de react-router-dom que nos permite navegar programáticamente entre rutas.
import { useNavigate } from "react-router-dom";
// Importamos la hoja de estilos CSS para este componente.
import "../styles/Loginpage.css";
import { login } from "../api/auth";
import { jwtDecode } from "jwt-decode";

// Importamos todas las imágenes que se usarán en la página de login.
// Esto es una buena práctica para que el sistema de empaquetado (como Webpack o Vite) las procese correctamente.
import leaf01 from "../assets/leaf_01.png";
import leaf02 from "../assets/leaf_02.png";
import leaf03 from "../assets/leaf_03.png";
import leaf04 from "../assets/leaf_04.png";
import bg from "../assets/bg.jpg";
import girl from "../assets/girl.png";
import trees from "../assets/trees.png";
import Swal from "sweetalert2";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

      //alert('Inicio de sesión exitoso '+ decoded.username);
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
      } else navigate("/NotFound");
    } catch (error) {
      //setError('Credenciales no válidas');
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

  // El JSX que renderiza el componente.
  return (
    <section>
      {/* Esta parte es principalmente decorativa, para el fondo animado de hojas. */}
      <div className="leaves">
        <div className="set">
          <div>
            <img src={leaf01} alt="leaf" />
          </div>
          <div>
            <img src={leaf02} alt="leaf" />
          </div>
          <div>
            <img src={leaf03} alt="leaf" />
          </div>
          <div>
            <img src={leaf04} alt="leaf" />
          </div>
          <div>
            <img src={leaf01} alt="leaf" />
          </div>
          <div>
            <img src={leaf02} alt="leaf" />
          </div>
          <div>
            <img src={leaf03} alt="leaf" />
          </div>
          <div>
            <img src={leaf04} alt="leaf" />
          </div>
        </div>
      </div>
      {/* Imágenes de fondo y decorativas */}
      <img src={bg} className="bg" alt="background" />
      <img src={girl} className="girl" alt="girl riding bike" />
      <img src={trees} className="trees" alt="trees" />
      {/* 4. Usamos una etiqueta <form> y asociamos el evento onSubmit con nuestra función handleLogin. */}
      <form className="login" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <div className="inputBox">
          <input
            id="username"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputBox">
          {/* Lo mismo para el campo de contraseña. */}
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          ></button>
        </div>
        <div className="inputBox">
          <input type="submit" id="btn" />
        </div>
        {/* Renderizado condicional: Este párrafo solo se muestra si el estado 'error' tiene algún texto. */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <div className="group">
          {/* Estos enlaces actualmente no llevan a ninguna parte funcional. */}
          <a href="#">Forget Password</a>
          <a href="#">Signup</a>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
