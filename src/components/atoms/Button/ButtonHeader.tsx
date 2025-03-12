import { Link } from 'react-router-dom';
import '../../../style/Header.css';
import { useState, useEffect } from 'react';

function ButtonHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    window.addEventListener('userLogin', checkAuth);
    window.addEventListener('userLogout', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLogin', checkAuth);
      window.removeEventListener('userLogout', checkAuth);
    };
  }, []);

  return (
    <div className="containerButtons">
      <Link to="/" className="buttonInicio"><button className="buttonInicio">Inicio</button></Link>
      <Link to="/categorias" className="buttonCategorias"><button className="buttonCategorias">Categorías</button></Link>
      <Link to="/ofertas" className="buttonOfertas"><button className="buttonOfertas">Ofertas</button></Link>
      <Link to="/contacto" className="buttonContacto"><button className="buttonContacto">Servicios</button></Link>
      <Link to="/sobre-nosotros" className="buttonSobreNosotros"><button className="buttonSobreNosotros">Sobre Nosotros</button></Link>
      {!isAuthenticated && (
        <Link to="/inicio-section" className="buttonInicioSection">
          <button className="buttonInicioSection">Inicio de Sesión</button>
        </Link>
      )}
    </div>
  );
}

export default ButtonHeader;