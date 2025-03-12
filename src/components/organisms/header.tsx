import React, { useState, useEffect } from 'react';
import Logo from '../atoms/Logo/Logo';
import Navigation from '../molecules/Navigation/Navigation';
import UserProfile from './UserProfile';
import HamburgerButton from '../atoms/HamburgerButton/HamburgerButton';
import MobileMenu from '../molecules/MobileMenu/MobileMenu';
import './header.css';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem('token');
      console.log('Checking auth status:', hasToken);
      setIsAuthenticated(hasToken);
    };

    // Verificar autenticación cuando cambie el almacenamiento
    window.addEventListener('storage', checkAuth);
    // Verificar autenticación cuando el usuario inicie sesión
    window.addEventListener('userLogin', checkAuth);
    // Verificar autenticación cuando el usuario cierre sesión
    window.addEventListener('userLogout', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLogin', checkAuth);
      window.removeEventListener('userLogout', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="header-spacer" />
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <HamburgerButton 
            isOpen={isMobileMenuOpen} 
            onClick={toggleMobileMenu} 
          />
          <Logo />
          <Navigation isAuthenticated={isAuthenticated} />
          <div className="auth-container">
            {isAuthenticated && <UserProfile />}
          </div>
        </div>
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
        />
      </header>
    </>
  );
}

export default Header;
