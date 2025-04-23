import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PagoFallido: React.FC = () => {
  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className="payment-result-icon error">
          <FaTimesCircle />
        </div>
        <h1>Pago Fallido</h1>
        <p>Lo sentimos, hubo un problema al procesar tu pago.</p>
        <p className="payment-details">
          Por favor, verifica los detalles de tu tarjeta o intenta con otro método de pago.
        </p>
        <div className="payment-result-actions">
          <Link to="/carrito" className="btn-primary">
            Volver al Carrito
          </Link>
          <Link to="/productos" className="btn-secondary">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoFallido; 