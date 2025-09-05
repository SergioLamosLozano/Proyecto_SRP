import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 👇 LÍNEA CORREGIDA
import "../components/Loginpage.css"; 

// Importamos todas las imágenes desde la carpeta de assets
import leaf01 from '../assets/leaf_01.png';
import leaf02 from '../assets/leaf_02.png';
import leaf03 from '../assets/leaf_03.png';
import leaf04 from '../assets/leaf_04.png';
import bg from '../assets/bg.jpg';
import girl from '../assets/girl.png';
import trees from '../assets/trees.png';

function LoginPage() {
  // 1. Definimos el usuario y contraseña predeterminados
  const DEFAULT_USERNAME = "admin";
  const DEFAULT_PASSWORD = "contraseña123";

  // 2. Estados para los inputs y el mensaje de error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 3. Hook para navegar a otra página
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      // Si las credenciales son correctas, navega a /home
      console.log("Login exitoso!");
      navigate("/home");
    } else {
      // Si no, muestra un error
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <section>
      <div className="leaves">
        <div className="set">
          <div><img src={leaf01} alt="leaf"/></div>
          <div><img src={leaf02} alt="leaf"/></div>
          <div><img src={leaf03} alt="leaf"/></div>
          <div><img src={leaf04} alt="leaf"/></div>
          <div><img src={leaf01} alt="leaf"/></div>
          <div><img src={leaf02} alt="leaf"/></div>
          <div><img src={leaf03} alt="leaf"/></div>
          <div><img src={leaf04} alt="leaf"/></div>
        </div>
      </div>
      <img src={bg} className="bg" alt="background"/>
      <img src={girl} className="girl" alt="girl riding bike"/>
      <img src={trees} className="trees" alt="trees"/>
      {/* 4. Usamos una etiqueta <form> y asociamos el evento onSubmit */}
      <form className="login" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <div className="inputBox">
          {/* 5. Conectamos los inputs con el estado */}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="inputBox">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="inputBox">
          <input type="submit" value="Login" id="btn" />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div className="group">
          <a href="#">Forget Password</a>
          <a href="#">Signup</a>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;