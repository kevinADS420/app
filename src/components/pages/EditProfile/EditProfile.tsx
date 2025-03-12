import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './EditProfile.css';

interface UserData {
  id_cliente: number;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono?: string;
}

const EditProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    Nombres: '',
    Apellidos: '',
    Email: '',
    Telefono: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData(user);
      setFormData({
        Nombres: user.Nombres || '',
        Apellidos: user.Apellidos || '',
        Email: user.Email || '',
        Telefono: user.Telefono || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:10101';
      console.log('URL de la petición:', `${baseUrl}/Update/customer/${userData.id_cliente}`);
      
      const response = await fetch(`${baseUrl}/Update/customer/${userData.id_cliente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_cliente: userData.id_cliente
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Disparar evento de actualización
      window.dispatchEvent(new Event('userUpdate'));
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
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