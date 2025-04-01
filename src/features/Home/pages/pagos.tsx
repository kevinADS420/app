import React, { useState, useEffect } from 'react';
import '../../../style/pagos.css';

// Interfaces
interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
  cedula: string;
  direccion: string;
  ciudad: string;
}

interface Ubicacion {
  direccion: string;
  referencia: string;
}

// Definir la interfaz para el producto
interface ProductoCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string; // opcional si algunos productos no tienen imagen
}

interface FormaPago {
  id: string;
  nombre: string;
}

// Actualizar la interfaz PagoProps para incluir los productos
export interface PagoProps {
  total: number;
  onCancel: () => void;
  productos?: ProductoCarrito[];
}

const Pago: React.FC<PagoProps> = ({ total, onCancel, productos = [] }) => {
  // Estado para controlar el paso actual
  const [pasoActual, setPasoActual] = useState<number>(1);
  
  // Estado para los datos del cliente
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    direccion: '',
    ciudad: ''
  });
  
  // Estado para la ubicación de entrega
  const [ubicacion, setUbicacion] = useState<Ubicacion>({
    direccion: '',
    referencia: ''
  });
  
  // Estado para el método de pago
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState<string>('');
  
  // Estado para los datos de la tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    fechaExpiracion: '',
    cvv: ''
  });
  
  // Estado para el resultado del pago
  const [pagoExitoso, setPagoExitoso] = useState<boolean>(false);
  const [pagoProcesando, setPagoProcesando] = useState<boolean>(false);
  const [facturaGenerada, setFacturaGenerada] = useState<boolean>(false);
  
  // Opciones de pago disponibles
  const formasDePago: FormaPago[] = [
    { id: 'tarjeta', nombre: 'Tarjeta de Crédito/Débito' },
    { id: 'paypal', nombre: 'PayPal' },
    { id: 'transferencia', nombre: 'Transferencia Bancaria' },
    { id: 'efectivo', nombre: 'Pago contra entrega (Efectivo)' }
  ];
  
  // Cargar datos guardados al inicio
  useEffect(() => {
    const clienteGuardado = localStorage.getItem('cliente');
    if (clienteGuardado) {
      const datosCliente = JSON.parse(clienteGuardado);
      setCliente(datosCliente);
      
      // También usamos la dirección para la ubicación de entrega
      setUbicacion({
        direccion: datosCliente.direccion || '',
        referencia: ''
      });
    }
  }, []);
  
  // Manejadores para los datos del cliente
  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };
  
  // Manejador para la ubicación
  const handleUbicacionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUbicacion({ ...ubicacion, [name]: value });
  };
  
  // Manejador para el método de pago
  const handleFormaPagoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormaPagoSeleccionada(e.target.value);
  };
  
  // Manejador para los datos de la tarjeta
  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosTarjeta({ ...datosTarjeta, [name]: value });
  };
  
  // Avanzar al siguiente paso
  const avanzarPaso = () => {
    // Guardar datos del cliente en localStorage cuando se completa el primer paso
    if (pasoActual === 1) {
      localStorage.setItem('cliente', JSON.stringify(cliente));
    }
    
    // Si estamos en el paso de pago y se ha seleccionado un método de pago, procesamos el pago
    if (pasoActual === 4) {
      procesarPago();
    } else {
      setPasoActual(pasoActual + 1);
    }
  };
  
  // Retroceder al paso anterior
  const retrocederPaso = () => {
    setPasoActual(pasoActual - 1);
  };
  
  // Procesar el pago
  const procesarPago = () => {
    setPagoProcesando(true);
    
    // Simulamos el procesamiento del pago
    setTimeout(() => {
      setPagoProcesando(false);
      setPagoExitoso(true);
    }, 2000);
  };
  
  // Generar factura
  const generarFactura = () => {
    setFacturaGenerada(true);
    // Aquí iría la lógica para generar y descargar la factura
    alert('Factura generada y enviada por email');
  };
  
  // Iniciar un nuevo proceso de pago
  const iniciarNuevoPago = () => {
    onCancel();
  };
  
  // Validaciones para cada paso
  const validarPaso1 = () => {
    return (
      cliente.nombre.trim() !== '' &&
      cliente.email.trim() !== '' &&
      cliente.telefono.trim() !== '' &&
      cliente.direccion.trim() !== '' &&
      cliente.ciudad.trim() !== ''
    );
  };
  
  const validarPaso2 = () => {
    return ubicacion.direccion.trim() !== '';
  };
  
  const validarPaso4 = () => {
    if (formaPagoSeleccionada === '') return false;
    
    if (formaPagoSeleccionada === 'tarjeta') {
      return (
        datosTarjeta.numero.trim() !== '' &&
        datosTarjeta.nombre.trim() !== '' &&
        datosTarjeta.fechaExpiracion.trim() !== '' &&
        datosTarjeta.cvv.trim() !== ''
      );
    }
    
    return true;
  };
  
  // Calcular subtotal
  const calcularSubtotal = () => {
    return total / 1.18; // Asumimos un IVA del 18%
  };
  
  // Calcular IVA
  const calcularIVA = () => {
    return total - calcularSubtotal();
  };
  
  // Renderizar el paso actual
  const renderizarPaso = () => {
    switch (pasoActual) {
      case 1:
        return renderizarPaso1();
      case 2:
        return renderizarPaso2();
      case 3:
        return renderizarPaso3();
      case 4:
        return renderizarPaso4();
      default:
        return null;
    }
  };
  
  // Paso 1: Datos del cliente
  const renderizarPaso1 = () => {
    return (
      <div className="paso-container">
        <div className="seccion-cliente">
          <div className="form-header">
            <h2>Información Personal</h2>
            <div className="form-required-hint">* Campos obligatorios</div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo: *</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={cliente.nombre} 
                onChange={handleClienteChange} 
                placeholder="Ingrese su nombre completo"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email: *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={cliente.email} 
                onChange={handleClienteChange} 
                placeholder="correo@ejemplo.com"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">Teléfono: *</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono" 
                value={cliente.telefono} 
                onChange={handleClienteChange} 
                placeholder="Ingrese su número de teléfono"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cedula">Cédula/Documento de identidad:</label>
              <input 
                type="text" 
                id="cedula" 
                name="cedula" 
                value={cliente.cedula} 
                onChange={handleClienteChange} 
                placeholder="Ingrese su número de documento"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="direccion">Dirección: *</label>
              <input 
                type="text" 
                id="direccion" 
                name="direccion" 
                value={cliente.direccion} 
                onChange={handleClienteChange} 
                placeholder="Dirección completa"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad: *</label>
              <input 
                type="text" 
                id="ciudad" 
                name="ciudad" 
                value={cliente.ciudad} 
                onChange={handleClienteChange} 
                placeholder="Ciudad"
                required 
              />
            </div>
          </div>
        </div>
        
        <div className="paso-acciones">
          <button 
            type="button" 
            className="btn-volver" 
            onClick={onCancel}
          >
            Volver al Carrito
          </button>
          <button 
            type="button" 
            className="btn-continuar" 
            onClick={avanzarPaso}
            disabled={!validarPaso1()}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Paso 2: Dirección de entrega
  const renderizarPaso2 = () => {
    return (
      <div className="paso-container">
        <div className="seccion-ubicacion">
          <div className="form-header">
            <h2>Dirección de Entrega</h2>
            <div className="form-required-hint">* Campos obligatorios</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="direccion">Dirección de entrega: *</label>
            <input 
              type="text" 
              id="direccion" 
              name="direccion" 
              value={ubicacion.direccion} 
              onChange={handleUbicacionChange} 
              placeholder="Dirección completa de entrega"
              required 
            />
            <div className="direccion-info">
              Utilizamos la dirección que ingresaste en el paso anterior
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="referencia">Punto de referencia:</label>
            <textarea 
              id="referencia" 
              name="referencia" 
              value={ubicacion.referencia} 
              onChange={handleUbicacionChange} 
              placeholder="Edificio, color de fachada, puntos cercanos, etc."
              rows={3}
            />
          </div>
        </div>
        
        <div className="paso-acciones">
          <button 
            type="button" 
            className="btn-volver" 
            onClick={retrocederPaso}
          >
            Volver Atrás
          </button>
          <button 
            type="button" 
            className="btn-continuar" 
            onClick={avanzarPaso}
            disabled={!validarPaso2()}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Paso 3: Resumen del pedido
  const renderizarPaso3 = () => {
    return (
      <div className="paso-container">
        <div className="seccion-resumen">
          <div className="form-header">
            <h2>Resumen del Pedido</h2>
          </div>
          
          <div className="resumen-productos">
            {productos?.map((producto: ProductoCarrito) => (
              <div key={producto.id} className="producto-resumen">
                <div className="producto-info">
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div>
                    <h3>{producto.nombre}</h3>
                    <p>Cantidad: {producto.cantidad}</p>
                  </div>
                </div>
                <div className="producto-precio">
                  ${producto.precio * producto.cantidad}
                </div>
              </div>
            ))}
          </div>
          
          <div className="detalle-costos">
            <div className="linea-resumen">
              <span>Subtotal:</span>
              <span>${calcularSubtotal().toFixed(2)}</span>
            </div>
            <div className="linea-resumen">
              <span>IVA (18%):</span>
              <span>${calcularIVA().toFixed(2)}</span>
            </div>
            <div className="linea-resumen">
              <span>Gastos de envío:</span>
              <span>Gratis</span>
            </div>
            <div className="linea-resumen total">
              <span>Total a pagar:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="datos-entrega">
            <h3>Datos de Entrega</h3>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
            <p><strong>Dirección:</strong> {ubicacion.direccion}</p>
            <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
            {ubicacion.referencia && (
              <p><strong>Referencia:</strong> {ubicacion.referencia}</p>
            )}
          </div>
        </div>
        
        <div className="paso-acciones">
          <button 
            type="button" 
            className="btn-volver" 
            onClick={retrocederPaso}
          >
            Volver Atrás
          </button>
          <button 
            type="button" 
            className="btn-continuar" 
            onClick={avanzarPaso}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Paso 4: Método de pago
  const renderizarPaso4 = () => {
    if (pagoExitoso) {
      return (
        <div className="paso-container">
          <div className="pago-exitoso">
            <div className="icono-exito">✓</div>
            <h2>¡Pago Procesado con Éxito!</h2>
            <p>Gracias por tu compra, {cliente.nombre}.</p>
            <p>Se ha enviado un comprobante a {cliente.email}</p>
            <p>Tu pedido será enviado a:</p>
            <p className="direccion-envio">
              {ubicacion.direccion}
              {ubicacion.referencia && (
                <span className="texto-referencia">
                  <br/>Referencia: {ubicacion.referencia}
                </span>
              )}
            </p>
            <p className="total-pagado">Total pagado: ${total.toFixed(2)}</p>
            
            {!facturaGenerada ? (
              <button 
                className="btn-generar-factura" 
                onClick={generarFactura}
              >
                Solicitar Factura
              </button>
            ) : (
              <p className="factura-info">
                La factura ha sido enviada a tu correo electrónico.
              </p>
            )}
            
            <button 
              className="btn-nuevo-pago" 
              onClick={iniciarNuevoPago}
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="paso-container">
        <div className="seccion-pago">
          <div className="form-header">
            <h2>Método de Pago</h2>
            <div className="form-required-hint">* Campos obligatorios</div>
          </div>
          
          {pagoProcesando ? (
            <div className="procesando-pago">
              <div className="spinner"></div>
              <p>Procesando tu pago, por favor espera...</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="formaPago">Seleccione su método de pago: *</label>
                <select 
                  id="formaPago" 
                  value={formaPagoSeleccionada} 
                  onChange={handleFormaPagoChange}
                  required
                >
                  <option value="">-- Seleccione un método de pago --</option>
                  {formasDePago.map(forma => (
                    <option key={forma.id} value={forma.id}>
                      {forma.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              {formaPagoSeleccionada === 'tarjeta' && (
                <div className="detalles-tarjeta">
                  <div className="form-group">
                    <label htmlFor="numero">Número de Tarjeta: *</label>
                    <input 
                      type="text" 
                      id="numero" 
                      name="numero" 
                      value={datosTarjeta.numero}
                      onChange={handleTarjetaChange}
                      placeholder="1234 5678 9012 3456" 
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre en la Tarjeta: *</label>
                    <input 
                      type="text" 
                      id="nombreTarjeta" 
                      name="nombre" 
                      value={datosTarjeta.nombre}
                      onChange={handleTarjetaChange}
                      placeholder="NOMBRE COMO APARECE EN LA TARJETA" 
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fechaExpiracion">Fecha de Exp.: *</label>
                      <input 
                        type="text" 
                        id="fechaExpiracion" 
                        name="fechaExpiracion" 
                        value={datosTarjeta.fechaExpiracion}
                        onChange={handleTarjetaChange}
                        placeholder="MM/AA" 
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV: *</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        name="cvv" 
                        value={datosTarjeta.cvv}
                        onChange={handleTarjetaChange}
                        placeholder="123" 
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {formaPagoSeleccionada === 'paypal' && (
                <div className="paypal-info">
                  <p>Serás redirigido a PayPal para completar el pago.</p>
                </div>
              )}
              
              {formaPagoSeleccionada === 'transferencia' && (
                <div className="transferencia-info">
                  <p><strong>Banco:</strong> Banco Ejemplo</p>
                  <p><strong>Cuenta:</strong> 1234567890</p>
                  <p><strong>Titular:</strong> EMPRESA S.A.</p>
                  <p><strong>Referencia:</strong> Tu número de pedido</p>
                  <p className="info-adicional">Una vez realizada la transferencia, por favor envía el comprobante a nuestro correo.</p>
                </div>
              )}
              
              {formaPagoSeleccionada === 'efectivo' && (
                <div className="efectivo-info">
                  <p>Pagarás en efectivo al momento de recibir tu pedido.</p>
                  <p className="info-adicional">Asegúrate de tener el monto exacto: ${total.toFixed(2)}</p>
                </div>
              )}
              
              <div className="resumen-pago-total">
                <p className="total-a-pagar">Total a pagar: <span>${total.toFixed(2)}</span></p>
              </div>
            </>
          )}
        </div>
        
        <div className="paso-acciones">
          <button 
            type="button" 
            className="btn-volver" 
            onClick={retrocederPaso}
            disabled={pagoProcesando}
          >
            Volver Atrás
          </button>
          <button 
            type="button" 
            className="btn-pagar" 
            onClick={avanzarPaso}
            disabled={!validarPaso4() || pagoProcesando}
          >
            {pagoProcesando ? 'Procesando...' : 'Confirmar y Pagar'}
          </button>
        </div>
      </div>
    );
  };
  
  // Indicador de pasos
  const renderizarIndicadorPasos = () => {
    return (
      <div className="indicador-pasos">
        <div className={`paso ${pasoActual >= 1 ? 'activo' : ''} ${pasoActual > 1 ? 'completado' : ''}`}>
          <div className="paso-numero">1</div>
          <div className="paso-texto">Datos personales</div>
        </div>
        <div className="paso-linea"></div>
        <div className={`paso ${pasoActual >= 2 ? 'activo' : ''} ${pasoActual > 2 ? 'completado' : ''}`}>
          <div className="paso-numero">2</div>
          <div className="paso-texto">Dirección</div>
        </div>
        <div className="paso-linea"></div>
        <div className={`paso ${pasoActual >= 3 ? 'activo' : ''} ${pasoActual > 3 ? 'completado' : ''}`}>
          <div className="paso-numero">3</div>
          <div className="paso-texto">Resumen</div>
        </div>
        <div className="paso-linea"></div>
        <div className={`paso ${pasoActual >= 4 ? 'activo' : ''} ${pagoExitoso ? 'completado' : ''}`}>
          <div className="paso-numero">4</div>
          <div className="paso-texto">Pago</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="pago-container">
      <h1>Proceso de Pago</h1>
      
      {!pagoExitoso && renderizarIndicadorPasos()}
      
      {renderizarPaso()}
    </div>
  );
};

export default Pago;