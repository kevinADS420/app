
import servicios from '../../../assets/images/SERVICIOS.jpg'
import '../../../style/servicios.css';

function Servicios() {
  return (
    <>  
    
      
        <h1 className='container23'> SERVICIOS BRINDADOS AL CLIENTE</h1>
      <div className='Containerimg'>
        <img className='imagen' src={servicios} alt="" />
      </div >
        <p className='texto2'>
        <h2> Permitenos ayudarte en tu alimentación</h2>
        </p>
      

          <div>
            
            < p className='text'>Nuestra app de frutas y verduras te ofrece una compra rápida y fácil, diseñada para que encuentres tus productos favoritos en segundos y completes tu pedido de forma segura. Nos aseguramos de la frescura y calidad de cada producto, trabajando con los mejores proveedores. Además, contamos con un sistema de entregas puntual para que recibas todo en óptimas condiciones. Nuestro equipo brinda atención personalizada para resolver cualquier duda, y disfrutarás de promociones exclusivas que te permitirán ahorrar en cada compra. ¡Descarga nuestra app y disfruta de productos frescos y saludables en la comodidad de tu hogar!</p>
          </div>
      
          
          <ul>
            <li>
            Entrega Rápida y Segura: Nos encargamos de la logística para que los productos lleguen frescos y en óptimas condiciones al consumidor. Garantizamos una cadena de entrega eficiente, reduciendo tiempos y maximizando la frescura de los alimentos.</li>
            <br />
            <li className='letra'>Precios Justos y Sin Intermediarios: Nuestros productores pueden vender directamente a sus clientes sin depender de intermediarios, lo que les permite obtener precios justos por sus productos y mejorar sus márgenes de ganancia.</li>
            <li className='letra'>Promociones y Ofertas Especiales: Los campesinos podrán acceder a campañas de promoción dentro de la app, ofreciendo descuentos y ofertas exclusivas que aumentan las ventas de productos frescos en temporadas específicas.</li>
            <li className='letra'>Gestión de Pedidos Simplificada: La app cuenta con un sistema de gestión de inventarios y pedidos, para que los campesinos puedan administrar su producción de manera sencilla, evitando el exceso o la falta de productos en el mercado.</li>
            <li className='letra'>Apoyo Técnico y Asesoramiento: Ofrecemos soporte técnico constante para garantizar que los campesinos puedan utilizar la plataforma de manera eficiente y aprovechar al máximo todas sus funcionalidades.</li>
            <li className='letra'>Mercado Local Directo: Conectamos a los campesinos con compradores locales y supermercados, impulsando el comercio justo y promoviendo productos frescos directamente desde el campo a la mesa</li>

            </ul>


    </>
  );
}

export default Servicios;