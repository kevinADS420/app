import '../../../style/inicio.css'
import Chatbot from '../services/Chatbot';
import Frescura from '../../../assets/images/frescura.jpg' 
import ApoyoLocal from '../../../assets/images/apoyoLocal.jpg'
import Sostenibilas from '../../../assets/images/sostenibilidad.jpg' 
import Pimenton from '../../../assets/images/Pimenton.jpg'
import Planato from '../../../assets/images/platano.jpg'
import Tomate from '../../../assets/images/toamte.jpg'


function Inicio() { 

  return (
    <>
      <div>
        <section className="hero">
          <div className="hero-content">
            <h1>Productos Frescos Directo a tu Mesa</h1>
            <p>Apoyamos a productores locales y te ofrecemos frutas y verduras de la más alta calidad.</p>
            <a href="#" className="btn">Explora Nuestros Productos</a>
          </div>
        </section>

        <section className="about-us">
          <h2>Sobre HuertoMKT</h2>
          <p>En HuertoMKT, creemos en la importancia de apoyar a los productores locales y ofrecer productos frescos y saludables a nuestros clientes. Nuestra misión es conectar a los agricultores de tu región con tu mesa, reduciendo intermediarios y garantizando la calidad de cada producto.</p>
          <p>Nos comprometemos con la sostenibilidad y la agricultura responsable, promoviendo prácticas que cuidan el medio ambiente y fomentan el desarrollo de las comunidades locales.</p>
        </section>

        <section className="features">
          <div className="feature">
            <img src={Frescura} alt="Frescura Garantizada" />
            <h3>Frescura Garantizada</h3>
            <p>Productos recién cosechados para tu salud.</p>
          </div>
          <div className="feature">
            <img src={ApoyoLocal} alt="Apoyo Local" />
            <h3>Apoyo Local</h3>
            <p>Conectamos directamente con productores de tu región.</p>
          </div>
          <div className="feature">
            <img src={Sostenibilas} alt="Sostenibilidad" />
            <h3>Sostenibilidad</h3>
            <p>Agricultura responsable y amigable con el medio ambiente.</p>
          </div>
        </section>

        <section className="products">
          <h2>Nuestros Productos Destacados</h2>
          <div className="product-grid">
            <div className="product">
              <img src={Pimenton} alt="Producto 1" />
              <h3>Pimenton</h3>
              <p>Descripción breve del producto.</p>
              <span className="price">COP 1,200 K</span>
            </div>
            <div className="product">
              <img src={Planato} alt="Producto 2" />
              <h3>Platanos</h3>
              <p>Descripción breve del producto.</p>
              <span className="price">COP 2,319 K</span>
            </div>
            <div className="product">
              <img src={Tomate} alt="Producto 3" />
              <h3>Toamte</h3>
              <p>Descripción breve del producto.</p>
              <span className="price">COP $6,300 k</span>
            </div>
          </div>
        </section>
        <Chatbot />
      </div>
    </>
  );
}

export default Inicio;