// src/App.jsx

import React from "react";
import LoginPage from "./pages/Loginpage.jsx"; 
import HomePage from "./pages/HomePage.jsx";
import "./App.css";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Navigation } from "./components/navigation.jsx";  


function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;