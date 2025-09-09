import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

function Logout() {

    const [username, setUsername] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username || decoded.name || 'Usuario');
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            localStorage.removeItem('token');
        }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUsername(null);
    };

    return (      
        <div className="Logout">
            <Navbar username={username} onLogout={handleLogout} />
        </div>
    );

}

export default Logout;