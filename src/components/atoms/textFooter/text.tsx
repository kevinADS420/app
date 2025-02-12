import Correo from '../../../assets/icons/icons8-mail-24 (2).png'
import Call from '../../../assets/icons/icons8-call-30.png'
import House from '../../../assets/icons/icons8-house-25.png'
import '../../../style/Footer.css'

function App() {

  return (
    <>
        <div>
            <h2>Contactos</h2>
        </div>
        <div className='containerContack'>

          
          <div className='icons'>
            <img src={Correo} alt="Correo" /> 
            <p>Huertomkt@gmail.com.co</p>
          </div>

          <div className='icons'>
            <img src={Call} alt="Call" /> 
            <p>3127493535</p>
          </div>
          
          <div className='icons'>
            <img src={House} alt="House" /> 
            ´<p>630001, Galán, Armenia, Quindio, Cra 18 #7-34</p>
          </div>
        </div>
    </>
  )
}

export default App
