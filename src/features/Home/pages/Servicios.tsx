import React from 'react';
import servicios from '../../../assets/servicio/mandarina.jpg';
import papaya from '../../../assets/servicio/papaya.jpg';
import palma from '../../../assets/servicio/palma.jpg';
import '../../../style/servicios.css';

const Servicios: React.FC = () => {
  return (
    <div className="servicios-page">
      <div className="servicios-header">
        <h1>SERVICIOS BRINDADOS AL CLIENTE</h1>
      </div>
      
      {/* Imágenes en formato horizontal */}
      <div className="horizontal-images-container">
        <div className="horizontal-image-card">
          <img src={palma} alt="Cultivo de palma" />
          <div className="image-overlay">
            <h3>PRODUCTOS NATURALES</h3>
            <p>Cultivados con amor directo del campo</p>
          </div>
        </div>
        
        <div className="horizontal-image-card">
          <img src={servicios} alt="Mandarinas frescas" />
          <div className="image-overlay">
            <h3>FRUTAS FRESCAS</h3>
            <p>Seleccionadas para garantizar la mejor calidad</p>
          </div>
        </div>
        
        <div className="horizontal-image-card">
          <img src={papaya} alt="Papayas maduras" />
          <div className="image-overlay">
            <h3>DEL CAMPO A TU MESA</h3>
            <p>Sin intermediarios, directo a tu hogar</p>
          </div>
        </div>
      </div>
      
      {/* Banner de texto principal */}
      <div className="servicios-banner-text">
        <h2>¡PRODUCTOS FRESCOS DEL CAMPO A TU MESA!</h2>
      </div>
      
      <div className="servicios-content">
        <div className="servicios-intro">
          <h2>Permítenos ayudarte en tu alimentación</h2>
          <p className="intro-text">
            Nuestra app de frutas y verduras te ofrece una compra rápida y fácil, diseñada para que encuentres tus productos favoritos en segundos y completes tu pedido de forma segura. Nos aseguramos de la frescura y calidad de cada producto, trabajando con los mejores proveedores. Además, contamos con un sistema de entregas puntual para que recibas todo en óptimas condiciones. Nuestro equipo brinda atención personalizada para resolver cualquier duda, y disfrutarás de promociones exclusivas que te permitirán ahorrar en cada compra. ¡Descarga nuestra app y disfruta de productos frescos y saludables en la comodidad de tu hogar!
          </p>
        </div>
        
        <div className="servicios-beneficios">
      <h3>Nuestros Beneficios</h3>
      <ul className="beneficios-lista">
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-truck"></i>
          </div>
          <div className="beneficio-content">
            <h4>Entrega Rápida y Segura</h4>
            <p>Nos encargamos de la logística para que los productos lleguen frescos y en óptimas condiciones al consumidor. Garantizamos una cadena de entrega eficiente, reduciendo tiempos y maximizando la frescura de los alimentos.</p>
          </div>
        </li>
        
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className="beneficio-content">
            <h4>Precios Justos y Sin Intermediarios</h4>
            <p>Nuestros productores pueden vender directamente a sus clientes sin depender de intermediarios, lo que les permite obtener precios justos por sus productos y mejorar sus márgenes de ganancia.</p>
          </div>
        </li>
        
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-tag"></i>
          </div>
          <div className="beneficio-content">
            <h4>Promociones y Ofertas Especiales</h4>
            <p>Los campesinos podrán acceder a campañas de promoción dentro de la app, ofreciendo descuentos y ofertas exclusivas que aumentan las ventas de productos frescos en temporadas específicas.</p>
          </div>
        </li>
        
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="beneficio-content">
            <h4>Gestión de Pedidos Simplificada</h4>
            <p>La app cuenta con un sistema de gestión de inventarios y pedidos, para que los campesinos puedan administrar su producción de manera sencilla, evitando el exceso o la falta de productos en el mercado.</p>
          </div>
        </li>
        
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-headset"></i>
          </div>
          <div className="beneficio-content">
            <h4>Apoyo Técnico y Asesoramiento</h4>
            <p>Ofrecemos soporte técnico constante para garantizar que los campesinos puedan utilizar la plataforma de manera eficiente y aprovechar al máximo todas sus funcionalidades.</p>
          </div>
        </li>
        
        <li className="beneficio-item">
          <div className="beneficio-icon">
            <i className="fas fa-store"></i>
          </div>
          <div className="beneficio-content">
            <h4>Mercado Local Directo</h4>
            <p>Conectamos a los campesinos con compradores locales y supermercados, impulsando el comercio justo y promoviendo productos frescos directamente desde el campo a la mesa.</p>
          </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Servicios;