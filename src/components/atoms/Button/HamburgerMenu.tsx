import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../style/Header.css'; // Importa el archivo de estilo

// Componente para el menú hamburguesa
const HamburgerMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="hamburger-container">
      {/* Botón del menú hamburguesa */}
      <button className="hamburger" onClick={toggleMenu}>
        <span className={`line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* Menú desplegable cuando está abierto */}
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <Link to="/" className="buttonInicio">Inicio</Link>
          <Link to="/categorias" className="buttonCategorias">Categorías</Link>
          <Link to="/ofertas" className="buttonOfertas">Ofertas</Link>
          <Link to="/contacto" className="buttonContacto">Contacto</Link>
          <Link to="/sobre-nosotros" className="buttonSobreNosotros">Sobre Nosotros</Link>
          <Link to="/inicio-section" className="buttonInicioSection">Inicio de Section</Link>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;


