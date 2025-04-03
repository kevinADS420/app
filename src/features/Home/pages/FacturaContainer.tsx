import React, { useState} from 'react';
import '../../../style/facturacion.css';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Cliente {
  nombre: string;
  email: string;
  direccion: string;
  ciudad: string;
}

const Facturacion: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 1 },
    { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 1 },
    { id: 3, nombre: 'Producto 3', precio: 300, cantidad: 1 },
  ]);
  
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: ''
  });
  
  const [facturaGuardada, setFacturaGuardada] = useState<boolean>(false);
  const [facturaEnviada, setFacturaEnviada] = useState<boolean>(false);
  
  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    
    setProductos(productos.map(producto => 
      producto.id === id ? { ...producto, cantidad } : producto
    ));
  };
  
  const eliminarProducto = (id: number) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };
  
  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };
  
  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };
  
  const calcularIVA = () => {
    return calcularSubtotal() * 0.16;
  };
  
  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };
  
  const generarNumeroFactura = () => {
    return `F-${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  };
  
  const guardarFactura = () => {
    // Aquí se implementaría la lógica para guardar la factura en una base de datos
    console.log('Factura guardada:', {
      numeroFactura: generarNumeroFactura(),
      fecha: new Date().toISOString(),
      cliente,
      productos,
      subtotal: calcularSubtotal(),
      iva: calcularIVA(),
      total: calcularTotal()
    });
    
    setFacturaGuardada(true);
    setTimeout(() => setFacturaGuardada(false), 3000);
  };
  
  const enviarFactura = () => {
    // Aquí se implementaría la lógica para enviar la factura por correo electrónico
    console.log('Enviando factura al correo:', cliente.email);
    
    setFacturaEnviada(true);
    setTimeout(() => setFacturaEnviada(false), 3000);
  };
  
  const validarFormulario = () => {
    return cliente.nombre.trim() !== '' && 
           cliente.email.trim() !== '' && 
           cliente.direccion.trim() !== '' && 
           cliente.ciudad.trim() !== '' && 
           productos.length > 0;
  };
  
  return (
    <div className="facturacion-container">
      <h1>Facturación</h1>
      
      <div className="seccion-cliente">
        <h2>Datos del Cliente</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            value={cliente.nombre} 
            onChange={handleClienteChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={cliente.email} 
            onChange={handleClienteChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input 
            type="text" 
            id="direccion" 
            name="direccion" 
            value={cliente.direccion} 
            onChange={handleClienteChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input 
            type="text" 
            id="ciudad" 
            name="ciudad" 
            value={cliente.ciudad} 
            onChange={handleClienteChange} 
            required 
          />
        </div>
      </div>
      
      <div className="seccion-productos">
        <h2>Productos</h2>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>
                  <div className="control-cantidad">
                    <button onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}>-</button>
                    <span>{producto.cantidad}</span>
                    <button onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}>+</button>
                  </div>
                </td>
                <td>${(producto.precio * producto.cantidad).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="seccion-totales">
        <div className="totales">
          <div className="total-item">
            <span>Subtotal:</span>
            <span>${calcularSubtotal().toFixed(2)}</span>
          </div>
          <div className="total-item">
            <span>IVA (16%):</span>
            <span>${calcularIVA().toFixed(2)}</span>
          </div>
          <div className="total-item total-final">
            <span>Total:</span>
            <span>${calcularTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="seccion-acciones">
        <button 
          className="btn-guardar" 
          onClick={guardarFactura} 
          disabled={!validarFormulario()}
        >
          Guardar Factura
        </button>
        <button 
          className="btn-enviar" 
          onClick={enviarFactura} 
          disabled={!validarFormulario()}
        >
          Enviar por Email
        </button>
      </div>
      
      {facturaGuardada && (
        <div className="notificacion exito">
          ¡La factura ha sido guardada con éxito!
        </div>
      )}
      
      {facturaEnviada && (
        <div className="notificacion exito">
          ¡La factura ha sido enviada a {cliente.email} con éxito!
        </div>
      )}
    </div>
  );
};

export default Facturacion;