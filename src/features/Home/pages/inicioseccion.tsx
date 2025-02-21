import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../style/Registro.css'


function registro() {

const [formData, setFormData] = useState({
    Email: '',
    Password: '',
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
        <div className="ContenedorRgistro">

            <div className="inicio">
                <form id="SaveUsers" onSubmit={handleSubmit}>
                    <div className='Inputs'>
                        
                        <label htmlFor="Password">Correo</label>
                        <input type="email" id="Email" value={formData.Email} onChange={handleChange} />
                        <label htmlFor="Password">Contraseña</label>
                        <input type="password" id="Password" value={formData.Password} onChange={handleChange} />

                    </div>

                    <div className='Butons'>
                        
                        <div className="ButtonsInicio">
                            <button className='registrate' type="submit">Iniciar</button>
                        </div>
                        <Link to="/Registro" className="buttonInicioSection"><button className="buttonInicioSection">Registrarte</button></Link>
                        <button> Recuperar contraseña </button>

                    </div>

                </form>
            </div>

        </div>

    </>

  )
}

export default registro
