import Header from './components/organisms/header'
import Inicio from './features/Home/pages/HomePage'
import Footer from './components/organisms/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Categorias from './features/Home/pages/Categorias';
import Ofertas from './features/Home/pages/Ofertas';
import Servicios from './features/Home/pages/Servicios';
import SobreNosotros from './features/Home/pages/SobreNosotros';
import Inicioseccion from './features/Home/pages/inicioseccion';
import Registro from './features/Home/pages/Registro';
import EditProfile from './components/pages/EditProfile/EditProfile';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/contacto" element={<Servicios />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/inicio-section" element={<Inicioseccion />} />
        <Route path='/Registro' element={<Registro/>} />
        <Route path="/configuracion" element={<EditProfile />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </Router>
  )
}

export default App;
