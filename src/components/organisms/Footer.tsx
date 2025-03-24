import LogoTwo from '../../assets/images/logoTwo.png'
import Contato from '../atoms/textFooter/text'
import Butoons from '../atoms/Button/ButtonFooter'
import { FiInstagram } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import '../../style/Footer.css'

function App() {

  return (
    <>
        <div className='containerFooter'>
          <div className='containerLogo'>
            <img src={LogoTwo} alt="logo" />
            <p>Con nosotros, estás haciendo el cambio hacia una alimentación más saludable y un planeta más sostenible. ¡Elige lo bueno, elige lo mejor!</p>
        </div>
        <div className='contacto'>
            <Contato/>
        </div>
        <div>
            <Butoons/>
        </div>
      </div>
      <div className='IconsRedes'>
          <FiInstagram onClick={()=>console.log("jws")}/>
          <FaFacebookF onClick={()=>console.log("jws")}/>
          <FaXTwitter onClick={()=>console.log("jws")}/>
      </div>
    </>
  )
}

export default App
