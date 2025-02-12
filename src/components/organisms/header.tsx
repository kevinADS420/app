import Butoons from '../atoms/Button/ButtonHeader'
import HamburgerMenu from '../atoms/Button/HamburgerMenu'
import logo from '../../assets/images/logo.png'
import iconFacebook from '../../assets/icons/icons8-facebook-30.png'
import icontwitter from '../../assets/icons/icons8-twitter-logo-30.png'
import iconIn from '../../assets/icons/icons8-in-30 (1).png'
import '../../style/Header.css'

function Header() {

  return (
    <>
        <header>
            <div className='containerHeader'>
                <HamburgerMenu/>
                <img className='logo' src={logo} alt="Logo"/>
                <Butoons/>
                <div className='containericons'>
                    <img className='icon' src={iconFacebook} alt="Facebook" />
                    <img className='icon' src={icontwitter} alt="twitter" />
                    <img className='icon' src={iconIn} alt="In" />
                </div>
            </div>
        </header>
   
    </>
  )
}

export default Header
