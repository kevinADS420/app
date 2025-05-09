import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './EditProfile.css';

interface UserData {
  id_cliente?: number;
  id_proveedor?: number;
  id_admin?: number;
  Nombres: string;
  nombres?: string;
  Apellidos: string;
  apellidos?: string;
  Email: string;
  Telefono?: string;
  telefono?: string;
  contraseña?: string;
  role?: 'customer' | 'proveedor' | 'admin';
}

const EditProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    Nombres: '',
    Apellidos: '',
    Email: '',
    Telefono: '',
    contraseña: ''
  });
  
  // Nuevo estado para las contraseñas
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para mostrar/ocultar contraseñas
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Estado para errores de contraseña
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para sección de contraseña
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del usuario y mantener respaldo del token
  useEffect(() => {
    loadUserData();
    
    const token = localStorage.getItem('token');
    if (token) {
      // Crear un respaldo del token en sessionStorage
      sessionStorage.setItem('tokenBackup', token);
    }
    
    // Función para prevenir cierre de sesión accidental
    const preventLogout = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!customEvent.detail || !customEvent.detail.preserveSession) {
        // Si no es nuestro evento personalizado con la bandera, restaurar token
        const token = sessionStorage.getItem('tokenBackup');
        if (token && !localStorage.getItem('token')) {
          localStorage.setItem('token', token);
          console.log("Token restaurado tras evento potencial de cierre de sesión");
        }
      }
    };
    
    // Escuchar eventos que podrían cerrar la sesión
    window.addEventListener('userUpdate', preventLogout);
    window.addEventListener('storage', preventLogout);
    
    return () => {
      window.removeEventListener('userUpdate', preventLogout);
      window.removeEventListener('storage', preventLogout);
    };
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // Normalizar los nombres de campos según el tipo de usuario
      const normalizedUser = {
        ...user,
        Nombres: user.Nombres || user.nombres || '',
        Apellidos: user.Apellidos || user.apellidos || '',
        Telefono: user.Telefono || user.telefono || '',
        role: userType || 'customer'
      };
      
      setUserData(normalizedUser);
      setFormData({
        Nombres: normalizedUser.Nombres,
        Apellidos: normalizedUser.Apellidos,
        Email: normalizedUser.Email,
        Telefono: normalizedUser.Telefono,
        contraseña: normalizedUser.contraseña || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Guardar el formulario en localStorage para persistencia
    // especialmente útil para el número de teléfono
    localStorage.setItem('editProfileForm', JSON.stringify(newFormData));
  };
  
  // Manejador para cambios en campos de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario comienza a escribir
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Función para alternar visibilidad de contraseñas
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Validar las contraseñas
  const validatePasswords = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    let isValid = true;
    
    // Si tenemos la contraseña almacenada, no requerimos que el usuario ingrese la contraseña actual
    if (!passwordData.currentPassword && !formData.contraseña) {
      errors.currentPassword = 'La contraseña actual es requerida';
      isValid = false;
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu nueva contraseña';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }
    
    setPasswordErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      setIsLoading(true);
      const originalToken = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'https://backendhuertomkt.onrender.com';
      const userType = localStorage.getItem('userType');
      
      // Determinar la ruta y el ID según el tipo de usuario
      let updateEndpoint = '';
      let userId = '';
      
      switch(userType) {
        case 'proveedor':
          updateEndpoint = '/Update/proveedor';
          userId = userData.id_proveedor?.toString() || '';
          break;
        case 'admin':
          updateEndpoint = '/Update/admin';
          userId = userData.id_admin?.toString() || '';
          break;
        default: // cliente
          updateEndpoint = '/Update/customer';
          userId = userData.id_cliente?.toString() || '';
      }
      
      // Adaptar los datos según el tipo de usuario
      const profileData = {
        ...formData,
        // Para proveedores y admin
        nombres: formData.Nombres,
        apellidos: formData.Apellidos,
        telefono: formData.Telefono,
        // Para clientes
        Nombres: formData.Nombres,
        Apellidos: formData.Apellidos,
        Telefono: formData.Telefono,
        numeroTelefono: formData.Telefono,
        tipoTelefono: 'movil'
      };
      
      console.log("Datos de perfil a enviar:", profileData);

      const profileResponse = await fetch(`${baseUrl}${updateEndpoint}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${originalToken}`
        },
        body: JSON.stringify(profileData)
      });

      if (!profileResponse.ok) {
        console.error("Error en respuesta del perfil:", await profileResponse.text());
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await profileResponse.json();
      console.log("Respuesta del servidor (perfil):", updatedUser);
      
      // Normalizar los datos actualizados según el tipo de usuario
      const normalizedUser = {
        ...updatedUser,
        Nombres: updatedUser.Nombres || updatedUser.nombres,
        Apellidos: updatedUser.Apellidos || updatedUser.apellidos,
        Telefono: updatedUser.Telefono || updatedUser.telefono || formData.Telefono,
        role: userType
      };
      
      // Mantener el token original
      if (originalToken) {
        localStorage.setItem('token', originalToken);
      }
      
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      // Si la sección de contraseña está abierta, intentar actualizar la contraseña
      if (isPasswordSectionOpen) {
        // Determinar la ruta de actualización de contraseña según el tipo de usuario
        let passwordEndpoint = '';
        
        switch(userType) {
          case 'proveedor':
            passwordEndpoint = '/update/password/proveedor';
            break;
          case 'admin':
            passwordEndpoint = '/update/password/admin';
            break;
          default: // cliente
            passwordEndpoint = '/update/password';
        }
        
        // Log para datos de contraseña
        console.log("Datos de contraseña:", {
          currentPass: passwordData.currentPassword || formData.contraseña,
          newPass: passwordData.newPassword,
          telefono: formData.Telefono || ''
        });
        
        // Validar contraseñas
        if (!validatePasswords()) {
          console.log("Errores de validación:", passwordErrors);
          setIsLoading(false);
          return;
        }
        
        // Objeto de datos para enviar
        const passwordUpdateData = {
          contraseña: passwordData.currentPassword || formData.contraseña,
          nuevaContraseña: passwordData.newPassword,
          numeroTelefono: formData.Telefono || '',
          tipoTelefono: 'movil'
        };
        
        console.log("Datos a enviar para actualizar contraseña:", passwordUpdateData);
        
        // Enviar solicitud para cambiar contraseña
        const passwordResponse = await fetch(`${baseUrl}${passwordEndpoint}/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${originalToken}`
          },
          body: JSON.stringify(passwordUpdateData)
        });
        
        // Log para respuesta de la API
        console.log("Status de respuesta:", passwordResponse.status);
        
        if (!passwordResponse.ok) {
          // Si hay un error específico con la contraseña
          const responseText = await passwordResponse.text();
          console.error("Error en respuesta de contraseña:", responseText);
          
          try {
            const passwordError = JSON.parse(responseText);
            if (passwordError.message) {
              setPasswordErrors(prev => ({
                ...prev,
                currentPassword: passwordError.message
              }));
              throw new Error(passwordError.message);
            }
          } catch (parseError) {
            console.error("Error al parsear respuesta:", parseError);
          }
          
          throw new Error('Error al actualizar la contraseña');
        }
        
        console.log("Contraseña actualizada con éxito");
        
        // Si la contraseña fue actualizada exitosamente, actualizar en el usuario guardado
        if (passwordData.newPassword) {
          // Actualizar la contraseña en el estado del formulario
          setFormData(prev => ({
            ...prev,
            contraseña: passwordData.newPassword
          }));
          
          // Actualizar también en el usuario guardado
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.contraseña = passwordData.newPassword;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          // Verificar que el token sigue presente
          if (originalToken) {
            localStorage.setItem('token', originalToken);
          }
        }
        
        // Limpiar el formulario de contraseñas tras éxito
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Cerrar sección de contraseña
        setIsPasswordSectionOpen(false);
      }
      
      // Verificar que el token sigue presente antes de disparar evento
      if (!localStorage.getItem('token') && originalToken) {
        console.log("Restaurando token que fue eliminado");
        localStorage.setItem('token', originalToken);
      }
      
      // Crear un evento personalizado en lugar de usar uno estándar
      const updateEvent = new CustomEvent('userUpdate', { 
        detail: { preserveSession: true }
      });
      
      // Disparar evento de actualización con la bandera de preservar sesión
      window.dispatchEvent(updateEvent);
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error completo:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } finally {
      // Verificar que el token sigue presente al finalizar
      if (!localStorage.getItem('token')) {
        console.warn("Token perdido al finalizar proceso. Intentando restaurar desde sessionStorage.");
        const backupToken = sessionStorage.getItem('tokenBackup');
        if (backupToken) {
          localStorage.setItem('token', backupToken);
          console.log("Token restaurado con éxito.");
        }
      }
      
      setIsLoading(false);
    }
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="Nombres">Nombres</label>
            <input
              type="text"
              id="Nombres"
              name="Nombres"
              value={formData.Nombres}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tus nombres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Apellidos">Apellidos</label>
            <input
              type="text"
              id="Apellidos"
              name="Apellidos"
              value={formData.Apellidos}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tus apellidos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Correo Electrónico</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          {/* Campo oculto para la contraseña actual */}
          <input
            type="hidden"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
          />

          <div className="form-group">
            <label htmlFor="Telefono">Teléfono</label>
            <input
              type="tel"
              id="Telefono"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleInputChange}
              placeholder="Ingresa tu número de teléfono"
            />
          </div>

          {/* Sección para actualizar contraseña */}
          <div className="password-section">
            <button 
              type="button" 
              className="toggle-password-section"
              onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
            >
              {isPasswordSectionOpen ? '- Ocultar cambio de contraseña' : '+ Actualizar contraseña'}
            </button>
            
            {isPasswordSectionOpen && (
              <div className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <span className="error-message">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <span className="error-message">{passwordErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <span className="error-message">{passwordErrors.confirmPassword}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;