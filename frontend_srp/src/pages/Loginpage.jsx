// Importamos los 'hooks' de React que vamos a necesitar.
// useState nos permite añadir estado a nuestros componentes funcionales.
import React, { useState } from "react";
// useNavigate es un hook de react-router-dom que nos permite navegar programáticamente entre rutas.
import { useNavigate } from "react-router-dom";
// Importamos la hoja de estilos CSS para este componente.
import "../styles/Loginpage.css"; 

// Importamos todas las imágenes que se usarán en la página de login.
// Esto es una buena práctica para que el sistema de empaquetado (como Webpack o Vite) las procese correctamente.
import leaf01 from '../assets/leaf_01.png';
import leaf02 from '../assets/leaf_02.png';
import leaf03 from '../assets/leaf_03.png';
import leaf04 from '../assets/leaf_04.png';
import bg from '../assets/bg.jpg';
import girl from '../assets/girl.png';
import trees from '../assets/trees.png';
import { validationUser } from "../components/Cruds.jsx";






// Definimos el componente LoginPage. Recibe una prop 'onLoginSuccess'.
// 'onLoginSuccess' es una función que se llamará desde el componente padre (App.jsx) cuando el login sea exitoso.
function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);
    
    // Hook para navegar a otra página
    // 'navigate' es una función que podemos llamar para redirigir al usuario a otra ruta.
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const data = await validationUser(username, password);
        setUserData(data);
        setError("");
        // Redirigir basado en el rol del usuario
        // Asumimos que la respuesta de la API (el objeto 'data') incluye una propiedad 'rol'
        switch (data.rol) {
          case 'docente':
            navigate("/docentes");
            break;
          case 'coordinacion':
            navigate("/coordinacion");
            break;
          default:
            // Para otros roles (secretaria, padres) o si no hay rol, ir a una página genérica
            navigate("/home");
            break;
        }
      } catch (err) {
        setError(err.error || "Credenciales inválidas");
        console.log(err);
        setUserData(null);
        }
  };

  // El JSX que renderiza el componente.
  return (
    <section>
      {/* Esta parte es principalmente decorativa, para el fondo animado de hojas. */}
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
      {/* Imágenes de fondo y decorativas */}
      <img src={bg} className="bg" alt="background"/>
      <img src={girl} className="girl" alt="girl riding bike"/>
      <img src={trees} className="trees" alt="trees"/>
      {/* 4. Usamos una etiqueta <form> y asociamos el evento onSubmit con nuestra función handleLogin. */}
      <form className="login" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <div className="inputBox">
          {/* 5. Conectamos los inputs con el estado de React. */}
          {/* 'value={username}' asegura que el input siempre muestre el valor del estado 'username'. */}
          {/* 'onChange' se dispara cada vez que el usuario escribe algo. La función actualiza el estado 'username'. */}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="inputBox">
          {/* Lo mismo para el campo de contraseña. */}
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="inputBox">
          <input type="submit" value="Login" id="btn" />
        </div>
        {/* Renderizado condicional: Este párrafo solo se muestra si el estado 'error' tiene algún texto. */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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