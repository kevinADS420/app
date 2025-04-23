import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Componente para manejar las notificaciones de Mercado Pago
const WebhookHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');
    const preferenceId = urlParams.get('preference_id');

    // Procesar la notificación según el estado
    if (status === 'approved') {
      // Pago aprobado
      toast.success('¡Pago procesado con éxito!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Limpiar el carrito local
      localStorage.removeItem('carritoProductos');

      // Redirigir a la página de éxito
      setTimeout(() => {
        navigate('/pago-exitoso', { 
          state: { 
            paymentId, 
            preferenceId,
            status 
          }
        });
      }, 2000);
    } else if (status === 'pending') {
      // Pago pendiente
      toast.info('Tu pago está pendiente de confirmación', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirigir a la página de pendiente
      setTimeout(() => {
        navigate('/pago-pendiente', { 
          state: { 
            paymentId, 
            preferenceId,
            status 
          }
        });
      }, 2000);
    } else if (status === 'rejected') {
      // Pago rechazado
      toast.error('Tu pago fue rechazado', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirigir a la página de fallido
      setTimeout(() => {
        navigate('/pago-fallido', { 
          state: { 
            paymentId, 
            preferenceId,
            status 
          }
        });
      }, 2000);
    } else {
      // Estado desconocido
      toast.warning('Estado de pago desconocido', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirigir a la página principal
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [navigate]);

  return (
    <div className="webhook-container">
      <h1>Procesando notificación de pago</h1>
      <div className="loading-spinner"></div>
      <p>Por favor, espere mientras procesamos su pago...</p>
    </div>
  );
};

export default WebhookHandler; 