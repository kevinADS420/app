import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

const PagoPendiente: React.FC = () => {
  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className="payment-result-icon pending">
          <FaClock />
        </div>
        <h1>Pago Pendiente</h1>
        <p>Tu pago está siendo procesado.</p>
        <p className="payment-details">
          Te enviaremos un correo electrónico cuando confirmemos tu pago.
          Por favor, revisa tu bandeja de entrada.
        </p>
        <div className="payment-result-actions">
          <Link to="/productos" className="btn-primary">
            Seguir Comprando
          </Link>
          <Link to="/" className="btn-secondary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoPendiente; 