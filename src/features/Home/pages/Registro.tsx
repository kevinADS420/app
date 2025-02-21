import React, { useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import Google from '../../../assets/icons/icons8-google-48.png';
import '../../../style/inicioSection.css';

function App() {
  const [formData, setFormData] = useState({
    Name: '',
    lastName: '',
    Email: '',
    Password: '',
    WithsignatureyourPassword: '',
  });

  // Manejar cambios en los inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Manejar el submit del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(JSON.stringify(formData)); // Imprime los datos en consola como JSON
  };

  return (
    <>
      <div className="ContainerContent">
        <div className="InicioGoogle">
          <button>
            inscribete con tu cuenta de Google <img src={Google} alt="Google" width={15} />
          </button>
        </div>

        <div className="InicioFormulario">
          <img src={Logo} alt="Logo" />
          <form id="SaveUsers" onSubmit={handleSubmit}>
            <label htmlFor="Name">Nombres</label>
            <input type="text" id="Name" value={formData.Name} onChange={handleChange} />
            <label htmlFor="lastName">Apellidos</label>
            <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
            <label htmlFor="Email">Email</label>
            <input type="email" id="Email" value={formData.Email} onChange={handleChange} />
            <label htmlFor="Password">Contraseña</label>
            <input type="password" id="Password" value={formData.Password} onChange={handleChange} />
            <label htmlFor="WithsignatureyourPassword">Con firma tu Contraseña</label>
            <input
              type="password"
              id="WithsignatureyourPassword"
              value={formData.WithsignatureyourPassword}
              onChange={handleChange}
            />

            <div className="ButtonsInicio">
              <button type="submit">Registrarte</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;