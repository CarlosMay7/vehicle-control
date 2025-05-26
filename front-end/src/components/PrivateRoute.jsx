/**
 * @file PrivateRoute.jsx
 * @description Componente de enrutamiento que protege rutas en la aplicación,
 * asegurando que solo usuarios autenticados puedan acceder a ellas.
 * Actúa como un guardián de ruta, redirigiendo a la página de login si el usuario no está autenticado.
 * @author Equipo 3
 * @version 1.0.0
 */
import { Navigate, Outlet } from "react-router-dom"; // `Maps` para redirigir, `Outlet` para renderizar rutas anidadas.

/**
 * @function isAuthenticated
 * @description Verifica el estado de autenticación del usuario.
 * @returns {boolean} `true` si el token de autenticación está presente, `false` en caso contrario.
 */
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null; // Comprueba la existencia del token en el almacenamiento local.
};

export const PrivateRoute = () => {
  // Renderiza el contenido de la ruta anidada (`Outlet`) si el usuario está autenticado.
  // De lo contrario, redirige programáticamente al usuario a la página de login.
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}