import React from 'react';
import Navbar from '../components/Navbar'; // Importamos el Navbar

function SecretariaPage() {
return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Bienvenido, Secretaría</h1>
        <p>Esta es la página principal para el personal de secretaría.</p>
      </div>
    </>
);
}

export default SecretariaPage;