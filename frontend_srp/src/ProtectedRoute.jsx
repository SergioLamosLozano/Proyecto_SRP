// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ role, children }) {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    const roles = Array.isArray(role) ? role : [role];

    // Verifica expiración del token
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      sessionStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    if (!roles.includes(decoded.rol)) {
      return <Navigate to="/404" replace />;
    }

    return children;
  } catch (e) {
    console.error("Error decodificando token:", e);
    sessionStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;
