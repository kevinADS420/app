import LogoTwo from '../../assets/images/logoTwo.png'
import Contato from '../atoms/textFooter/text'
import Butoons from '../atoms/Button/ButtonFooter'
import iconFacebook from '../../assets/icons/icons8-facebook-30.png'
import icontwitter from '../../assets/icons/icontwitter.png'
import iconIn from '../../assets/icons/icons8-in-30 (1).png'
import { FiInstagram } from "react-icons/fi";
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
          <img className='icon' src={iconFacebook} alt="Facebook" />
          <img className='icon' src={icontwitter} alt="x" />
          <img className='icon' src={iconIn} alt="In" />
          <FiInstagram onClick={()=>console.log("jws")}/>
      </div>
    </>
  )
}

export default App
