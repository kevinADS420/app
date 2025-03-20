import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../style/Productos.css';


// Definición de tipos
interface Imagen {
  id: string;
  nombre: string;
  url: string;
}

interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  imagenes: Imagen[];
  descuento?: number; // Para productos en oferta
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

// Opciones para el tipo de producto
const TIPOS_PRODUCTO = [
  { value: 'Frutas', label: 'Frutas' },
  { value: 'Verduras', label: 'Verduras' },
  { value: 'Tuberculos', label: 'Tubérculos' },
  { value: 'Hortalizas', label: 'Hortalizas' },
  { value: 'ofertas', label: 'Ofertas' }
];

// Imágenes para el carrusel del banner
const IMAGENES_BANNER = [
  {
    id: 'banner1',
    url: 'https://ingenieriademenu.com/wp-content/uploads/2022/05/Cuales-son-las-frutas-y-cuales-son-las-verduras.jpg',
    alt: 'Productos frescos de temporada'
  },
  {
    id: 'banner2',
    url: 'https://i.pinimg.com/736x/03/31/a3/0331a3ddb8c5e744b2ec005c23ea9cbc.jpg',
    alt: 'Ofertas especiales en frutas'
  },
  {
    id: 'banner3',
    url: 'https://i.pinimg.com/736x/ec/ab/a3/ecaba3b64e853d7eda45658da3ebff50.jpg',
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

// Componente Carrusel para mostrar las imágenes
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
    <div className="carrusel">
      <div className="carrusel-contenedor">
        <img 
          src={imagenes[indiceActual].url} 
          alt={imagenes[indiceActual].nombre || `Imagen ${indiceActual + 1}`} 
          className="carrusel-imagen" 
        />
        {imagenes.length > 1 && (
          <>
            <button 
              type="button"
              className="carrusel-control carrusel-anterior" 
              onClick={irAAnterior}
              aria-label="Imagen anterior"
            >
              &#10094;
            </button>
            <button 
              type="button"
              className="carrusel-control carrusel-siguiente" 
              onClick={irASiguiente}
              aria-label="Imagen siguiente"
            >
              &#10095;
            </button>
            <div className="carrusel-indicadores">
              {imagenes.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicador ${index === indiceActual ? 'activo' : ''}`}
                  onClick={() => setIndiceActual(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ir a imagen ${index + 1}`}
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
  // Formatear precio
  const formatearPrecio = (precio: number): string => {
    return `$ ${precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Mostrar precio con descuento si aplica
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
  
  return (
    <div className="tarjeta-producto">
      <div className="producto-imagen">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <Carrusel imagenes={producto.imagenes} />
        ) : (
          <div className="sin-imagen">
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <span className={`tipo-badge ${producto.tipo.toLowerCase()}`}>
          {producto.tipo}
        </span>
        {mostrarPrecio()}
      </div>
      
      <button 
        className="btn-agregar" 
        onClick={() => agregarAlCarrito(producto)}
      >
        <i className="icono-carrito"></i> Agregar
      </button>
    </div>
  );
};

// Componente Carrito de Compras
const CarritoCompras: React.FC<{
  productos: ProductoCarrito[],
  visible: boolean,
  onClose: () => void,
  actualizarCantidad: (id: string, cantidad: number) => void,
  eliminarProducto: (id: string) => void,
  vaciarCarrito: () => void
}> = ({ productos, visible, onClose, actualizarCantidad, eliminarProducto, vaciarCarrito }) => {
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
  
  const irAPagar = () => {
    // Aquí iría la lógica para ir a la página de pago
    alert('Redirigiendo a la página de pago...');
    onClose();
  };
  
  return (
    <div className="carrito-overlay">
      <div className="carrito-contenedor">
        <div className="carrito-encabezado">
          <h2>Carrito de Compras</h2>
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
            <div className="carrito-productos">
              {productos.map(producto => (
                <div key={producto.id} className="carrito-item">
                  <div className="item-imagen">
                    {producto.imagenes && producto.imagenes.length > 0 ? (
                      <img 
                        src={producto.imagenes[0].url} 
                        alt={producto.nombre} 
                      />
                    ) : (
                      <div className="sin-imagen-mini">
                        <span>Sin imagen</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="item-detalles">
                    <h4>{producto.nombre}</h4>
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
                <button 
                  className="btn-pagar" 
                  onClick={irAPagar}
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente Barra de Navegación Secundaria
const Navbar: React.FC<{
  cantidadCarrito: number,
  mostrarCarrito: () => void
}> = ({ cantidadCarrito, mostrarCarrito }) => {
  const [menuMobilAbierto, setMenuMobilAbierto] = useState(false);
  
  return (
    <nav className="navbar navbar-secundaria">
      <div className="container navbar-container">
        
        <div className="navbar-busqueda">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
          />
          <button className="btn-buscar"><i className="icono-buscar"></i></button>
        </div>
        
        <button 
          className="navbar-toggler" 
          onClick={() => setMenuMobilAbierto(!menuMobilAbierto)}
        >
          ☰
        </button>
        
        <div className={`navbar-menu ${menuMobilAbierto ? 'abierto' : ''}`}>
          <ul className="navbar-nav">
            {TIPOS_PRODUCTO.map(tipo => (
              <li key={tipo.value} className="nav-item">
                <Link 
                  to={`/categoria/${tipo.value.toLowerCase()}`} 
                  className="nav-link"
                >
                  {tipo.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <button className="btn-carrito" onClick={mostrarCarrito}>
          <span className="icono-carrito"></span>
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
  
  // Cargar productos del localStorage o productos exportados
  useEffect(() => {
    const cargarProductos = () => {
      // Primero intentamos cargar los productos exportados recientemente
      const productosExportados = localStorage.getItem('productosExportados');
      
      if (productosExportados) {
        try {
          const productosParseados = JSON.parse(productosExportados);
          
          // Añadir descuentos aleatorios a algunos productos para mostrarlos como ofertas
          const productosConOfertas = productosParseados.map((p: Producto) => {
            // Asignar descuento aleatoriamente al 30% de los productos
            if (Math.random() < 0.3) {
              return {
                ...p,
                descuento: Math.floor(Math.random() * 30) + 10, // Descuento entre 10% y 40%
                tipo: 'ofertas' // Cambiar tipo a ofertas
              };
            }
            return p;
          });
          
          setProductos(productosConOfertas);
          
          // Limpiamos localStorage para evitar duplicados en futuras cargas
          localStorage.removeItem('productosExportados');
        } catch (e) {
          console.error('Error al cargar productos exportados:', e);
        }
      }
      // Si no hay productos exportados, cargar productos guardados
      else {
        const productosGuardados = localStorage.getItem('productosGuardados');
        if (productosGuardados) {
          try {
            const parsed = JSON.parse(productosGuardados);
            
            // Añadir descuentos aleatorios a algunos productos
            const productosConOfertas = parsed.map((p: Producto) => {
              if (Math.random() < 0.3) {
                return {
                  ...p,
                  descuento: Math.floor(Math.random() * 30) + 10,
                  tipo: 'ofertas'
                };
              }
              return p;
            });
            
            setProductos(productosConOfertas);
          } catch (e) {
            console.error('Error al cargar productos guardados:', e);
          }
        }
      }
    };
    
    cargarProductos();
    
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
  
  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carritoProductos', JSON.stringify(productosCarrito));
  }, [productosCarrito]);
  
  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    setProductosCarrito(prevCarrito => {
      // Verificar si el producto ya está en el carrito
      const productoExistente = prevCarrito.find(p => p.id === producto.id);
      
      if (productoExistente) {
        // Actualizar cantidad si ya existe
        return prevCarrito.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1 } 
            : p
        );
      } else {
        // Agregar como nuevo si no existe
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
    
    // Mostrar notificación de éxito
    alert(`${producto.nombre} agregado al carrito`);
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
    setProductosCarrito(prevCarrito => 
      prevCarrito.filter(p => p.id !== id)
    );
  };
  
  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setProductosCarrito([]);
    }
  };
  
  // Función para alternar la visibilidad del carrito
  const toggleCarrito = () => {
    setMostrarCarritoModal(!mostrarCarritoModal);
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
      filtroTipo === 'todos' || producto.tipo.toLowerCase() === filtroTipo.toLowerCase()
    )
    .filter(producto => 
      producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      producto.tipo.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

  return (
    <div className="tienda">
      {/* La barra de navegación principal ya está en el layout principal */}
      {/* Esta es la barra de categorías y carrito que queremos que esté debajo */}
      <Navbar 
        cantidadCarrito={cantidadTotalCarrito} 
        mostrarCarrito={toggleCarrito} 
      />
      
      {/* Contenido principal */}
      <main>
        {/* Banner con carrusel */}
        <Banner />
        
        <div className="container">
          {/* Categorías botones debajo del carrusel */}
          <CategoriasAccesoRapido 
            categorias={[
              { value: 'Frutas', label: 'Frutas', icono: <i className="icon-frutas">F</i> },
              { value: 'Verduras', label: 'Verduras', icono: <i className="icon-verduras">V</i> },
              { value: 'Tuberculos', label: 'Tubérculos', icono: <i className="icon-tuberculos">T</i> },
              { value: 'Hortalizas', label: 'Hortalizas', icono: <i className="icon-hortalizas">H</i> },
              { value: 'ofertas', label: 'Ofertas', icono: <i className="icon-ofertas">O</i> }
            ]}
          />
          
          {/* Secciones de categorías */}
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
          
          {/* Catálogo completo de productos */}
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
                    {TIPOS_PRODUCTO.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
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
        </div>
      </main>
      
      {/* Modal del carrito de compras */}
      <CarritoCompras 
        productos={productosCarrito}
        visible={mostrarCarritoModal}
        onClose={() => setMostrarCarritoModal(false)}
        actualizarCantidad={actualizarCantidadCarrito}
        eliminarProducto={eliminarDelCarrito}
        vaciarCarrito={vaciarCarrito}
      />
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} HUETOMKT - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Productos;