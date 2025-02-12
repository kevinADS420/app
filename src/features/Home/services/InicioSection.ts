// Obtener el elemento del formulario
const formElement = document.getElementById("SaveUsers") as HTMLFormElement | null;

// Agregar el listener para el evento de submit
formElement?.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const Name = (document.getElementById('Name') as HTMLInputElement).value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
    const Email = (document.getElementById('Email') as HTMLInputElement).value;
    const Password = (document.getElementById('Password') as HTMLInputElement).value;
    const WithsignatureyourPassword = (document.getElementById('WithsignatureyourPassword') as HTMLInputElement).value;

    // Crear el objeto con los datos del usuario
    const users = {
        Name: Name,
        lastName: lastName,
        Email: Email,
        Password: Password,
        WithsignatureyourPassword: WithsignatureyourPassword
    };

    // Convertir el objeto a JSON
    const usersJson = JSON.stringify(users);
    console.log(usersJson);
});