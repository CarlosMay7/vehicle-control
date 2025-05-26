/**
 * @file RouteIndex.jsx
 * @description Vista de listado para la gestión de Rutas de viaje.
 * Este componente se encarga de obtener y presentar una tabla con la información
 * de todas las rutas de viaje registradas en el sistema. Utiliza el componente
 * `GenericIndex` para la renderización de la tabla y la gestión de acciones básicas
 * (editar, eliminar), así como notificaciones de usuario.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex"; // Componente genérico para visualización de índices de recursos.
import { Toast } from "../../components/Toast"; // Componente para mensajes emergentes.

const baseRoute = import.meta.env.VITE_API_URL; // URL base de la API para las solicitudes.

export const RouteIndex = () => {
  const [data, setData] = useState({}); // Almacena los encabezados y filas de la tabla de rutas.
  const [loading, setLoading] = useState(true); // Controla el estado de carga de los datos.
  const [toast, setToast] = useState(null); // Gestiona la visualización de mensajes de tostada.

  /**
   * @function showToast
   * @description Activa un mensaje de tostada visible temporalmente para el usuario.
   * @param {string} message - Contenido del mensaje.
   * @param {string} [type="error"] - Tipo de tostada (ej. "success", "error").
   */
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * @async
   * @function getRoutes
   * @description Realiza una llamada a la API para obtener la lista de rutas de viaje.
   * Procesa los datos recibidos para adaptarlos al formato requerido por `GenericIndex`.
   * @returns {Promise<Array<Array<any>>>} Un array de arrays, donde cada sub-array es una fila de datos de la ruta.
   */
  async function getRoutes() {
    try {
      const res = await fetch(`${baseRoute}/api/routes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Envía el token de autenticación.
        },
      });
      if (!res.ok) throw new Error("Failed to fetch routes"); // Manejo de errores de la API.
      const data = await res.json();

      // Mapea los datos crudos de la API a un formato de fila adecuado para `GenericIndex`.
      const rows = data.map((r) => [
        r.id, // ID de la ruta (oculto en la tabla, usado para acciones).
        r.name,
        r.routeDate.split("T")[0], // Formatea la fecha de la ruta.
        r.successful ? "Yes" : "No", // Muestra "Sí" o "No" para el estado de éxito.
      ]);

      return rows;
    } catch (err) {
      showToast(err.message); // Muestra error si la petición falla.
      return []; // Retorna un array vacío para evitar errores en la renderización.
    }
  }

  /**
   * @function useEffect
   * @description Hook que se ejecuta al montar el componente para cargar los datos iniciales.
   * Controla el ciclo de vida de la petición de datos y la actualización del estado de carga.
   */
  useEffect(() => {
    const load = async () => {
      setLoading(true); // Inicia el indicador de carga.
      const values = await getRoutes(); // Obtiene los datos de las rutas.
      setData({
        headers: ["Name", "Date", "Successful"], // Define los encabezados de la tabla.
        values, // Asigna los datos obtenidos.
      });
      setLoading(false); // Detiene el indicador de carga.
    };
    load(); // Ejecuta la función de carga.
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar.

  return (
    <>
      {/* Renderiza el componente Toast si hay un mensaje activo. */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Muestra un mensaje de carga o el índice de rutas. */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <GenericIndex resource="Route" data={data} /> // Renderiza la tabla genérica con los datos de rutas.
      )}
    </>
  );
};