import React, { useState, useEffect } from 'react';
import '../../../style/Productos.css';
import banner1 from './assets/banner1.jpg';
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';
import { MdShoppingCart, MdAddCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pago from './pagos';
// Definición de tipos 
interface Imagen {
  id: string;
  nombre: string;
  url: string;
}

interface Producto {
  id: string;
  nombreP: string;
  tipo: string;
  precio: number;
  imagenes: Imagen[];
  descuento?: number; // Para productos en oferta
  id_proveedor?: string; // Agregamos el ID del proveedor
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

// Imágenes para el carrusel del banner
const IMAGENES_BANNER = [
    {
      id: 'banner1',
      url: banner1,
      alt: 'Productos frescos de temporada'
    },
    {
      id: 'banner2',
      url: banner2,
      alt: 'Ofertas especiales en frutas'
    },
    {
      id: 'banner3',
      url: banner3,
      alt: 'Productos orgánicos'
    }
];

// Componente para mostrar categorías debajo del carrusel
const CategoriasAccesoRapido: React.FC<{ 
  categorias: { value: string; label: string; icono: React.ReactNode }[]
}> = ({ categorias }) => {
  const handleCategoriaClick = (categoria: string) => {
    // Aquí puedes implementar la navegación a cada categoría
    console.log(`Navegando a categoría: ${categoria}`);
    // En una implementación real, usarías useNavigate o history.push
  };
  
  return (
    <div className="categorias-acceso-rapido">
      {categorias.map((categoria) => (
        <button
          key={categoria.value}
          className={`categoria-boton ${categoria.value.toLowerCase()}`}
          onClick={() => handleCategoriaClick(categoria.value)}
        >
          <span className="categoria-icono">{categoria.icono}</span>
          {categoria.label}
        </button>
      ))}
    </div>
  );
};

// COMPONENTE CARRUSEL MEJORADO - REEMPLAZA TU COMPONENTE ACTUAL CON ESTE
const Carrusel: React.FC<{imagenes: Imagen[]}> = ({ imagenes }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  
  // Efecto para la rotación automática
  useEffect(() => {
    if (imagenes.length <= 1) return;
    
    const interval = setInterval(() => {
      setIndiceActual(prev => (prev + 1) % imagenes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [imagenes.length]);

  // Si no hay imágenes, no mostramos nada
  if (imagenes.length === 0) {
    return null;
  }

  // Para navegar manualmente
  const irAAnterior = () => {
    setIndiceActual(prev => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const irASiguiente = () => {
    setIndiceActual(prev => (prev + 1) % imagenes.length);
  };

  return (
    <div className="carrusel" style={{ overflow: 'hidden', borderRadius: '8px' }}>
      <div className="carrusel-contenedor" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Este div es el track horizontal con estilos inline para asegurar que funcione */}
        <div 
          style={{ 
            display: 'flex', 
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${indiceActual * 100}%)`,
            width: '100%'
          }}
        >
          {imagenes.map((imagen, index) => (
            <div 
              key={imagen.id} 
              style={{
                flex: '0 0 100%',
                width: '100%'
              }}
            >
              <img 
                src={imagen.url} 
                alt={imagen.nombre || `Imagen ${index + 1}`} 
                style={{
                  minWidth: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  imageRendering: '-webkit-optimize-contrast',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                onError={(e) => {
                  console.error('Error cargando imagen:', e);
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  if (e.currentTarget.parentNode) {
                    (e.currentTarget.parentNode as HTMLElement).innerHTML = '<div class="sin-imagen"><span>Sin imagen</span></div>';
                  }
                }}
              />
            </div>
          ))}
        </div>
        
        {imagenes.length > 1 && (
          <>
            <button 
              type="button"
              onClick={irAAnterior}
              aria-label="Imagen anterior"
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              &#10094;
            </button>
            <button 
              type="button"
              onClick={irASiguiente}
              aria-label="Imagen siguiente"
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              &#10095;
            </button>
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 2
            }}>
              {imagenes.map((_, index) => (
                <span 
                  key={index} 
                  onClick={() => setIndiceActual(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ir a imagen ${index + 1}`}
                  style={{
                    width: index === indiceActual ? '20px' : '10px',
                    height: '10px',
                    backgroundColor: index === indiceActual ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    borderRadius: index === indiceActual ? '10px' : '50%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente Banner con carrusel
const Banner: React.FC = () => {
  // Convertir las imágenes del banner al formato que espera el carrusel
  const imagenesBanner: Imagen[] = IMAGENES_BANNER.map(img => ({
    id: img.id,
    nombre: img.alt,
    url: img.url
  }));
  
  return (
    <div className="banner">
      <Carrusel imagenes={imagenesBanner} />
    </div>
  );
};

// Componente para mostrar una sección de productos por categoría
const SeccionCategoria: React.FC<{
  titulo: string,
  productos: Producto[],
  agregarAlCarrito: (producto: Producto) => void
}> = ({ titulo, productos, agregarAlCarrito }) => {
  if (productos.length === 0) return null;
  
  return (
    <section className="seccion-categoria">
      <div className="encabezado-categoria">
        <h2>{titulo}</h2>
        <button className="ver-mas">Ver más</button>
      </div>
      
      <div className="productos-categoria">
        {productos.slice(0, 4).map(producto => (
          <TarjetaProducto 
            key={producto.id} 
            producto={producto} 
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>
    </section>
  );
};

// Componente Tarjeta de Producto
const TarjetaProducto: React.FC<{
  producto: Producto,
  agregarAlCarrito: (producto: Producto) => void
}> = ({ producto, agregarAlCarrito }) => {
  const formatearPrecio = (precio: number): string => {
    return `$ ${precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Mostrar precio con descuento si aplica const CarritoCompras
  const mostrarPrecio = () => {
    if (producto.descuento) {
      const precioDescuento = producto.precio * (1 - producto.descuento / 100);
      return (
        <div className="precio-con-descuento">
          <span className="precio-original">{formatearPrecio(producto.precio)}</span>
          <span className="precio-actual">{formatearPrecio(precioDescuento)}</span>
          <span className="etiqueta-descuento">-{producto.descuento}%</span>
        </div>
      );
    }
    
    return <div className="precio">{formatearPrecio(producto.precio)}</div>;
  };

  // Verificar si el producto tiene imágenes válidas
  const tieneImagenesValidas = producto.imagenes && 
                              producto.imagenes.length > 0 && 
                              producto.imagenes[0].url;
  
  return (
    <div className="tarjeta-producto">
      <div className="producto-imagen">
        {tieneImagenesValidas ? (
          // Si hay solo una imagen, mostramos directamente la imagen en lugar del carrusel  
          producto.imagenes.length === 1 ? (
            <img 
              src={producto.imagenes[0].url} 
              alt={producto.nombreP}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px 8px 0 0'
              }}
              onError={(e) => {
                console.error('Error cargando imagen:', e);
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                if (e.currentTarget.parentNode) {
                  (e.currentTarget.parentNode as HTMLElement).innerHTML = '<div class="sin-imagen"><span>Sin imagen</span></div>';
                }
              }}
            />
          ) : (
            <Carrusel imagenes={producto.imagenes} />
          )
        ) : (
          <div className="sin-imagen">
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      
      <div className="producto-info">
        <h3>{producto.nombreP}</h3>
        <span className={`tipo-badge ${producto.tipo.toLowerCase()}`}>
          {producto.tipo}
        </span>
        {mostrarPrecio()}
      </div>
      
      <div className="producto-acciones">
        <button 
          className="btn-agregar" 
          onClick={() => agregarAlCarrito(producto)}
        >
          <i className="icono-carrito"></i> Agregar
        </button>
      </div>
    </div>
  );
};

// Componente Carrito de Compras
// Componente Carrito de Compras actualizado con botón de pagos funcional
const CarritoCompras: React.FC<{
  productos: ProductoCarrito[],
  visible: boolean,
  onClose: () => void,
  actualizarCantidad: (id: string, cantidad: number) => void,
  eliminarProducto: (id: string) => void,
  vaciarCarrito: () => void
}> = ({ productos, visible, onClose, actualizarCantidad, eliminarProducto, vaciarCarrito }) => {
  // Estado para controlar la visualización del componente de pagos
  const [mostrarPagos, setMostrarPagos] = useState(false);
  
  if (!visible) return null;
  
  // Calcular total de la compra
  const total = productos.reduce(
    (sum, producto) => {
      const precioUnitario = producto.descuento 
        ? producto.precio * (1 - producto.descuento / 100) 
        : producto.precio;
      return sum + (precioUnitario * producto.cantidad);
    }, 
    0
  );
  
  // Formatear precio
  const formatearPrecio = (precio: number): string => {
    return `$ ${precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Función para mostrar el componente de pagos
  const mostrarComponentePagos = () => {
    setMostrarPagos(true);
  };
  
  // Función para ocultar el componente de pagos y volver al carrito
  const volverAlCarrito = () => {
    setMostrarPagos(false);
  };
  
  return (
    <div className="carrito-overlay">
      <div className="carrito-contenedor">
        <div className="carrito-encabezado">
          <h2>{mostrarPagos ? 'Proceso de Pago' : 'Carrito de Compras'}</h2>
          <button className="btn-cerrar" onClick={onClose}>×</button>
        </div>
        
        {productos.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío</p>
            <button className="btn-continuar-comprando" onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            {mostrarPagos ? (
              // Mostrar el componente de pagos
              <div className="pagos-container">
                <Pago 
                  total={total} 
                  onCancel={volverAlCarrito}
                />
                
                {/* Botón para volver al carrito */}
                <button 
                  className="btn-volver-carrito"
                  onClick={volverAlCarrito}
                  style={{
                    marginTop: '15px',
                    padding: '8px 15px',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Volver al carrito
                </button>
              </div>
            ) : (
              // Mostrar contenido normal del carrito
              <>
                <div className="carrito-productos">
                  {productos.map(producto => (
                    <div key={producto.id} className="carrito-item">
                      <div className="item-imagen">
                        {producto.imagenes && producto.imagenes.length > 0 ? (
                          <img 
                            src={producto.imagenes[0].url} 
                            alt={producto.nombreP} 
                          />
                        ) : (
                          <div className="sin-imagen-mini">
                            <span>Sin imagen</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="item-detalles">
                        <h4>{producto.nombreP}</h4>
                        <div className="item-precio">
                          {producto.descuento ? (
                            <span>
                              {formatearPrecio(producto.precio * (1 - producto.descuento / 100))}
                            </span>
                          ) : (
                            <span>{formatearPrecio(producto.precio)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-cantidad">
                        <button 
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                          disabled={producto.cantidad <= 1}
                        >
                          -
                        </button>
                        <span>{producto.cantidad}</span>
                        <button onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}>
                          +
                        </button>
                      </div>
                      
                      <div className="item-subtotal">
                        {formatearPrecio(
                          producto.descuento 
                            ? producto.precio * (1 - producto.descuento / 100) * producto.cantidad
                            : producto.precio * producto.cantidad
                        )}
                      </div>
                      
                      <button 
                        className="btn-eliminar" 
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        <i className="icono-eliminar"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="carrito-resumen">
                  <div className="carrito-total">
                    <span>Total:</span>
                    <span className="total-valor">{formatearPrecio(total)}</span>
                  </div>
                  
                  <div className="carrito-acciones">
                    <button 
                      className="btn-vaciar" 
                      onClick={vaciarCarrito}
                    >
                      Vaciar carrito
                    </button>
                    
                    {/* Nuevo botón para el sistema de pagos */}
                    <button 
                      className="btn-pagar-sistema"
                      onClick={mostrarComponentePagos}
                      style={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f57c00';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff9800';
                      }}
                    >
                      <MdShoppingCart style={{ marginRight: '8px', fontSize: '18px' }} />
                      Pagar ahora
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
// Definir esto justo ANTES del componente Navbar

// Definir tipos de productos
const tipos_producto = [
  { value: 'frutas', label: 'Frutas' },
  { value: 'verduras', label: 'Verduras' },
  { value: 'tuberculos', label: 'Tubérculos' },
  { value: 'hortalizas', label: 'Hortalizas' },
  { value: 'ofertas', label: 'Ofertas' }
];

// Componente Barra de Navegación Secundaria
const Navbar: React.FC<{
  cantidadCarrito: number,
  mostrarCarrito: () => void
}> = ({ cantidadCarrito, mostrarCarrito }) => {
  return (
    <nav className="navbar navbar-secundaria">
      <div className="container navbar-container">
        <div className="navbar-busqueda">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
          />
          <button className="btn-buscar" onClick={()=>console.log("jws")}>
            <IoIosSearch className="icono-buscar" />
          </button>
        </div>
        
        <button className="btn-carrito" onClick={mostrarCarrito}>
          <MdShoppingCart  
            style={{
              fontSize: '40px'
            }}
          />
          {cantidadCarrito > 0 && (
            <span className="contador-carrito">{cantidadCarrito}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

// Componente principal de Productos
const Productos: React.FC = () => {
  // Estados para productos y carrito
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosCarrito, setProductosCarrito] = useState<ProductoCarrito[]>([]);
  const [mostrarCarritoModal, setMostrarCarritoModal] = useState(false);
  
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Agregar estado de carga
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados existentes...
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos
  const [mostrarMisProductos] = useState(false);
  
  // Función mejorada para procesar imágenes del backend
  const obtenerProductosDelBackend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://backendhuertomkt.onrender.com/products');
      if (!response.ok) {
        throw new Error('Error al obtener productos del servidor');
      }
      const data = await response.json();
      
      // Log para ver los datos crudos que llegan del backend
      console.log('Datos crudos del backend:', data);

      // Transformar los datos recibidos al formato que espera nuestra aplicación
      const productosFormateados = data.map((prod: any) => {
        // Procesar la imagen
        let imagenesProcesadas = [];
        
        try {
          if (prod.imagen) {
            // Comprobar si imagen es un array, un string o null
            if (Array.isArray(prod.imagen)) {
              // Si es un array, procesar cada imagen
              imagenesProcesadas = prod.imagen
                .filter((img: any) => img) // Filtrar valores nulos o vacíos
                .map((img: string, index: number) => {
                  let url = '';
                  
                  // Verificar el formato de la imagen
                  if (typeof img === 'string') {
                    // Verificar si ya es una URL de datos
                    if (img.startsWith('data:')) {
                      url = img;
                    } else {
                      // Asumir que es base64 y necesita prefijo
                      url = `data:image/jpeg;base64,${img}`;
                    }
                  }
                  
                  return {
                    id: `img_${prod.id_producto}_${index}`,
                    nombre: `Imagen ${index + 1} del producto ${prod.nombreP}`,
                    url: url
                  };
                });
            } else if (typeof prod.imagen === 'string' && prod.imagen.trim() !== '') {
              // Si es un string único, procesarlo
              let url = '';
              
              if (prod.imagen.startsWith('data:')) {
                url = prod.imagen;
              } else {
                url = `data:image/jpeg;base64,${prod.imagen}`;
              }
              
              imagenesProcesadas = [{
                id: `img_${prod.id_producto}_0`,
                nombre: `Imagen del producto ${prod.nombreP}`,
                url: url
              }];
            }
          }
        } catch (error) {
          console.error(`Error procesando imágenes del producto ${prod.id_producto}:`, error);
          imagenesProcesadas = [];
        }

        // Asegurar que haya al menos un precio
        const precio = parseFloat(prod.Precio) || 0;

        return {
          id: prod.id_producto.toString(),
          nombreP: prod.nombreP || 'Producto sin nombre',
          tipo: prod.tipo || 'Sin categoría',
          precio: precio,
          imagenes: imagenesProcesadas,
          id_proveedor: prod.id_proveedor ? prod.id_proveedor.toString() : null
        };
      });

      // Log para ver los productos formateados
      console.log('Productos formateados:', productosFormateados);

      setProductos(productosFormateados);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      toast.error('Error al cargar los productos. Intente más tarde.', {
        position: "bottom-right",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar productos cuando se monte el componente
  useEffect(() => {
    // Verificar el tipo de usuario desde localStorage
    const userTypeFromStorage = localStorage.getItem('userType');
    setUserType(userTypeFromStorage);
    
    // Obtener productos del backend
    obtenerProductosDelBackend();
    
    // Cargar carrito guardado
    const carritoGuardado = localStorage.getItem('carritoProductos');
    if (carritoGuardado) {
      try {
        setProductosCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error al cargar carrito:', e);
      }
    }
  }, []);

  // Escuchar cambios en localStorage para productos exportados
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productosExportados' && e.newValue) {
        // Si hay nuevos productos exportados, actualizar la lista desde el backend
        obtenerProductosDelBackend();
        // Limpiar localStorage para evitar duplicados
        localStorage.removeItem('productosExportados');
      }
    };

    // Agregar listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carritoProductos', JSON.stringify(productosCarrito));
  }, [productosCarrito]);
  
  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    setProductosCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(p => p.id === producto.id);
      
      if (productoExistente) {
        toast.info(`Se agregó otra unidad de ${producto.nombreP} al carrito`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return prevCarrito.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1 } 
            : p
        );
      } else {
        toast.success(`¡${producto.nombreP} agregado al carrito!`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };
  
  // Función para actualizar cantidad de un producto en el carrito
  const actualizarCantidadCarrito = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    
    setProductosCarrito(prevCarrito => 
      prevCarrito.map(p => 
        p.id === id 
          ? { ...p, cantidad } 
          : p
      )
    );
  };
  
  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id: string) => {
    const producto = productosCarrito.find(p => p.id === id);
    if (producto) {
      setProductosCarrito(prevCarrito => prevCarrito.filter(p => p.id !== id));
      toast.info(`${producto.nombreP} eliminado del carrito`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    const confirmar = () => {
      setProductosCarrito([]);
      toast.success('Carrito vaciado exitosamente', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    toast.warn(
      <div>
        <p>¿Estás seguro de que deseas vaciar el carrito?</p>
        <button 
          onClick={confirmar}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Confirmar
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: true,
      }
    );
  };
  
  // Función para alternar la visibilidad del carrito
  const toggleCarrito = () => {
    setMostrarCarritoModal(!mostrarCarritoModal);
  };

  // Función mejorada para la navegación
  const handleNavigateToRegistro = () => {
    setIsLoading(true);
    // Simular una carga suave antes de navegar
    setTimeout(() => {
      navigate('/RegistroProductos', { 
        state: { 
          from: 'productos',
          timestamp: Date.now() 
        }
      });
      setIsLoading(false);
    }, 300);
  };
  
  // Obtener productos por categoría
  const obtenerProductosPorTipo = (tipo: string) => {
    return productos.filter(p => 
      tipo === 'ofertas' 
        ? p.descuento // Si es ofertas, filtrar los que tienen descuento
        : p.tipo.toLowerCase() === tipo.toLowerCase() // Si no, filtrar por tipo
    );
  };
  
  // Calcular la cantidad total de productos en el carrito
  const cantidadTotalCarrito = productosCarrito.reduce(
    (total, producto) => total + producto.cantidad, 
    0
  );
  
  // Filtrar productos para el catálogo
  const productosFiltrados = productos
    .filter(producto => 
      filtroTipo === 'todos' || producto.tipo === filtroTipo
    )
    .filter(producto => 
      producto.nombreP.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      producto.tipo.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('carritoProductos');
    
    toast.warn('Su sesión ha expirado por inactividad', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    navigate('/login');
  };

  // Efecto para controlar la inactividad
  useEffect(() => {
    // Función para actualizar el tiempo de última actividad
    const updateLastActivity = () => {
      setLastActivity(Date.now());
    };

    // Eventos a escuchar para detectar actividad
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // Agregar listeners para todos los eventos
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Intervalo para verificar inactividad
    const checkInactivity = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        handleLogout();
      }
    }, 60000); // Verificar cada minuto

    // Limpiar listeners y intervalo
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(checkInactivity);
    };
  }, [lastActivity, navigate]);

  return (
    <div className="tienda">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4CAF50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <span style={{
              color: '#4CAF50',
              fontSize: '16px',
              fontWeight: '500'
            }}>Cargando...</span>
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <Navbar 
        cantidadCarrito={cantidadTotalCarrito} 
        mostrarCarrito={toggleCarrito} 
      />
      
      <main>
        <Banner />
        
        <div className="container">
          <CategoriasAccesoRapido 
            categorias={[
              { value: 'Frutas', label: 'Frutas', icono: <i className="icon-frutas">F</i> },
              { value: 'Verduras', label: 'Verduras', icono: <i className="icon-verduras">V</i> },
              { value: 'Tuberculos', label: 'Tubérculos', icono: <i className="icon-tuberculos">T</i> },
              { value: 'Hortalizas', label: 'Hortalizas', icono: <i className="icon-hortalizas">H</i> },
              { value: 'ofertas', label: 'Ofertas', icono: <i className="icon-ofertas">O</i> }
            ]}
          />
          
          {/* Movido aquí - Catálogo completo de productos */}
          <section className="catalogo-completo">
            <h2>Catálogo Completo</h2>
            
            <div className="controles">
              <div className="filtros">
                <div className="busqueda">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                  />
                </div>
                
                <div className="filtro-tipo">
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="todos">Todos los tipos</option>
                    {tipos_producto.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Botón para agregar productos (solo visible para proveedores) */}
                {userType === 'proveedor' && (
                  <button 
                    className="btn-agregar-productos"
                    onClick={handleNavigateToRegistro}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      marginLeft: '10px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#45a049';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#4CAF50';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                    disabled={isLoading}
                  >
                    <MdAddCircle style={{ 
                      marginRight: '8px',
                      fontSize: '20px'
                    }} />
                    {isLoading ? 'Cargando...' : 'Agregar Productos'}
                  </button>
                )}
              </div>
              
              <div className="info-resultados">
                <span>{productosFiltrados.length} productos encontrados</span>
              </div>
            </div>
            
            {productosFiltrados.length === 0 ? (
              <div className="sin-productos">
                <h3>No hay productos disponibles</h3>
                <p>
                  {terminoBusqueda || filtroTipo !== 'todos' 
                    ? 'No hay productos que coincidan con tu búsqueda.' 
                    : 'Aún no se han exportado productos desde el Registro de Productos.'}
                </p>
                {terminoBusqueda || filtroTipo !== 'todos' ? (
                  <button 
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      setTerminoBusqueda('');
                      setFiltroTipo('todos');
                    }}
                  >
                    Limpiar filtros
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="catalogo-productos">
                {productosFiltrados.map(producto => (
                  <TarjetaProducto 
                    key={producto.id} 
                    producto={producto} 
                    agregarAlCarrito={agregarAlCarrito}
                  />
                ))}
              </div>
            )}
          </section>

          <SeccionCategoria 
            titulo="Ofertas" 
            productos={obtenerProductosPorTipo('ofertas')}
            agregarAlCarrito={agregarAlCarrito}
          />
          
          <SeccionCategoria 
            titulo="Frutas" 
            productos={obtenerProductosPorTipo('frutas')}
            agregarAlCarrito={agregarAlCarrito}
          />
          
          <SeccionCategoria 
            titulo="Verduras" 
            productos={obtenerProductosPorTipo('verduras')}
            agregarAlCarrito={agregarAlCarrito}
          />
          
          <SeccionCategoria 
            titulo="Tubérculos" 
            productos={obtenerProductosPorTipo('tuberculos')}
            agregarAlCarrito={agregarAlCarrito}
          />
          
          <SeccionCategoria 
            titulo="Hortalizas" 
            productos={obtenerProductosPorTipo('hortalizas')}
            agregarAlCarrito={agregarAlCarrito}
          />
        </div>
      </main>
      
      <CarritoCompras 
        productos={productosCarrito}
        visible={mostrarCarritoModal}
        onClose={() => setMostrarCarritoModal(false)}
        actualizarCantidad={actualizarCantidadCarrito}
        eliminarProducto={eliminarDelCarrito}
        vaciarCarrito={vaciarCarrito}
      />
    </div>
  );
};

export default Productos;