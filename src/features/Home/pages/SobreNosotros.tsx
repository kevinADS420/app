import { FaSeedling, FaQuoteLeft, FaQuoteRight, FaLightbulb, FaHistory, FaGlobe, FaHandHoldingHeart, FaEye, FaBullseye, FaCheckCircle, FaUsers, FaStore, FaTruck, FaAppleAlt, FaLeaf, FaStar, FaHeart, FaHandshake, FaAward } from 'react-icons/fa';
import finca from '../../../assets/images/finca.jpg'
import platanos from '../../../assets/images/platanos.jpg'
import obrero from '../../../assets/images/obrero.jpg'
import '../../../style/SobreNosotros.css';


function SobreNosotros() {
  return (
    <>
      <div className="background-pattern"></div>
      <section className="sobre-nosotros">
        <div className="container">
          <div className="header-section">
            <div className="decorative-line"></div>
            <h1 className="animate-title">Sobre Nosotros</h1>
            <div className="decorative-line"></div>
          </div>

          <div className="diferenciadores hover-card">
            <div className="icon-header">
              <h2>Que nos hace diferentes</h2>
            </div>
            <p>Nuestro compromiso con el desarrollo rural y la economía local fortalece a los productores y promueve prácticas sostenibles. Trabajamos directamente con cooperativas agrícolas locales, garantizando precios justos y eliminando intermediarios. Impulsamos la agricultura sostenible mediante capacitación y apoyo a métodos que protegen la biodiversidad. Al comprar nuestros productos, obtienes alimentos más frescos mientras apoyas un sistema alimentario más justo y respetuoso con el medio ambiente.</p>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <FaUsers />
              <h3>+1000</h3>
              <p>Productores Activos</p>
            </div>
            <div className="stat-card">
              <FaStore />
              <h3>+500</h3>
              <p>Comercios Conectados</p>
            </div>
            <div className="stat-card">
              <FaTruck />
              <h3>+5000</h3>
              <p>Entregas Realizadas</p>
            </div>
          </div>

          <div className="imagen-galeria">
            <div className="imagen-card">
              <div className="image-wrapper">
                <img src={finca} alt="Imagen 1" className="hover-effect" />
                <div className="imagen-overlay">
                  <h3> Nuestros Productores</h3>
                  <p>Conoce a quienes cultivan tu comida</p>
                </div>
              </div>
            </div>
            <div className="imagen-card">
              <div className="image-wrapper">
                <img src={platanos} alt="Imagen 2" className="hover-effect" />
                <div className="imagen-overlay">
                  <h3> Productos Frescos</h3>
                  <p>Calidad garantizada del campo a tu mesa</p>
                </div>
              </div>
            </div>
            <div className="imagen-card">
              <div className="image-wrapper">
                <img src={obrero}alt="Imagen 3" className="hover-effect" />
                <div className="imagen-overlay">
                  <h3> Agricultura Sostenible</h3>
                  <p>Comprometidos con el medio ambiente</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="vision-mision-container">
            <div className="vision-card fade-in">
              <div className="icon-header">
                <h2>Nuestra Visión</h2>
              </div>
              <p>Ser la plataforma líder en la transformación del comercio agrícola local, creando un ecosistema digital inclusivo que empodere a los productores rurales y garantice el acceso a alimentos frescos y de calidad para todos los consumidores del Quindío y, eventualmente, de Colombia.</p>
            </div>

            <div className="mision-card fade-in">
              <div className="icon-header">
                <h2>Nuestra Misión</h2>
              </div>
              <p>Cerrar la brecha entre productores y consumidores mediante una plataforma digital innovadora que:</p>
              <ul>
                <li><FaCheckCircle /> Conecta directamente a campesinos con compradores finales</li>
                <li><FaCheckCircle /> Promueve la inclusión digital de comunidades rurales</li>
                <li><FaCheckCircle /> Garantiza precios justos para productores y consumidores</li>
              </ul>
            </div>
          </div>


          <div className="valores">
            <div className="icon-header">
              <h2>Nuestros valores</h2>
            </div>
            <ul className="valores-lista">
              <li className="valor-item">
                <FaHandshake />
                <div>
                  <strong>Compromiso:</strong>
                  <p>Apoyamos a los productores locales.</p>
                </div>
              </li>
              <li className="valor-item">
                <FaAward />
                <div>
                  <strong>Calidad:</strong>
                  <p>Garantizamos productos frescos y de alta calidad.</p>
                </div>
              </li>
              <li className="valor-item">
                <FaLeaf />
                <div>
                  <strong>Sostenibilidad:</strong>
                  <p>Fomentamos prácticas agrícolas responsables</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="decorative-footer">
        <div className="wave"></div>
      </div>
    </>
  );
}

export default SobreNosotros;