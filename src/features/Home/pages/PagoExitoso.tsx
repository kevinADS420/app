import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PagoExitoso: React.FC = () => {
  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className="payment-result-icon success">
          <FaCheckCircle />
        </div>
        <h1>¡Pago Exitoso!</h1>
        <p>Tu pago ha sido procesado correctamente.</p>
        <p className="payment-details">
          Gracias por tu compra. Hemos enviado un correo electrónico con los detalles de tu transacción.
        </p>
        <div className="payment-result-actions">
          <Link to="/" className="btn-primary">
            Volver al Inicio
          </Link>
          <Link to="/productos" className="btn-secondary">
            Ver Más Productos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso; 