import React from 'react';
import { AdminsList } from '../components/Adminslist';

function HomePage() {
return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>¡Bienvenido!</h1>
    <AdminsList />
    <p>Has iniciado sesión correctamente.</p>
    </div>
);
}

export default HomePage;