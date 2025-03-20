import React, { useState, useEffect, useRef } from 'react';
import '../../../style/RegistroProduc.css';

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
  seleccionado?: boolean; // Campo opcional para marcar productos seleccionados
}

// Opciones para el tipo de producto
const TIPOS_PRODUCTO = [
  { value: 'Frutas', label: 'Frutas' },
  { value: 'Verduras', label: 'Verduras' },
  { value: 'Tuberculos', label: 'Tubérculos' }, // Corregido a "Tuberculos" sin acento para consistencia
  { value: 'Hortalizas', label: 'Hortalizas' },
  { value: 'otros', label: 'Otros' }
];

// Base de datos de productos por categoría para la clasificación automática
const PRODUCTOS_POR_CATEGORIA = {
  Frutas: [
    'manzana', 'pera', 'plátano', 'banana', 'naranja', 'mandarina', 'limón', 'lima', 
    'fresa', 'frambuesa', 'arándano', 'mora', 'cereza', 'melón', 'sandía', 'piña', 
    'kiwi', 'mango', 'papaya', 'uva', 'ciruela', 'melocotón', 'durazno', 'nectarina',
    'aguacate', 'granada', 'higo', 'coco', 'níspero', 'membrillo', 'maracuyá'
  ],
  Verduras: [
    'lechuga', 'espinaca', 'acelga', 'col', 'repollo', 'brócoli', 'coliflor', 
    'espárrago', 'alcachofa', 'pimiento', 'berenjena', 'calabacín', 'pepino', 
    'judía', 'haba', 'apio', 'puerro', 'nabo', 'rábano', 'zanahoria'
  ],
  Tuberculos: [
    'patata', 'papa', 'boniato', 'batata', 'yuca', 'mandioca', 'ñame', 'jengibre', 
    'cúrcuma', 'remolacha', 'malanga', 'taro', 'topinambur', 'arracacha'
  ],
  Hortalizas: [
    'tomate', 'cebolla', 'ajo', 'calabaza', 'maíz', 'guisante', 'arveja', 'garbanzo', 
    'lenteja', 'frijol', 'poroto', 'alubia', 'chícharo', 'okra', 'quimbombó', 
    'rúcula', 'canónigo', 'berro'
  ]
};

// Componente Carrusel para mostrar las imágenes
const Carrusel: React.FC<{imagenes: Imagen[], onEliminar: (id: string) => void}> = ({ imagenes, onEliminar }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Iniciar el carrusel automático
  useEffect(() => {
    if (imagenes.length > 1) {
      // Usar window.setInterval y guardar la referencia
      intervalRef.current = window.setInterval(() => {
        setIndiceActual(prev => (prev + 1) % imagenes.length);
      }, 3000); // Cambiar cada 3 segundos
    }
    
    // Limpiar el intervalo cuando el componente se desmonte o las imágenes cambien
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imagenes]);

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
          alt={imagenes[indiceActual].nombre} 
          className="carrusel-imagen" 
        />
        <button
          type="button"
          className="btn-eliminar-imagen carrusel-eliminar"
          onClick={() => onEliminar(imagenes[indiceActual].id)}
          aria-label="Eliminar imagen"
        >
          ×
        </button>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIndiceActual(index);
                    }
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

const RegistroProductos: React.FC = () => {
  // Referencia para el input de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para la lista de productos
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState<{
    nombre: string;
    tipo: string;
    precio: string;
    imagenes: Imagen[];
  }>({
    nombre: '',
    tipo: '',
    precio: '',
    imagenes: [],
  });
  
  // Estado para errores de validación
  const [errores, setErrores] = useState<{
    nombre?: string;
    tipo?: string;
    precio?: string;
    general?: string;
  }>({});
  
  // Estado para modo edición
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // Estado para el filtro de tipo
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  
  // Estado para la búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  // Estado para controlar la selección múltiple
  const [seleccionMultiple, setSeleccionMultiple] = useState<boolean>(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([]);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState<boolean>(false);

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      try {
        // Convertimos la cadena JSON a objeto JavaScript
        setProductos(JSON.parse(productosGuardados));
      } catch (e) {
        console.error('Error al cargar productos del localStorage:', e);
      }
    }
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    // Guardamos como objeto JavaScript convertido a cadena JSON
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [productos]);

  // Función para categorizar automáticamente el producto según su nombre
  const categorizarProducto = (nombre: string): string => {
    const nombreLowerCase = nombre.toLowerCase();
    
    // Buscamos en cada categoría
    for (const [categoria, productos] of Object.entries(PRODUCTOS_POR_CATEGORIA)) {
      for (const producto of productos) {
        if (nombreLowerCase.includes(producto)) {
          return categoria;
        }
      }
    }
    
    // Si no encuentra ninguna coincidencia
    return 'otros';
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nombre') {
      // Si el campo es nombre, categorizamos automáticamente
      const tipoDetectado = categorizarProducto(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        tipo: tipoDetectado // Establecemos el tipo automáticamente
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error al cambiar el valor
    if (errores[name as keyof typeof errores]) {
      setErrores(prev => {
        const nuevoErrores = { ...prev };
        delete nuevoErrores[name as keyof typeof errores];
        return nuevoErrores;
      });
    }
  };

  // Manejar la subida de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convertir FileList a Array para poder iterarlo
    const fileArray = Array.from(files);
    
    // Crear nuevas imágenes (en un sistema real, aquí se subirían a un servidor)
    const nuevasImagenes: Imagen[] = fileArray.map(file => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: file.name,
      url: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...nuevasImagenes]
    }));
  };

  // Función para activar el diálogo de selección de archivos
  const handleSelectImageClick = () => {
    // Usar la referencia para hacer clic en el input file
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Eliminar una imagen del formulario
  const eliminarImagen = (id: string) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter(img => img.id !== id)
    }));
  };

  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: {
      nombre?: string;
      precio?: string;
    } = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del producto es obligatorio';
    }
    
    // Ya no validamos tipo porque se asigna automáticamente
    
    // Validar precio
    if (!formData.precio) {
      nuevosErrores.precio = 'El precio es obligatorio';
    } else if (!/^\d+(\.\d{3})*(,\d{1,2})?$/.test(formData.precio)) {
      nuevosErrores.precio = 'El precio debe ser un número válido (ej: 19.999,99)';
    } else {
      // Convertir el precio de formato colombiano a número
      const precioNumerico: number = parseFloat(
        formData.precio.replace(/\./g, '').replace(',', '.')
      );
      
      if (isNaN(precioNumerico)) {
        nuevosErrores.precio = 'El formato del precio no es válido';
      }
    }
        
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar o actualizar un producto
  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    if (editandoId) {
      // Actualizar producto existente
      setProductos(prev => 
        prev.map(producto => 
          producto.id === editandoId
            ? {
                ...producto,
                nombre: formData.nombre,
                tipo: formData.tipo, // Tipo asignado automáticamente
                precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
                imagenes: formData.imagenes
              }
            : producto
        )
      );
      setEditandoId(null);
    } else {
      // Crear nuevo producto
      const nuevoProducto: Producto = {
        id: `prod_${Date.now()}`,
        nombre: formData.nombre,
        tipo: formData.tipo, // Tipo asignado automáticamente
        precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
        imagenes: formData.imagenes,
      };
      
      setProductos(prev => [...prev, nuevoProducto]);
    }
    
    // Resetear formulario
    setFormData({
      nombre: '',
      tipo: '',
      precio: '',
      imagenes: []
    });
  };

  // Editar un producto
  const editarProducto = (id: string) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    setFormData({
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: producto.precio.toString(),
      imagenes: producto.imagenes
    });
    
    setEditandoId(id);
    
    // Scroll al formulario
    const formularioElement = document.getElementById('formulario-producto');
    if (formularioElement) {
      formularioElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Eliminar un producto
  const eliminarProducto = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductos(prev => prev.filter(producto => producto.id !== id));
      
      // Si estamos editando el producto que se elimina, limpiar el formulario
      if (editandoId === id) {
        setFormData({
          nombre: '',
          tipo: '',
          precio: '',
          imagenes: []
        });
        setEditandoId(null);
      }
    }
  };

  // Cancelar la edición
  const cancelarEdicion = () => {
    setFormData({
      nombre: '',
      tipo: '',
      precio: '',
      imagenes: []
    });
    setEditandoId(null);
    setErrores({});
  };

  // Filtrar productos por tipo y término de búsqueda
  const productosFiltrados = productos
    .filter(producto => 
      filtroTipo === 'todos' || producto.tipo === filtroTipo
    )
    .filter(producto => 
      producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      TIPOS_PRODUCTO.find(t => t.value === producto.tipo)?.label
        .toLowerCase()
        .includes(terminoBusqueda.toLowerCase())
    );

  // Función para alternar la selección de un producto
  const toggleSeleccionProducto = (id: string) => {
    setProductosSeleccionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(prodId => prodId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Función para seleccionar o deseleccionar todos los productos
  const seleccionarTodos = (seleccionar: boolean) => {
    if (seleccionar) {
      const todosIds = productosFiltrados.map((p: Producto) => p.id);
      setProductosSeleccionados(todosIds);
    } else {
      setProductosSeleccionados([]);
    }
  };

  // Función para subir productos seleccionados a Productos.tsx
  const subirProductosSeleccionados = () => {
    // Si no hay productos seleccionados, mostrar alerta
    if (productosSeleccionados.length === 0) {
      alert('Por favor, selecciona al menos un producto para exportar');
      return;
    }

    // Filtrar los productos seleccionados
    const productosAExportar = productos.filter((p: Producto) => 
      productosSeleccionados.includes(p.id)
    );

    // Guardar en localStorage para que Productos.tsx pueda acceder a ellos
    localStorage.setItem('productosExportados', JSON.stringify(productosAExportar));
    
    // Mostrar mensaje de éxito
    setMostrarMensajeExito(true);
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setMostrarMensajeExito(false);
    }, 3000);
    
    // Desactivar modo selección múltiple y limpiar selecciones
    setSeleccionMultiple(false);
    setProductosSeleccionados([]);
  };

  // Obtener la etiqueta del tipo de producto
  const obtenerEtiquetaTipo = (tipoValue: string): string => {
    const tipo = TIPOS_PRODUCTO.find(t => t.value === tipoValue);
    return tipo ? tipo.label : 'Desconocido';
  };

  // Formatear precio a moneda con símbolo de peso colombiano
  const formatearPrecio = (precio: number): string => {
    // Formato con símbolo de peso colombiano
    return `$ ${precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="registro-productos">
      <header className="header">
        <div className="container">
          <h1>Registro de Productos</h1>
        </div>
      </header>
      
      <main className="container main-content">
        <div className="grid">
          {/* Formulario */}
          <section className="card" id="formulario-producto">
            <h2>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            
            <form onSubmit={guardarProducto}>
              {errores.general && (
                <div className="alerta alerta-error">{errores.general}</div>
              )}
              
              <div className="form-grupo">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errores.nombre ? 'error' : ''}
                  placeholder="Ej: Manzana"
                />
                {errores.nombre && <p className="mensaje-error">{errores.nombre}</p>}
              </div>
              
              {/* Mostramos el tipo detectado pero no permitimos editarlo */}
              <div className="form-grupo">
                <label>Tipo de Producto (Detectado automáticamente)</label>
                <div className="tipo-detectado">
                  {formData.tipo ? (
                    <span className={`tipo-badge ${formData.tipo}`}>
                      {obtenerEtiquetaTipo(formData.tipo)}
                    </span>
                  ) : (
                    <span className="tipo-no-detectado">
                      Se detectará al ingresar el nombre
                    </span>
                  )}
                </div>
              </div>
              
              <div className="form-grupo">
                <label htmlFor="precio">Precio</label>
                <div className="input-icon">
                  {/* Símbolo de peso */}
                  <span className="icon">$</span>
                  <input
                    type="text"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className={errores.precio ? 'error' : ''}
                    placeholder="0.00"
                  />
                </div>
                {errores.precio && <p className="mensaje-error">{errores.precio}</p>}
              </div>
              
              <div className="form-grupo">
                <label htmlFor="imagenes">Imágenes</label>
                <div className="selector-imagenes">
                  {/* Input oculto */}
                  <input
                    type="file"
                    id="imagenes"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="input-file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  
                  {/* Botón visible que activa el input oculto */}
                  <button 
                    type="button"
                    className="btn-selector-imagenes" 
                    onClick={handleSelectImageClick}
                  >
                    Seleccionar imágenes
                  </button>
                  
                  {/* Contador de imágenes seleccionadas */}
                  {formData.imagenes.length > 0 && (
                    <span className="contador-imagenes">
                      {formData.imagenes.length} {formData.imagenes.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                    </span>
                  )}
                </div>
                
                {/* Carrusel de imágenes seleccionadas */}
                {formData.imagenes.length > 0 && (
                  <Carrusel 
                    imagenes={formData.imagenes} 
                    onEliminar={eliminarImagen} 
                  />
                )}
              </div>
              
              <div className="form-actions">
                {editandoId && (
                  <button
                    type="button"
                    className="btn btn-secundario"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn btn-primario">
                  {editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </section>
          
          {/* Sección para exportar productos */}
          <section className="card exportar-productos">
            <h2>Exportar Productos</h2>
            
            <div className="opciones-exportacion">
              <div className="descripcion-exportar">
                <p>Selecciona productos de la lista para exportarlos a la plantilla de Productos.</p>
              </div>
              
              <div className="controles-exportacion">
                <div className="toggle-seleccion">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={seleccionMultiple}
                      onChange={() => {
                        setSeleccionMultiple(!seleccionMultiple);
                        // Si desactivamos, limpiamos selección
                        if (seleccionMultiple) {
                          setProductosSeleccionados([]);
                        }
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="texto-modo">Modo selección {seleccionMultiple ? 'activado' : 'desactivado'}</span>
                </div>
                
                {seleccionMultiple && (
                  <div className="acciones-seleccion">
                    <button 
                      type="button" 
                      className="btn btn-secundario btn-sm"
                      onClick={() => seleccionarTodos(true)}
                    >
                      Seleccionar todos
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secundario btn-sm"
                      onClick={() => seleccionarTodos(false)}
                    >
                      Deseleccionar todos
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primario"
                      onClick={subirProductosSeleccionados}
                    >
                      Exportar seleccionados ({productosSeleccionados.length})
                    </button>
                  </div>
                )}
                
                {mostrarMensajeExito && (
                  <div className="alerta alerta-exito">
                    ¡Productos exportados correctamente! Ya están disponibles en la plantilla de Productos.
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* Lista de Productos */}
          <section className="card">
            <h2>Productos Registrados</h2>
            
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
            
            {productosFiltrados.length === 0 ? (
              <div className="sin-productos">
                <p>No hay productos que coincidan con tu búsqueda.</p>
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
              <div className="lista-productos">
                {productosFiltrados.map(producto => (
                  <div 
                    key={producto.id} 
                    className={`producto-card ${seleccionMultiple && productosSeleccionados.includes(producto.id) ? 'seleccionado' : ''}`}
                    onClick={() => seleccionMultiple && toggleSeleccionProducto(producto.id)}
                  >
                    {seleccionMultiple && (
                      <div className="checkbox-seleccion">
                        <input
                          type="checkbox"
                          checked={productosSeleccionados.includes(producto.id)}
                          onChange={(e) => {
                            e.stopPropagation(); // Evitar que el clic se propague a la tarjeta
                            toggleSeleccionProducto(producto.id);
                          }}
                        />
                      </div>
                    )}
                    <div className="producto-imagen">
                      {producto.imagenes && producto.imagenes.length > 0 ? (
                        <Carrusel 
                          imagenes={producto.imagenes} 
                          onEliminar={() => {}} // No permitimos eliminar desde la lista
                        />
                      ) : (
                        <div className="sin-imagen">
                          <span>Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="producto-info">
                      <h3>{producto.nombre}</h3>
                      <span className={`tipo-badge ${producto.tipo}`}>
                        {obtenerEtiquetaTipo(producto.tipo)}
                      </span>
                      <div className="precio">{formatearPrecio(producto.precio)}</div>
                    </div>
                    
                    <div className="producto-acciones">
                      <button
                        type="button"
                        className="btn btn-editar"
                        onClick={() => editarProducto(producto.id)}
                      >
                        Actualizar
                      </button>
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} - Sistema de Registro de Productos</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistroProductos;