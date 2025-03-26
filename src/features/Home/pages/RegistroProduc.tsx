import React, { useState, useEffect, useRef } from 'react';
import '../../../style/RegistroProduc.css';

// Definición de tipos
interface Imagen {
  id: string;
  nombre: string;
  url: string;
  file?: File; // Agregamos el archivo original
}

interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  imagenes: Imagen[];
  cantidad?: number;
  fechaIngreso?: Date;
  fechaSalida?: Date;
  fechaRealización?: Date;
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
    cantidad: string;
    fechaIngreso: string;
    fechaSalida: string;
    fechaRealización: string;
  }>({
    nombre: '',
    tipo: '',
    precio: '',
    imagenes: [],
    cantidad: '0',
    fechaIngreso: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    fechaSalida: new Date().toISOString().split('T')[0],
    fechaRealización: new Date().toISOString().split('T')[0]
  });
  
  // Estado para errores de validación
  const [errores, setErrores] = useState<{
    nombre?: string;
    tipo?: string;
    precio?: string;
    cantidad?: string;
    fechaIngreso?: string;
    fechaSalida?: string;
    fechaRealización?: string;
    general?: string;
    imagenes?: string;
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
    
    // Crear nuevas imágenes guardando tanto la URL para preview como el archivo original
    const nuevasImagenes: Imagen[] = fileArray.map(file => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: file.name,
      url: URL.createObjectURL(file),
      file: file // Guardamos el archivo original
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
      cantidad?: string;
      fechaIngreso?: string;
      fechaSalida?: string;
      fechaRealización?: string;
      imagenes?: string;
    } = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del producto es obligatorio';
    }
    
    // Validar que haya al menos una imagen
    if (!formData.imagenes || formData.imagenes.length === 0) {
      nuevosErrores.imagenes = 'Se requiere al menos una imagen del producto';
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
    // Validar cantidad
    if (!formData.cantidad) {
      nuevosErrores.cantidad = 'La cantidad es obligatoria';
    } else {
      const cantidadNumerica = parseInt(formData.cantidad);
      if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
        nuevosErrores.cantidad = 'La cantidad debe ser un número positivo';
      }
    }

    // Validar fechas
    const fechaIngreso = new Date(formData.fechaIngreso);
    const fechaSalida = new Date(formData.fechaSalida);
    const fechaRealización = new Date(formData.fechaRealización);

    if (isNaN(fechaIngreso.getTime())) {
      nuevosErrores.fechaIngreso = 'La fecha de ingreso no es válida';
    }

    if (isNaN(fechaSalida.getTime())) {
      nuevosErrores.fechaSalida = 'La fecha de salida no es válida';
    }

    if (isNaN(fechaRealización.getTime())) {
      nuevosErrores.fechaRealización = 'La fecha de realización no es válida';
    }

    // Validar que la fecha de salida no sea anterior a la de ingreso
    if (fechaSalida < fechaIngreso) {
      nuevosErrores.fechaSalida = 'La fecha de salida no puede ser anterior a la fecha de ingreso';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para convertir imagen a BLOB
  const convertirImagenABlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  // Función para enviar datos al backend
  const enviarProductoAlBackend = async (producto: Producto) => {
    try {
      // Validar que el producto tenga al menos una imagen
      if (!producto.imagenes || producto.imagenes.length === 0) {
        throw new Error('Se requiere al menos una imagen para registrar el producto');
      }

      // Primero crear el registro de inventario
      const inventarioData = new FormData();
      inventarioData.append('cantidad', producto.cantidad?.toString() || '0');
      inventarioData.append('fechaIngreso', producto.fechaIngreso instanceof Date 
        ? producto.fechaIngreso.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]);
      inventarioData.append('fechaSalida', producto.fechaSalida instanceof Date 
        ? producto.fechaSalida.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]);
      inventarioData.append('fechaRealizacion', producto.fechaRealización instanceof Date 
        ? producto.fechaRealización.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]);

      console.log('Datos de inventario a enviar:');
      for (const [key, value] of inventarioData.entries()) {
        console.log(`${key}:`, value);
      }

      // Crear el registro de inventario
      const inventarioResponse = await fetch('https://backendhuertomkt.onrender.com/inventario/create', {
        method: 'POST',
        body: inventarioData
      });

      const inventarioResponseText = await inventarioResponse.text();
      console.log('Respuesta del servidor (inventario):', inventarioResponseText);

      if (!inventarioResponse.ok) {
        let errorMessage = 'Error al crear inventario';
        try {
          const errorData = JSON.parse(inventarioResponseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = inventarioResponseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Obtener el ID del inventario creado
      let idInventario;
      try {
        const inventarioResult = JSON.parse(inventarioResponseText);
        console.log('Resultado parseado del inventario:', inventarioResult);
        
        // El ID está dentro del objeto data como id_inventario
        idInventario = inventarioResult.data?.id_inventario;
        
        if (!idInventario) {
          console.error('No se pudo encontrar el ID en la respuesta:', inventarioResult);
          throw new Error('No se pudo obtener el ID del inventario de la respuesta del servidor');
        }

        console.log('ID de inventario obtenido:', idInventario);
      } catch (error) {
        console.error('Error al procesar la respuesta del inventario:', error);
        throw new Error('Error al procesar la respuesta del servidor de inventario');
      }

      // Ahora crear el producto con el ID de inventario
      const productoData = new FormData();
      productoData.append('nombreP', producto.nombre);
      productoData.append('tipo', producto.tipo);
      productoData.append('Precio', producto.precio.toString());
      productoData.append('id_inventario', idInventario.toString());

      // Si hay imágenes, convertir la primera imagen a BLOB
      if (producto.imagenes && producto.imagenes.length > 0) {
        const imagenBlob = await convertirImagenABlob(producto.imagenes[0].url);
        productoData.append('imagen', imagenBlob, 'imagen.jpg'); // Agregamos nombre de archivo
      }

      console.log('Datos del producto a enviar:');
      for (const [key, value] of productoData.entries()) {
        console.log(`${key}:`, value instanceof Blob ? `Blob de tipo ${value.type}` : value);
      }

      const productoResponse = await fetch('https://backendhuertomkt.onrender.com/product/register', {
        method: 'POST',
        body: productoData
      });

      const productoResponseText = await productoResponse.text();
      console.log('Respuesta del servidor (producto):', productoResponseText);

      if (!productoResponse.ok) {
        let errorMessage = 'Error al crear producto';
        try {
          const errorData = JSON.parse(productoResponseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = productoResponseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return JSON.parse(productoResponseText);
    } catch (error) {
      console.error('Error detallado:', error);
      throw error;
    }
  };

  // Función para enviar múltiples productos al backend
  const enviarProductosAlBackend = async (productos: Producto[]) => {
    try {
      // Enviar productos uno por uno
      for (const producto of productos) {
        await enviarProductoAlBackend(producto);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // Modificar la función guardarProducto para incluir el envío al backend
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      // Convertir fechas de string a objeto Date
      const fechaIngreso = new Date(formData.fechaIngreso);
      const fechaSalida = new Date(formData.fechaSalida);
      const fechaRealización = new Date(formData.fechaRealización);
      const cantidad = parseInt(formData.cantidad);
      
      if (editandoId) {
        // Actualizar producto existente
        const productoActualizado: Producto = {
          id: editandoId,
          nombre: formData.nombre,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
          imagenes: formData.imagenes,
          cantidad: cantidad,
          fechaIngreso: fechaIngreso,
          fechaSalida: fechaSalida,
          fechaRealización: fechaRealización
        };

        // Enviar al backend
        await enviarProductoAlBackend(productoActualizado);
        
        setProductos(prev => 
          prev.map(producto => 
            producto.id === editandoId
              ? productoActualizado
              : producto
          )
        );
        setEditandoId(null);
      } else {
        // Crear nuevo producto
        const nuevoProducto: Producto = {
          id: `prod_${Date.now()}`,
          nombre: formData.nombre,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
          imagenes: formData.imagenes,
          cantidad: cantidad,
          fechaIngreso: fechaIngreso,
          fechaSalida: fechaSalida,
          fechaRealización: fechaRealización
        };
        
        // Enviar al backend
        await enviarProductoAlBackend(nuevoProducto);
        
        setProductos(prev => [...prev, nuevoProducto]);
      }
      
      // Resetear formulario
      setFormData({
        nombre: '',
        tipo: '',
        precio: '',
        imagenes: [],
        cantidad: '0',
        fechaIngreso: new Date().toISOString().split('T')[0],
        fechaSalida: new Date().toISOString().split('T')[0],
        fechaRealización: new Date().toISOString().split('T')[0]
      });

      // Mostrar mensaje de éxito
      alert('Producto guardado exitosamente en el servidor');
    } catch (error) {
      alert('Error al guardar el producto en el servidor. Por favor, intente nuevamente.');
    }
  };

  // Editar un producto
  const editarProducto = (id: string) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    // Formatear fechas para el formulario si existen, o usar fecha actual
    const fechaIngreso = producto.fechaIngreso instanceof Date 
      ? producto.fechaIngreso.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    const fechaSalida = producto.fechaSalida instanceof Date 
      ? producto.fechaSalida.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    const fechaRealización = producto.fechaRealización instanceof Date 
      ? producto.fechaRealización.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
      setFormData({
        nombre: producto.nombre,
        tipo: producto.tipo,
        precio: producto.precio.toString(),
        imagenes: producto.imagenes,
        cantidad: producto.cantidad?.toString() || '0',
        fechaIngreso: fechaIngreso,
        fechaSalida: fechaSalida,
        fechaRealización: fechaRealización
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
            imagenes: [],
            cantidad: '0',
            fechaIngreso: new Date().toISOString().split('T')[0],
            fechaSalida: new Date().toISOString().split('T')[0],
            fechaRealización: new Date().toISOString().split('T')[0]
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
        imagenes: [],
        cantidad: '0',
        fechaIngreso: new Date().toISOString().split('T')[0],
        fechaSalida: new Date().toISOString().split('T')[0],
        fechaRealización: new Date().toISOString().split('T')[0]
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
  
    // Subir productos seleccionados al backend
    const subirProductosSeleccionados = async () => {
      if (productosSeleccionados.length === 0) {
        alert('Por favor, selecciona al menos un producto para exportar');
        return;
      }
  
      try {
        // Filtrar los productos seleccionados
        const productosAExportar = productos.filter((p: Producto) => 
          productosSeleccionados.includes(p.id)
        );
  
        // Enviar al backend
        await enviarProductosAlBackend(productosAExportar);
  
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
  
        alert('Productos exportados exitosamente al servidor');
      } catch (error) {
        alert('Error al exportar los productos al servidor. Por favor, intente nuevamente.');
      }
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
      <div className="registro-productos-page">
        <header className="rp-header">
          <div className="rp-container">
            <h1>Registro de Productos</h1>
          </div>
        </header>
        
        <main className="rp-main">
          <div className="rp-container">
            <div className="rp-grid">
              {/* Formulario */}
              <section className="rp-card" id="formulario-producto">
                <h2>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                
                <form onSubmit={guardarProducto}>
                  {errores.general && (
                    <div className="rp-alert rp-alert-error">{errores.general}</div>
                  )}
                  
                  <div className="rp-form-group">
                    <label htmlFor="nombre">Nombre del Producto</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`rp-input ${errores.nombre ? 'rp-error' : ''}`}
                      placeholder="Ej: Manzana"
                    />
                    {errores.nombre && <p className="rp-error-message">{errores.nombre}</p>}
                  </div>
                  
                  <div className="rp-form-group">
                    <label>Tipo de Producto (Detectado automáticamente)</label>
                    <div className="rp-tipo-detectado">
                      {formData.tipo ? (
                        <span className={`rp-tipo-badge ${formData.tipo}`}>
                          {obtenerEtiquetaTipo(formData.tipo)}
                        </span>
                      ) : (
                        <span className="rp-tipo-no-detectado">
                          Se detectará al ingresar el nombre
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="rp-form-group">
                    <label htmlFor="precio">Precio</label>
                    <div className="rp-input-icon">
                      <span className="rp-icon">$</span>
                      <input
                        type="text"
                        id="precio"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        className={`rp-input ${errores.precio ? 'rp-error' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errores.precio && <p className="rp-error-message">{errores.precio}</p>}
                  </div>
                  
                  {/* Nuevos campos para inventario */}
                  <div className="rp-form-group">
                    <label htmlFor="cantidad">Cantidad en inventario</label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      className={`rp-input ${errores.cantidad ? 'rp-error' : ''}`}
                      min="0"
                      placeholder="0"
                    />
                    {errores.cantidad && <p className="rp-error-message">{errores.cantidad}</p>}
                  </div>
                  
                  <div className="rp-form-group">
                    <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
                    <input
                      type="date"
                      id="fechaIngreso"
                      name="fechaIngreso"
                      value={formData.fechaIngreso}
                      onChange={handleInputChange}
                      className={`rp-input ${errores.fechaIngreso ? 'rp-error' : ''}`}
                    />
                    {errores.fechaIngreso && <p className="rp-error-message">{errores.fechaIngreso}</p>}
                  </div>
                  
                  <div className="rp-form-group">
                    <label htmlFor="fechaSalida">Fecha de Salida</label>
                    <input
                      type="date"
                      id="fechaSalida"
                      name="fechaSalida"
                      value={formData.fechaSalida}
                      onChange={handleInputChange}
                      className={`rp-input ${errores.fechaSalida ? 'rp-error' : ''}`}
                    />
                    {errores.fechaSalida && <p className="rp-error-message">{errores.fechaSalida}</p>}
                  </div>
                  
                  <div className="rp-form-group">
                    <label htmlFor="fechaRealización">Fecha de Realización</label>
                    <input
                      type="date"
                      id="fechaRealización"
                      name="fechaRealización"
                      value={formData.fechaRealización}
                      onChange={handleInputChange}
                      className={`rp-input ${errores.fechaRealización ? 'rp-error' : ''}`}
                    />
                    {errores.fechaRealización && <p className="rp-error-message">{errores.fechaRealización}</p>}
                  </div>
                  
                  <div className="rp-form-group">
                    <label htmlFor="imagenes">Imágenes</label>
                    <div className="rp-selector-imagenes">
                      <input
                        type="file"
                        id="imagenes"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="rp-input-file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      
                      <button 
                        type="button"
                        className={`rp-btn rp-btn-primary ${errores.imagenes ? 'rp-error' : ''}`}
                        onClick={handleSelectImageClick}
                      >
                        Seleccionar imágenes
                      </button>
                      
                      {formData.imagenes.length > 0 && (
                        <span className="rp-contador-imagenes">
                          {formData.imagenes.length} {formData.imagenes.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                        </span>
                      )}
                    </div>
                    
                    {errores.imagenes && <p className="rp-error-message">{errores.imagenes}</p>}
                    
                    {formData.imagenes.length > 0 && (
                      <div className="rp-carrusel">
                        <Carrusel 
                          imagenes={formData.imagenes} 
                          onEliminar={eliminarImagen} 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="rp-form-actions">
                    {editandoId && (
                      <button
                        type="button"
                        className="rp-btn rp-btn-secondary"
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    )}
                    <button type="submit" className="rp-btn rp-btn-primary">
                      {editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                  </div>
                </form>
              </section>
              
              {/* Sección para exportar productos */}
              <section className="rp-card exportar-productos">
                <h2>Exportar Productos</h2>
                
                <div className="rp-opciones-exportacion">
                  <div className="rp-descripcion-exportar">
                    <p>Selecciona productos de la lista para exportarlos a la plantilla de Productos.</p>
                  </div>
                  
                  <div className="rp-controles-exportacion">
                    <div className="rp-toggle-seleccion">
                      <label className="rp-switch">
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
                        <span className="rp-slider round"></span>
                      </label>
                      <span className="rp-texto-modo">Modo selección {seleccionMultiple ? 'activado' : 'desactivado'}</span>
                    </div>
                    
                    {seleccionMultiple && (
                      <div className="rp-acciones-seleccion">
                        <button 
                          type="button" 
                          className="rp-btn rp-btn-secundario rp-btn-sm"
                          onClick={() => seleccionarTodos(true)}
                        >
                          Seleccionar todos
                        </button>
                        <button 
                          type="button" 
                          className="rp-btn rp-btn-secundario rp-btn-sm"
                          onClick={() => seleccionarTodos(false)}
                        >
                          Deseleccionar todos
                        </button>
                        <button 
                          type="button" 
                          className="rp-btn rp-btn-primario"
                          onClick={subirProductosSeleccionados}
                        >
                          Exportar seleccionados ({productosSeleccionados.length})
                        </button>
                      </div>
                    )}
                    
                    {mostrarMensajeExito && (
                      <div className="rp-alerta rp-alerta-exito">
                        ¡Productos exportados correctamente! Ya están disponibles en la plantilla de Productos.
                        </div>
                  )}
                </div>
              </div>
            </section>
            
            {/* Lista de Productos */}
            <section className="rp-card">
              <h2>Productos Registrados</h2>
              
              <div className="rp-filtros">
                <div className="rp-busqueda">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className="rp-input"
                  />
                </div>
                
                <div className="rp-filtro-tipo">
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="rp-select"
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
                <div className="rp-sin-productos">
                  <p>No hay productos que coincidan con tu búsqueda.</p>
                  {terminoBusqueda || filtroTipo !== 'todos' ? (
                    <button 
                      type="button"
                      className="rp-btn rp-btn-link"
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
                <div className="rp-grid">
                  {productosFiltrados.map(producto => (
                    <div 
                      key={producto.id} 
                      className={`rp-producto-card ${seleccionMultiple && productosSeleccionados.includes(producto.id) ? 'rp-seleccionado' : ''}`}
                      onClick={() => seleccionMultiple && toggleSeleccionProducto(producto.id)}
                    >
                      <div className="rp-producto-imagen">
                        {producto.imagenes && producto.imagenes.length > 0 ? (
                          <img 
                            src={producto.imagenes[0].url} 
                            alt={producto.nombre} 
                          />
                        ) : (
                          <div className="rp-sin-imagen">
                            <span>Sin imagen</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="rp-producto-info">
                        <h3>{producto.nombre}</h3>
                        <span className={`rp-tipo-badge ${producto.tipo}`}>
                          {obtenerEtiquetaTipo(producto.tipo)}
                        </span>
                        <div className="rp-precio">{formatearPrecio(producto.precio)}</div>
                        
                        {/* Mostrar información de inventario */}
                        <div className="rp-inventario-info">
                          <p>Cantidad: <strong>{producto.cantidad || 0}</strong></p>
                          {producto.fechaIngreso && (
                            <p className="rp-fecha">
                              <small>Ingreso: {new Date(producto.fechaIngreso).toLocaleDateString('es-CO')}</small>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="rp-acciones">
                        <button
                          type="button"
                          className="rp-btn rp-btn-primary"
                          onClick={() => editarProducto(producto.id)}
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          className="rp-btn rp-btn-secondary"
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
        </div>
      </main>
      
      <footer className="rp-footer">
        <div className="rp-container">
          <p>© {new Date().getFullYear()} - Sistema de Registro de Productos</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistroProductos;