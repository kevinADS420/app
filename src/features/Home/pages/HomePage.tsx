import Eslogan from "../atoms/AtomsInicio/Texto/Eslogan"
import ButoonsProducts from '../atoms/AtomsInicio/Buttons/ButtonsProducts'
import '../../../style/inicio.css'
import cultivoOne from '../../../assets/images/cultivo 1.jpg'

function inicio() {

    return (
      <>
        <div className="containerInicio">
          <Eslogan/>
          <ButoonsProducts/>
        </div>

        <div className="containerContet">

          <h3> ¿Qué hace especial su servicio de venta de frutas y verduras? </h3>

          <p>Comprar frutas y verduras con nosotros es apostar por frescura, calidad y sostenibilidad. Seleccionamos cuidadosamente cada producto para garantizar que llegue a tu mesa en su mejor estado, ofreciendo opciones directamente de los agricultores locales. Además, apoyas prácticas responsables que promueven el comercio justo y reducen el impacto ambiental. ¡Elige lo mejor para ti y tu familia mientras contribuyes a un futuro más saludable! 🌱🍎</p>

          <img src={cultivoOne} alt="" />

        </div>

      </>
    )
  }
  
  export default inicio