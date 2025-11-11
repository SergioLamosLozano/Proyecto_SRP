import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";

function Logout() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.first_name || decoded.username || "Usuario");
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    setUsername(null);
  };

  return (
    <div className="Logout">
      <Navbar username={username} onLogout={handleLogout} />
    </div>
  );
}

export default Logout;
