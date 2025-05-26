/**
 * @file Logout.jsx
 * @description Componente para manejar el cierre de sesión del usuario.
 * Este componente se encarga de eliminar el token de autenticación almacenado
 * en el `localStorage` y luego redirigir al usuario a la página de inicio de sesión.
 * No tiene una interfaz de usuario visible, su función es puramente lógica.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  // `useNavigate` es un hook de React Router para la navegación programática.
  const navigate = useNavigate();

  // `useEffect` se ejecuta después de que el componente se renderiza.
  // Aquí se utiliza para realizar la lógica de cierre de sesión una vez.
  useEffect(() => {
    // Elimina el token de autenticación del `localStorage`.
    // Esto invalida la sesión del usuario en el cliente.
    localStorage.removeItem("authToken");
    
    // Redirige al usuario a la página de inicio de sesión.
    navigate("/login");
  }, [navigate]);
}