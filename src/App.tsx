// Actualización para App.tsx
import Header from './components/organisms/header'
import Inicio from './features/Home/pages/HomePage'
import Footer from './components/organisms/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Productos from './features/Home/pages/Productos';
import Servicios from './features/Home/pages/Servicios';
import SobreNosotros from './features/Home/pages/SobreNosotros';
import Inicioseccion from './features/Home/pages/inicioseccion';
import Registro from './features/Home/pages/Registro';
import RegistroUnificado from './features/Home/pages/RegistroUnificado';
import EditProfile from './components/pages/EditProfile/EditProfile';
import RegistroProductos from './features/Home/pages/RegistroProduc';
import GoogleCallback from './features/Home/pages/GoogleCallback';
import Dashboard from './features/Home/pages/Dashboard';
import AuthCheck from './components/AuthCheck';
import AuthTest from './components/AuthTest';
import FetchTest from './components/FetchTest';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/inicio-section" element={<Inicioseccion />} />
        <Route path="/registro" element={<RegistroUnificado />} />
        <Route path="/registro-antiguo" element={<Registro />} />
        <Route path="/configuracion" element={<EditProfile />} />
        <Route path="/RegistroProductos" element={<RegistroProductos/>}/>
        
        {/* Ruta para el callback de Google actualizada */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        
        {/* Asegurar que tengamos un wildcard para capturar parámetros adicionales */}
        <Route path="/auth/google/callback/*" element={<GoogleCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta para verificar la autenticación */}
        <Route path="/auth-check" element={<AuthCheck />} />
        
        {/* Ruta para probar la autenticación */}
        <Route path="/auth-test" element={<AuthTest />} />
        
        <Route path="/fetch-test" element={<FetchTest />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </Router>
  )
}

export default App;