// src/App.jsx

import React, { useState } from "react";
import LoginPage from "./pages/Loginpage.jsx"; 
import HomePage from "./pages/HomePage.jsx";
import "./App.css";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Navigation } from "./components/navigation.jsx";  


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;