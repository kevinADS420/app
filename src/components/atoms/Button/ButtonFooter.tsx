import { Link } from 'react-router-dom';
import '../../../style/Footer.css'

function ButtonFooter() {

  return (
    <>
      <div className='containerButton'>
        <Link to="/" className="buttonInicio">Inicio</Link>
        <Link to="/productos" className="buttonCategorias">Productos</Link>
        <Link to="/servicios" className="buttonContacto">Servicios</Link>
        <Link to="/sobre-nosotros" className="buttonSobreNosotros">Sobre Nosotros</Link>
        <Link to="/inicio-section" className="buttonInicioSection">Inicio de Sección</Link> 
      </div>
    </>
  )
}

export default ButtonFooter