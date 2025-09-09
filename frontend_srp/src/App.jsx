// src/App.jsx

import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

// Lazy load de páginas
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const DocentesPage = lazy(() => import("./pages/DocentesPage.jsx"));
const CoordinacionPage = lazy(() => import("./pages/CoordinacionPage.jsx"));
const SecretariaPage = lazy(() => import("./pages/SecretariaPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));


// Helper para verificar el token de autenticación al cargar la app
const checkAuthToken = () => {
  const token = localStorage.getItem("token");
  // Simplemente verifica si el token existe.
  // La doble negación (!!) convierte el valor (string o null) en un booleano.
  return !!token;
};

// Helper para obtener el rol del usuario desde el token
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Busca el rol en diferentes posibles claves del payload del token
    return decoded.rol || decoded.role || (decoded.user && decoded.user.rol);
  } catch (e) {
    console.error("Error decodificando el token:", e);
    return null;
  }
};

// 🔑 Componente para proteger rutas basado en rol
function RoleBasedRoute({ children, isAuthenticated, allowedRoles }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const userRole = getUserRole();

  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // Si el rol no está permitido, redirige a la página de inicio del usuario o al login
  const homePath = userRole ? `/${userRole}` : "/";
  return <Navigate to={homePath} replace />;
}

function App() {
  // El estado de autenticación ahora se inicializa verificando el token
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthToken());

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['secretaria', 'coordinacion', 'docente']}>
                <HomePage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/docente"
            element={
              <RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['docente']}>
                <DocentesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/coordinacion"
            element={
              <RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['coordinacion']}>
                <CoordinacionPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/secretaria"
            element={
              <RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['secretaria']}>
                <SecretariaPage />
              </RoleBasedRoute>
            }
          />

          {/* Ruta para la página no encontrada */}
          <Route path="/NotFound" element={<NotFound />} />
          {/* Redirección por defecto para cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/NotFound" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
