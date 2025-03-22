import React, { useEffect, useState } from 'react';
import servicios from '../../../assets/images/upscalemedia-transformed.jpeg';
// Importa imágenes adicionales para el carrusel (ajusta las rutas según tu estructura de proyecto)
// import imagen1 from '../../../assets/images/frutas1.jpg';
// import imagen2 from '../../../assets/images/verduras1.jpg';
// import imagen3 from '../../../assets/images/campo1.jpg';
import '../../../style/servicios.css';

interface CarouselImage {
  url: string;
  title: string;
  description: string;
}

const Servicios: React.FC = () => {
  // Estado para controlar el carrusel
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Imágenes del carrusel (usa las que importaste o URLs temporales)
  const carouselImages: CarouselImage[] = [
    { 
      url: servicios, 
      title: "¡PRODUCTOS FRESCOS DEL CAMPO A TU MESA!", 
      description: "Disfruta de la mejor calidad en frutas y verduras."
    },
    { 
      url: "https://source.unsplash.com/random/1200x800/?fruits", 
      title: "VARIEDAD DE FRUTAS DE TEMPORADA", 
      description: "Ofrecemos las mejores frutas cultivadas con dedicación."
    },
    { 
      url: "https://source.unsplash.com/random/1200x800/?vegetables", 
      title: "VERDURAS FRESCAS Y SALUDABLES", 
      description: "Apoyamos a los agricultores locales con precios justos."
    },
    { 
      url: "https://source.unsplash.com/random/1200x800/?farm", 
      title: "DIRECTO DEL PRODUCTOR", 
      description: "Sin intermediarios, garantizando calidad y frescura."
    }
  ];

  // Cambiar automáticamente las diapositivas cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Función para cambiar a la diapositiva anterior
  const prevSlide = (): void => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
    );
  };

  // Función para cambiar a la siguiente diapositiva
  const nextSlide = (): void => {
    setCurrentSlide((prevSlide) => 
      prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  // Función para seleccionar una diapositiva específica
  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <div className="servicios-page">
      <div className="servicios-header">
        <h1>SERVICIOS BRINDADOS AL CLIENTE</h1>
      </div>
      
      {/* Carrusel de imágenes */}
      <div className="carousel-container">
        {carouselImages.map((slide, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.url} alt={`Slide ${index + 1}`} />
            <div className="carousel-overlay">
              <div className="carousel-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="carousel-arrows">
          <div className="carousel-arrow" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <div className="carousel-arrow" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
        
        <div className="carousel-controls">
          {carouselImages.map((_, index) => (
            <div 
              key={index} 
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Mantenemos el banner original pero oculto con CSS */}
      <div className="servicios-banner">
        <img src={servicios} alt="Servicios de frutas y verduras" />
        <div className="banner-overlay"></div>
      </div>
      <div className="banner-text">
        <h2>!PRODUCTOS FRESCOS DEL CAMPO A TU MESA!</h2>
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