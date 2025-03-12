import React from 'react';
import './HamburgerButton.css';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className={`hamburger-button ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label="Menu"
    >
      <span className="line"></span>
      <span className="line"></span>
      <span className="line"></span>
    </button>
  );
};

export default HamburgerButton; 