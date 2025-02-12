import { Link } from 'react-router-dom';
import '../../../style/Header.css';

function ButtonHeader() {
  return (
    <div className="containerButtons">
      <Link to="/" className="buttonInicio">Inicio</Link>
      <Link to="/categorias" className="buttonCategorias">Categorías</Link>
      <Link to="/ofertas" className="buttonOfertas">Ofertas</Link>
      <Link to="/contacto" className="buttonContacto">Contacto</Link>
      <Link to="/sobre-nosotros" className="buttonSobreNosotros">Sobre Nosotros</Link>
      <Link to="/inicio-section" className="buttonInicioSection">Inicio de Section</Link>
    </div>
  );
}

export default ButtonHeader;