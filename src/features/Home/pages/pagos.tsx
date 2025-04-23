import React, { useState, useEffect, useRef } from 'react';
import '../../../style/pagos.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import mercadopago from '../../../assets/images/mercadopago.png';

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
  nombreP: string;
  precio: number;
  cantidad: number;
  imagenes?: { url: string }[];
  descuento?: number;
  tipo?: string;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Verificar autenticación al montar el componente
  useEffect(() => {
    const verificarAutenticacion = () => {
      const token = localStorage.getItem('token');
      const tokenBackup = sessionStorage.getItem('tokenBackup');
      
      if (!token && tokenBackup) {
        // Restaurar token desde el backup
        localStorage.setItem('token', tokenBackup);
        setIsAuthenticated(true);
      } else if (token) {
        setIsAuthenticated(true);
        // Crear un respaldo del token en sessionStorage
        sessionStorage.setItem('tokenBackup', token);
      } else {
        // Si no hay token, redirigir al login
        toast.error('Sesión expirada. Por favor, inicie sesión nuevamente', {
          position: "bottom-right",
          autoClose: 3000
        });
        navigate('/inicio-section');
      }
    };
    
    verificarAutenticacion();
  }, [navigate]);
  
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
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [initPoint, setInitPoint] = useState<string>('');
  
  // Agregar estos estados al inicio del componente, junto a los otros estados
  const [preferenceData, setPreferenceData] = useState<any>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  
  // Agregar estos estados al inicio del componente
  const [mostrarFactura, setMostrarFactura] = useState(false);
  const [datosFactura, setDatosFactura] = useState<any>(null);
  
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
  const procesarPago = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Sesión expirada. Por favor, inicie sesión nuevamente', {
          position: "bottom-right",
          autoClose: 3000
        });
        navigate('/inicio-section');
        return;
      }

      setPagoProcesando(true);

      const response = await fetch('https://backendhuertomkt.onrender.com/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_cliente: parseInt(userId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la preferencia de pago');
      }

      const data = await response.json();
      setPreferenceData(data);
      setPagoProcesando(false);
      setShowPaymentConfirmation(true);

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago', {
        position: "bottom-right",
        autoClose: 3000
      });
      setPagoProcesando(false);
    }
  };
  
  // Agregar función para confirmar el pago simulado
  const confirmarPago = async () => {
    try {
      setPagoProcesando(true);
      
      // Simular el proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar datos de la factura
      const fechaActual = new Date().toLocaleDateString();
      const numeroFactura = `F-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
      
      const facturaData = {
        numeroFactura,
        fecha: fechaActual,
        cliente: {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          cedula: cliente.cedula,
          direccion: cliente.direccion,
          ciudad: cliente.ciudad
        },
        items: preferenceData.items,
        total: preferenceData.total,
        metodoPago: formaPagoSeleccionada,
        subtotal: preferenceData.total / 1.19, // Asumiendo IVA del 19%
        iva: preferenceData.total - (preferenceData.total / 1.19)
      };

      setDatosFactura(facturaData);
      setPagoExitoso(true);
      setMostrarFactura(true);
      
      toast.success('¡Pago realizado con éxito!', {
        position: "bottom-right",
        autoClose: 3000
      });
      
      localStorage.removeItem('carritoProductos');
      
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      toast.error('Error al confirmar el pago', {
        position: "bottom-right",
        autoClose: 3000
      });
    } finally {
      setPagoProcesando(false);
      setShowPaymentConfirmation(false);
    }
  };
  
  // Función para descargar la factura
  const descargarFactura = () => {
    if (!datosFactura) return;

    const contenidoFactura = `
      HUERTOMKT - FACTURA DE VENTA
      =============================
      
      Factura N°: ${datosFactura.numeroFactura}
      Fecha: ${datosFactura.fecha}
      
      DATOS DEL CLIENTE
      ----------------
      Nombre: ${datosFactura.cliente.nombre}
      Cédula/NIT: ${datosFactura.cliente.cedula}
      Dirección: ${datosFactura.cliente.direccion}
      Ciudad: ${datosFactura.cliente.ciudad}
      Teléfono: ${datosFactura.cliente.telefono}
      Email: ${datosFactura.cliente.email}
      
      DETALLE DE PRODUCTOS
      -------------------
      ${datosFactura.items.map((item: any) => 
        `${item.title}
        Cantidad: ${item.quantity}
        Precio unitario: $${item.unit_price}
        Subtotal: $${item.quantity * item.unit_price}
        ----------------------------------------`
      ).join('\n')}
      
      RESUMEN DE PAGO
      --------------
      Subtotal: $${Math.round(datosFactura.subtotal).toLocaleString()}
      IVA (19%): $${Math.round(datosFactura.iva).toLocaleString()}
      Total: $${Math.round(datosFactura.total).toLocaleString()}
      
      Método de pago: ${datosFactura.metodoPago}
      
      ¡Gracias por tu compra!
      HuertoMKT - Productos frescos y de calidad
    `;

    const blob = new Blob([contenidoFactura], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${datosFactura.numeroFactura}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // Agregar el componente de la factura
  const renderizarFactura = () => {
    if (!datosFactura) return null;

    return (
      <div className="factura-container">
        <div className="factura-header">
          <h2>Factura de Venta</h2>
          <div className="factura-info">
            <p><strong>Factura N°:</strong> {datosFactura.numeroFactura}</p>
            <p><strong>Fecha:</strong> {datosFactura.fecha}</p>
          </div>
        </div>

        <div className="factura-cliente">
          <h3>Datos del Cliente</h3>
          <div className="cliente-info">
            <p><strong>Nombre:</strong> {datosFactura.cliente.nombre}</p>
            <p><strong>Cédula/NIT:</strong> {datosFactura.cliente.cedula}</p>
            <p><strong>Dirección:</strong> {datosFactura.cliente.direccion}</p>
            <p><strong>Ciudad:</strong> {datosFactura.cliente.ciudad}</p>
            <p><strong>Teléfono:</strong> {datosFactura.cliente.telefono}</p>
            <p><strong>Email:</strong> {datosFactura.cliente.email}</p>
          </div>
        </div>

        <div className="factura-items">
          <h3>Detalle de Productos</h3>
          <div className="items-table">
            <div className="item-header">
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Precio Unit.</span>
              <span>Total</span>
            </div>
            {datosFactura.items.map((item: any, index: number) => (
              <div key={index} className="item-row">
                <span>{item.title}</span>
                <span>{item.quantity}</span>
                <span>${item.unit_price.toLocaleString()}</span>
                <span>${(item.quantity * item.unit_price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="factura-resumen">
          <div className="resumen-item">
            <span>Subtotal:</span>
            <span>${Math.round(datosFactura.subtotal).toLocaleString()}</span>
          </div>
          <div className="resumen-item">
            <span>IVA (19%):</span>
            <span>${Math.round(datosFactura.iva).toLocaleString()}</span>
          </div>
          <div className="resumen-item total">
            <span>Total:</span>
            <span>${Math.round(datosFactura.total).toLocaleString()}</span>
          </div>
        </div>

        <div className="factura-acciones">
          <button className="btn-descargar" onClick={descargarFactura}>
            Descargar Factura
          </button>
          <button className="btn-volver-tienda" onClick={onCancel}>
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
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
        <button className="btn-cerrar-pago" onClick={onCancel}>×</button>
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
            className="btn-volver-carrito" 
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
        <button className="btn-cerrar-pago" onClick={onCancel}>×</button>
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
            className="btn-volver-carrito" 
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
        <button className="btn-cerrar-pago" onClick={onCancel}>×</button>
        <div className="seccion-resumen">
          <div className="form-header">
            <h2>Resumen del Pedido</h2>
          </div>
          
          <div className="resumen-productos">
            {productos?.map((producto: ProductoCarrito) => (
              <div key={producto.id} className="producto-resumen">
                <div className="producto-info">
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img src={producto.imagenes[0].url} alt={producto.nombreP} />
                  ) : (
                    <div className="sin-imagen-mini">
                      <span>Sin imagen</span>
                    </div>
                  )}
                  <div>
                    <h3>{producto.nombreP}</h3>
                    <p>Cantidad: {producto.cantidad}</p>
                  </div>
                </div>
                <div className="producto-precio">
                  ${producto.descuento 
                    ? (producto.precio * (1 - producto.descuento / 100) * producto.cantidad).toFixed(2)
                    : (producto.precio * producto.cantidad).toFixed(2)
                  }
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
            className="btn-volver-carrito" 
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
    if (mostrarFactura && datosFactura) {
      return renderizarFactura();
    }

    const handleMetodoPagoClick = async (metodo: string) => {
      setFormaPagoSeleccionada(metodo);
      setPagoProcesando(true);
      
      try {
        await procesarPago();
      } catch (error) {
        console.error('Error al procesar el pago:', error);
        setPagoProcesando(false);
      }
    };

    return (
      <div className="paso-contenido paso-pago">
        <div className="pago-container">
          <div className="pago-header">
            <h2>¿Cómo quieres pagar?</h2>
            <div className="vendedor-info">
              <img src={mercadopago} className='mercadopago' alt="mercadopago" />
            </div>
          </div>

          {showPaymentConfirmation && preferenceData ? (
            <div className="confirmacion-pago">
              <h3>Confirmar Pago</h3>
              <div className="detalles-preferencia">
                <h4>Resumen de la compra:</h4>
                <div className="productos-lista">
                  {preferenceData.items?.map((item: any, index: number) => (
                    <div key={index} className="producto-detalle">
                      <div className="producto-info">
                        <h5>{item.title}</h5>
                        <div className="producto-cantidad">
                          <span className="cantidad-label">Cantidad:</span>
                          <span className="cantidad-valor">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="producto-precios">
                        <div className="precio-unitario">
                          <span>Precio unitario:</span>
                          <span>${item.unit_price.toLocaleString()}</span>
                        </div>
                        <div className="precio-total">
                          <span>Subtotal:</span>
                          <span>${(item.quantity * item.unit_price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="total-preferencia">
                  <strong>Total a pagar: ${preferenceData.total.toLocaleString()}</strong>
                </div>
              </div>
              <div className="acciones-confirmacion">
                <button 
                  className="btn-cancelar"
                  onClick={() => setShowPaymentConfirmation(false)}
                  disabled={pagoProcesando}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar"
                  onClick={confirmarPago}
                  disabled={pagoProcesando}
                >
                  {pagoProcesando ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </div>
          ) : (
            <div className="metodos-pago">
              {pagoProcesando ? (
                <div className="procesando-pago">
                  <div className="spinner"></div>
                  <p>Procesando tu pago...</p>
                </div>
              ) : (
                <>
                  <div 
                    className={`metodo-pago-item ${formaPagoSeleccionada === 'tarjeta_credito' ? 'seleccionado' : ''}`} 
                    onClick={() => handleMetodoPagoClick('tarjeta_credito')}
                  >
                    <div className="metodo-pago-icon">💳</div>
                    <div className="metodo-pago-info">
                      <span>Tarjeta de crédito</span>
                      <div className="tarjetas-aceptadas">
                        <img src="/visa.png" alt="Visa" />
                        <img src="/mastercard.png" alt="Mastercard" />
                        <img src="/american-express.png" alt="American Express" />
                      </div>
                    </div>
                    <div className="metodo-pago-arrow">›</div>
                  </div>

                  <div 
                    className={`metodo-pago-item ${formaPagoSeleccionada === 'tarjeta_debito' ? 'seleccionado' : ''}`}
                    onClick={() => handleMetodoPagoClick('tarjeta_debito')}
                  >
                    <div className="metodo-pago-icon">💳</div>
                    <div className="metodo-pago-info">
                      <span>Tarjeta de débito</span>
                      <div className="tarjetas-aceptadas">
                        <img src="/visa-debito.png" alt="Visa Débito" />
                        <img src="/mastercard-debito.png" alt="Mastercard Débito" />
                      </div>
                    </div>
                    <div className="metodo-pago-arrow">›</div>
                  </div>

                  <div 
                    className={`metodo-pago-item ${formaPagoSeleccionada === 'efecty' ? 'seleccionado' : ''}`}
                    onClick={() => handleMetodoPagoClick('efecty')}
                  >
                    <div className="metodo-pago-icon">🏪</div>
                    <div className="metodo-pago-info">
                      <span>Efecty</span>
                      <small>El pago se acreditará al instante.</small>
                    </div>
                    <div className="metodo-pago-arrow">›</div>
                  </div>

                  <div 
                    className={`metodo-pago-item ${formaPagoSeleccionada === 'pse' ? 'seleccionado' : ''}`}
                    onClick={() => handleMetodoPagoClick('pse')}
                  >
                    <div className="metodo-pago-icon">🏦</div>
                    <div className="metodo-pago-info">
                      <span>PSE</span>
                      <small>El pago se acreditará al instante.</small>
                    </div>
                    <div className="metodo-pago-arrow">›</div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="detalles-pago">
            <h3>Detalles del pago</h3>
            <div className="detalles-item">
              <span>Productos</span>
              <span>$ {total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="pago-footer">
            <button 
              onClick={onCancel} 
              className="btn-volver"
              disabled={pagoProcesando}
            >
              ‹ Volver a HuertoMkt
            </button>
          </div>
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
  
  // Agregar ref para el contenedor del paso
  const pasoContainerRef = useRef<HTMLDivElement>(null);

  // Efecto para manejar el scroll cuando cambia el paso
  useEffect(() => {
    if (pasoContainerRef.current) {
      pasoContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [pasoActual]);

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

  return (
    <div className="pago-container">
      <h1>Proceso de Pago</h1>
      
      {!pagoExitoso && renderizarIndicadorPasos()}
      
      <div ref={pasoContainerRef}>
        {renderizarPaso()}
      </div>
    </div>
  );
};

export default Pago;