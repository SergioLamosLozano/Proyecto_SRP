import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/Loginpage.css";

import LoginPage from "./pages/Loginpage";
import SecretariaPage from "./pages/SecretariaPage";
import CoordinacionPage from "./pages/CoordinacionPage";
import DocentesPage from "./pages/DocentesPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PadresPage from "./pages/PadresPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/secretaria"
            element={
              <ProtectedRoute role="secretaria">
                <SecretariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinacion"
            element={
              <ProtectedRoute role="coordinacion">
                <CoordinacionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docente"
            element={
              <ProtectedRoute role="docente">
                <DocentesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/padres"
            element={
              <ProtectedRoute role={["padre", "padres", "acudiente"]}>
                <PadresPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
