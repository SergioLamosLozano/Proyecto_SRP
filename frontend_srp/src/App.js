import React from 'react';
import './components/Loginpage.css'; // Puedes mantener o borrar los estilos por defecto de App.css
import LoginPage from './pages/Loginpage';
import ProtectedRoute from './ProtectedRoute';
import CoordinacionPage from './pages/CoordinacionPage';
import Docentespage from './pages/DocentesPage';

function App() {

  return (
  <div className="App">
    <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage/>} />
              <Route path="/secretaria" element={
                <ProtectedRoute role="secretaria"><Secretaria /></ProtectedRoute>
              } />
              <Route path="/coordinacion" element={
                <ProtectedRoute role="coordinacion"><CoordinacionPage/></ProtectedRoute>
              } />
              <Route path="/docentes" element={
                <ProtectedRoute role="docentes"><Docentespage/></ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;