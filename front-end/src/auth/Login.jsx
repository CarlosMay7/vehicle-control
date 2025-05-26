/**
 * @file Login.jsx
 * @description Componente para el formulario de inicio de sesión de usuarios.
 * Permite a los usuarios ingresar sus credenciales (correo electrónico y contraseña)
 * para autenticarse en el sistema. Al iniciar sesión exitosamente, guarda el token
 * de autenticación en el almacenamiento local (`localStorage`) y redirige al usuario
 * al panel de control (`/dashboard`).
 * @author Equipo 3
 * @version 1.0.0
 * @param {object} props - Propiedades pasadas al componente.
 * @param {function} props.onLogin - Función que se llama con los datos del usuario
 * cuando el inicio de sesión es exitoso.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // `useNavigate` es un hook de React Router para la navegación programática.
  const navigate = useNavigate();

  /**
   * @function handleSubmit
   * @description Manejador del evento de envío del formulario de inicio de sesión.
   * Realiza una solicitud POST a la API de autenticación, envía las credenciales
   * del usuario, guarda el token de autenticación y redirige.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).

    // Obtiene la URL base de la API desde las variables de entorno.
    const baseRoute = import.meta.env.VITE_API_URL;

    try {
      // Realiza la solicitud POST al endpoint de login de la API.
      const res = await fetch(`${baseRoute}/api/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json", // Indica que el cuerpo de la solicitud es JSON.
        },
        body: JSON.stringify({ email, password }), // Envía las credenciales como JSON.
      });

      // Si la respuesta no es exitosa (ej. 401 Unauthorized, 500 Internal Server Error), lanza un error.
      if (!res.ok) throw new Error("Login failed");

      // Parsea la respuesta JSON para obtener los datos, incluyendo el token.
      const data = await res.json();
      const token = data.token;

      // Almacena el token de autenticación en el almacenamiento local del navegador.
      localStorage.setItem('authToken', token);

      // Llama a la función `onLogin` pasada por props para actualizar el estado del usuario en `App.jsx`.
      onLogin({ email });

      // Redirige al usuario al panel de control.
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Credenciales incorrectas o error de red."); // Muestra un mensaje de alerta al usuario.
    }
  };

  return (
    // Estructura JSX del formulario de inicio de sesión.
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white text-black p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          Entrar
        </button>

        <p className="text-sm mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};