// src/App.jsx

import React, { useState } from "react";
import LoginPage from "./pages/Loginpage.jsx"; 
import HomePage from "./pages/HomePage.jsx";
import DocentesPage from "./pages/DocentesPage.jsx";
import CoordinacionPage from "./pages/CoordinacionPage.jsx";
import "./App.css";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/docentes" element={<DocentesPage />} />
        <Route path="/coordinacion" element={<CoordinacionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;