import React, { useState, useEffect, useRef } from 'react';
import '../../../style/RegistroProduc.css';
import logo from '../../../assets/images/logo.png';

// Definición de tipos
interface Imagen {
  id: string;
  nombre: string;
  url: string;
  file?: File; // Agregamos el archivo original
}

interface Producto {
  id: string;         // ID local para manejo en el frontend
  idServidor?: string; // ID del servidor para operaciones de backend
  nombreP: string;
  tipo: string;
  precio: number;
  imagenes: Imagen[];
  cantidad?: number;
  fechaIngreso?: Date;
  fechaSalida?: Date;
  fechaRealización?: Date;
  seleccionado?: boolean;
  id_proveedor?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el formulario
  const [formData, setFormData] = useState<{
    nombreP: string;
    tipo: string;
    precio: string;
    imagenes: Imagen[];
    cantidad: string;
    fechaIngreso: string;
    fechaSalida: string;
    fechaRealización: string;
  }>({
    nombreP: '',
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
    nombreP?: string;
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

  // Estado para controlar la notificación
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [mostrarCarga, setMostrarCarga] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState('');

  // Agregar estados para el modal de confirmación
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  // Función para obtener productos del backend
  const obtenerProductosDelBackend = async () => {
    try {
      const response = await fetch('https://backendhuertomkt.onrender.com/products');
      if (!response.ok) {
        throw new Error('Error al obtener productos del servidor');
      }
      const data = await response.json();
      
      // Obtener el id_proveedor del usuario actual
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const idProveedorActual = userData?.id_proveedor;

      if (!idProveedorActual) {
        console.error('No se encontró ID del proveedor en localStorage');
        return;
      }
      
      // Transformar y filtrar los productos
      const productosFormateados = data
        .filter((prod: any) => {
          // Si el id_proveedor es null, verificar si hay un id_inventario y obtener el id_proveedor de allí
          const idProveedorProducto = prod.id_proveedor || (prod.id_inventario ? prod.id_inventario.id_proveedor : null);
          const coincide = idProveedorProducto && String(idProveedorProducto) === String(idProveedorActual);
          return coincide;
        })
        .map((prod: any) => ({
          id: prod.id_producto.toString(),
          nombreP: prod.nombreP,
          tipo: prod.tipo,
          precio: parseFloat(prod.Precio),
          imagenes: Array.isArray(prod.imagen) 
            ? prod.imagen.map((img: string, index: number) => ({
                id: `img_${prod.id_producto}_${index}`,
                nombre: `Imagen ${index + 1} del producto`,
                url: img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`
              }))
            : prod.imagen ? [{
                id: `img_${prod.id_producto}_0`,
                nombre: 'Imagen del producto',
                url: prod.imagen.startsWith('data:') 
                  ? prod.imagen 
                  : `data:image/jpeg;base64,${prod.imagen}`
              }] : [],
          cantidad: prod.cantidad || 0,
          fechaIngreso: new Date(prod.fecha_ingreso || Date.now()),
          fechaSalida: new Date(prod.fecha_salida || Date.now()),
          fechaRealización: new Date(prod.fecha_realizacion || Date.now()),
          id_proveedor: (prod.id_proveedor || (prod.id_inventario ? prod.id_inventario.id_proveedor : null))?.toString()
        }));

      setProductos(productosFormateados);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar productos cuando se monta el componente
  useEffect(() => {
    obtenerProductosDelBackend();

    // Configurar un intervalo para actualizar los productos cada 30 segundos
    const intervalId = setInterval(() => {
      obtenerProductosDelBackend();
    }, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // Solo se ejecuta al montar el componente

  // Efecto para recargar productos cuando cambie productosExportados en localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productosExportados' && e.newValue) {
        obtenerProductosDelBackend();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    
    if (name === 'nombreP') {
      // Si el campo es nombreP, categorizamos automáticamente
      const tipoDetectado = categorizarProducto(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        tipo: tipoDetectado
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
      nombreP?: string;
      precio?: string;
      cantidad?: string;
      fechaIngreso?: string;
      fechaSalida?: string;
      fechaRealización?: string;
      imagenes?: string;
    } = {};
    
    // Validar nombreP
    if (!formData.nombreP.trim()) {
      nuevosErrores.nombreP = 'El nombre del producto es obligatorio';
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
      // Validar que las fechas existan
      if (!producto.fechaIngreso || !producto.fechaSalida || !producto.fechaRealización) {
        throw new Error('Las fechas son requeridas');
      }

      // Obtener el id_proveedor del objeto user almacenado en localStorage
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const idProveedor = userData?.id_proveedor;

      if (!idProveedor) {
        throw new Error('No se encontró el ID del proveedor');
      }

      // Primero crear el inventario
      const inventarioData = {
        cantidad: producto.cantidad || 0,
        fecha_ingreso: producto.fechaIngreso.toISOString().split('T')[0],
        fecha_salida: producto.fechaSalida.toISOString().split('T')[0],
        fecha_realizacion: producto.fechaRealización.toISOString().split('T')[0],
        id_proveedor: idProveedor
      };

      const inventarioResponse = await fetch('https://backendhuertomkt.onrender.com/inventario/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inventarioData)
      });

      if (!inventarioResponse.ok) {
        throw new Error('Error al crear el inventario');
      }

      const inventarioResult = await inventarioResponse.json();

      // Verificar que tenemos el ID del inventario
      if (!inventarioResult.data?.id_inventario) {
        throw new Error('No se recibió el ID del inventario');
      }

      // Crear el FormData para el producto
      const productoData = new FormData();
      productoData.append('nombreP', producto.nombreP);
      productoData.append('tipo', producto.tipo);
      productoData.append('Precio', producto.precio.toString());
      productoData.append('id_inventario', inventarioResult.data.id_inventario.toString());
      productoData.append('id_proveedor', idProveedor.toString());

      // Mostrar los datos que se enviarán al backend
      console.log('Datos del producto que se enviarán al backend:', {
        nombreP: producto.nombreP,
        tipo: producto.tipo,
        Precio: producto.precio.toString(),
        id_inventario: inventarioResult.data.id_inventario.toString(),
        id_proveedor: idProveedor.toString()
      });

      // Agregar la imagen si existe
      if (producto.imagenes && producto.imagenes.length > 0) {
        const imagen = producto.imagenes[0];
        if (imagen.file) {
          const imagenBlob = await convertirImagenABlob(imagen.url);
          productoData.append('imagen', imagenBlob, 'producto.jpg');
        }
      }

      // Enviar el producto al backend
      const productoResponse = await fetch('https://backendhuertomkt.onrender.com/product/register', {
        method: 'POST',
        body: productoData
      });

      if (!productoResponse.ok) {
        const errorData = await productoResponse.json();
        throw new Error(errorData.message || 'Error al crear el producto');
      }

      const productoResult = await productoResponse.json();

      // Guardar en localStorage para actualizar la lista de productos
      localStorage.setItem('productosExportados', 'true');

      return productoResult;
    } catch (error) {
      console.error('Error en enviarProductoAlBackend:', error);
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

  // Modificar la función guardarProducto para guardar el ID del servidor
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
        const productoExistente = productos.find(p => p.id === editandoId);
        
        const productoActualizado: Producto = {
          id: editandoId,
          idServidor: productoExistente?.idServidor, // Mantener el ID del servidor si existe
          nombreP: formData.nombreP,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
          imagenes: formData.imagenes,
          cantidad: cantidad,
          fechaIngreso: fechaIngreso,
          fechaSalida: fechaSalida,
          fechaRealización: fechaRealización
        };
  
        // Enviar al backend
        const respuestaServidor = await enviarProductoAlBackend(productoActualizado);
        
        // Actualizar el producto con el ID del servidor si se devolvió
        if (respuestaServidor && respuestaServidor.data && respuestaServidor.data.id_producto) {
          productoActualizado.idServidor = respuestaServidor.data.id_producto;
        }
        
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
          nombreP: formData.nombreP,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio.replace(/\./g, '').replace(',', '.')),
          imagenes: formData.imagenes,
          cantidad: cantidad,
          fechaIngreso: fechaIngreso,
          fechaSalida: fechaSalida,
          fechaRealización: fechaRealización
        };
        
        // Enviar al backend
        const respuestaServidor = await enviarProductoAlBackend(nuevoProducto);
        
        // Guardar el ID del servidor si se devolvió
        if (respuestaServidor && respuestaServidor.data && respuestaServidor.data.id_producto) {
          nuevoProducto.idServidor = respuestaServidor.data.id_producto;
        }
        
        setProductos(prev => [...prev, nuevoProducto]);
      }
      
      // Resetear formulario
      setFormData({
        nombreP: '',
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
  
  // Modificar la función eliminarProducto
  const eliminarProducto = async (id: string | number) => {
    // Convertir id a string si es un número
    const idStr = id.toString();
    
    // Buscar el producto en el estado local
    const producto = productos.find(p => p.id === idStr);
    
    if (!producto) {
      throw new Error('Producto no encontrado en el estado local');
    }

    // Mostrar el modal de confirmación
    setProductoAEliminar(producto);
    setMostrarModalConfirmacion(true);
  };

  // Función para confirmar la eliminación
  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;

    try {
      console.log('Producto a eliminar:', productoAEliminar);
      
      // Asegurarnos de que el ID sea un número para el backend
      const idNumerico = parseInt(productoAEliminar.id);
      if (isNaN(idNumerico)) {
        throw new Error('ID de producto inválido');
      }
      
      console.log('ID que se usará para eliminar:', idNumerico);
      
      // Hacer la petición DELETE al backend con el ID en el body
      const response = await fetch('https://backendhuertomkt.onrender.com/product/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_producto: idNumerico
        })
      });
      
      // Log de la respuesta completa
      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);
      
      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        let errorMessage = 'Error al eliminar el producto';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Si no es JSON, usar el texto de la respuesta
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Si la eliminación en el servidor fue exitosa, actualizar el estado local
      setProductos(prev => prev.filter(p => p.id !== productoAEliminar.id));
      
      // Si estamos editando el producto que se elimina, limpiar el formulario
      if (editandoId === productoAEliminar.id) {
        setFormData({
          nombreP: '',
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
      
      // Cerrar el modal
      setMostrarModalConfirmacion(false);
      setProductoAEliminar(null);
      
      // Mostrar mensaje de éxito
      setMensajeNotificacion('Producto eliminado exitosamente');
      setMostrarNotificacion(true);
      setTimeout(() => setMostrarNotificacion(false), 3000);
      
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      
      // Mostrar mensaje de error
      setMensajeNotificacion(`Error al eliminar el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setMostrarNotificacion(true);
      setTimeout(() => setMostrarNotificacion(false), 5000);
    }
  };

  // Función para cancelar la eliminación
  const cancelarEliminacion = () => {
    setMostrarModalConfirmacion(false);
    setProductoAEliminar(null);
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
        nombreP: producto.nombreP,
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
  
  // Filtrar productos por tipo y término de búsqueda
  const productosFiltrados = productos
    .filter(producto => 
      filtroTipo === 'todos' || producto.tipo === filtroTipo
    )
    .filter(producto => 
      producto.nombreP.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
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
      {/* Modal de confirmación */}
      {mostrarModalConfirmacion && productoAEliminar && (
        <div className="rp-modal-overlay">
          <div className="rp-modal">
            <div className="rp-modal-header">
              <img src={logo} alt="Logo" className="rp-modal-logo" />
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="rp-modal-content">
              <div className="rp-producto-preview">
                {productoAEliminar.imagenes && productoAEliminar.imagenes.length > 0 ? (
                  <img 
                    src={productoAEliminar.imagenes[0].url} 
                    alt={productoAEliminar.nombreP} 
                    className="rp-preview-imagen"
                  />
                ) : (
                  <div className="rp-sin-imagen">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="rp-producto-info">
                <h4>{productoAEliminar.nombreP}</h4>
                <span className={`rp-tipo-badge ${productoAEliminar.tipo}`}>
                  {obtenerEtiquetaTipo(productoAEliminar.tipo)}
                </span>
                <p className="rp-precio">{formatearPrecio(productoAEliminar.precio)}</p>
                <p className="rp-cantidad">Cantidad: <strong>{productoAEliminar.cantidad || 0}</strong></p>
                <p className="rp-advertencia">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="rp-modal-footer">
              <button 
                type="button" 
                className="rp-btn rp-btn-secondary"
                onClick={cancelarEliminacion}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="rp-btn rp-btn-danger"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agregar el componente de notificación */}
      {mostrarNotificacion && (
        <div className="rp-notificacion">
          <div className="rp-notificacion-contenido">
            <img 
              src={logo} 
              alt="Logo" 
              className="rp-notificacion-logo"
            />
            {mostrarCarga ? (
              <div className="rp-cargando">
                <div className="rp-rueda-carga"></div>
                <p>{mensajeNotificacion}</p>
              </div>
            ) : (
              <p className={mensajeNotificacion.includes('Error') ? 'rp-error' : 'rp-exito'}>
                {mensajeNotificacion}
              </p>
            )}
          </div>
        </div>
      )}
      
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
                  <label htmlFor="nombreP">Nombre del Producto</label>
                  <input
                    type="text"
                    id="nombreP"
                    name="nombreP"
                    value={formData.nombreP}
                    onChange={handleInputChange}
                    className={`rp-input ${errores.nombreP ? 'rp-error' : ''}`}
                    placeholder="Ej: Manzana"
                  />
                  {errores.nombreP && <p className="rp-error-message">{errores.nombreP}</p>}
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
                      onClick={() => {
                        setEditandoId(null);
                        setErrores({});
                      }}
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
          </div>
          
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
                <p>No has registrado ningún producto aún.</p>
                {(terminoBusqueda || filtroTipo !== 'todos') && (
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
                )}
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
                          alt={producto.nombreP} 
                        />
                      ) : (
                        <div className="rp-sin-imagen">
                          <span>Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="rp-producto-info">
                      <h3>{producto.nombreP}</h3>
                      <span className={`rp-tipo-badge ${producto.tipo}`}>
                        {obtenerEtiquetaTipo(producto.tipo)}
                      </span>
                      <div className="rp-precio">{formatearPrecio(producto.precio)}</div>
                      
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
                        onClick={(e) => {
                          e.stopPropagation();
                          editarProducto(producto.id);
                        }}
                      >
                        Actualizar
                      </button>
                      <button
                        type="button"
                        className="rp-btn rp-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarProducto(parseInt(producto.id));
                        }}
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
      
      <footer className="rp-footer">
        <div className="rp-container">
          <p>© {new Date().getFullYear()} - Sistema de Registro de Productos</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistroProductos;