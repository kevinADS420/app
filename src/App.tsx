import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/organisms/header';
import Footer from './components/organisms/Footer';
import HomePage from './features/Home/pages/HomePage';
import Productos from './features/Home/pages/Productos';
import Servicios from './features/Home/pages/Servicios';
import SobreNosotros from './features/Home/pages/SobreNosotros';
import InicioSection from './features/Home/pages/inicioseccion';
import RegistroUnificado from './features/Home/pages/RegistroUnificado';
import ProtectedRoute from './features/Auth/components/ProtectedRoute';
import RegistroProductos from './features/Home/pages/RegistroProduc';
import EditProfile from './components/pages/EditProfile/EditProfile';
import PagoExitoso from './features/Home/pages/PagoExitoso';
import PagoFallido from './features/Home/pages/PagoFallido';
import PagoPendiente from './features/Home/pages/PagoPendiente';
import WebhookHandler from './features/Home/pages/webhook';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/inicio-section" element={<InicioSection />} />
          <Route path="/registro" element={<RegistroUnificado />} />
          <Route path="/RegistroProductos" element={
            <ProtectedRoute>
              <RegistroProductos/>
            </ProtectedRoute>
          }/>
          <Route path="/editar-perfil" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }/>
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-fallido" element={<PagoFallido />} />
          <Route path="/pago-pendiente" element={<PagoPendiente />} />
          <Route path="/webhook" element={<WebhookHandler />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;