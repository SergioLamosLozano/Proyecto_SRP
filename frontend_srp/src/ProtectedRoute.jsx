import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function ProtectedRoute({ role, children }) {
    const token = sessionStorage.getItem('token');

    // Si no hay token, considerar recurso no encontrado para evitar exponer rutas
    if (!token) return <Navigate to="/NotFound" replace />;

    let decoded;
    try {
        decoded = jwtDecode(token);
    } catch (e) {
        // token inválido
    console.warn('ProtectedRoute: token inválido', e);
    return <Navigate to="/NotFound" replace />;
    }

    // Nota: no invalidamos la sesión automáticamente por 'exp' aquí.
    // La aplicación mantiene el token en sessionStorage y solo se eliminará al cerrar sesión
    // o el navegador. El backend seguirá retornando 401 si el token no es válido y el
    // interceptor intentará un refresh usando el refreshToken cuando esté disponible.

    // Validar rol si se especificó
    if (role && decoded.rol !== role) {
        return <Navigate to="/NotFound" replace />;
    }

    return children;
}

export default ProtectedRoute;
