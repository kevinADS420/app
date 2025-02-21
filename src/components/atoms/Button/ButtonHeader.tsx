import { Link } from 'react-router-dom';
import '../../../style/Header.css';

function ButtonHeader() {
  return (
    <div className="containerButtons">
      <Link to="/" className="buttonInicio"><button className="buttonInicio">Inicio</button></Link>
      <Link to="/categorias" className="buttonCategorias"><button className="buttonCategorias">Categorías</button></Link>
      <Link to="/ofertas" className="buttonOfertas"><button className="buttonOfertas">Ofertas</button></Link>
      <Link to="/contacto" className="buttonContacto"><button className="buttonContacto">Preguntas frecuentes</button></Link>
      <Link to="/sobre-nosotros" className="buttonSobreNosotros"><button className="buttonSobreNosotros">Sobre Nosotros</button></Link>
      <Link to="/inicio-section" className="buttonInicioSection"><button className="buttonInicioSection">Inicio de Seccion</button></Link>
    </div>
  );
}

export default ButtonHeader;