import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ role, children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" />;

    const decoded = jwtDecode(token);
    if (decoded.rol !== role) return <Navigate to="/404" />;

    return children;
}

export default ProtectedRoute;
