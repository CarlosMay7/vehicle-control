/**
 * @file AssignmentIndex.jsx
 * @description Componente de la página de índice para la gestión de Asignaciones.
 * Este componente es responsable de obtener y mostrar una lista de todas las asignaciones
 * existentes. Utiliza el componente `GenericIndex` para renderizar la tabla de datos
 * y manejar la visualización de mensajes de tostada (`Toast`) para feedback al usuario.
 * Realiza una llamada a la API para obtener los datos de las asignaciones.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex"; // Componente reutilizable para tablas de índice.
import { Toast } from "../../components/Toast"; // Componente para mostrar notificaciones.

// Obtiene la URL base de la API desde las variables de entorno.
const baseRoute = import.meta.env.VITE_API_URL;

export const AssignmentIndex = () => {
  // Estado para almacenar los datos de las asignaciones (encabezados y valores).
  const [data, setData] = useState({});
  // Estado para controlar el estado de carga de los datos.
  const [loading, setLoading] = useState(true);
  // Estado para manejar los mensajes de tostada (notificaciones).
  const [toast, setToast] = useState(null);

  /**
   * @function showToast
   * @description Muestra un mensaje de tostada con un tipo específico (éxito o error).
   * El mensaje se oculta automáticamente después de 3 segundos.
   * @param {string} message - El mensaje a mostrar.
   * @param {string} [type="error"] - El tipo de mensaje ('success' o 'error').
   */
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * @async
   * @function getAssignments
   * @description Función asíncrona para obtener la lista de asignaciones desde la API.
   * Realiza una solicitud GET a la API y mapea los datos recibidos a un formato
   * compatible con el componente `GenericIndex`.
   * @returns {Promise<Array<Array<any>>>} Una promesa que resuelve con un array de arrays,
   * donde cada sub-array representa una fila de la tabla de asignaciones.
   */
  async function getAssignments() {
    try {
      const response = await fetch(`${baseRoute}/api/assignments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Se incluye el token de autorización para acceder a la API protegida.
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Si la respuesta no es exitosa, se lanza un error.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assignments");
      }

      const data = await response.json();
      // Mapea los datos de la API al formato requerido por `GenericIndex`:
      // [id, driverFullName, vehicleBrandModel]
      const mappedAssignmentValues = data.map((value) => [
        value.id, // ID para las acciones de edición/eliminación
        value.driver.fullName, // Nombre completo del conductor asociado
        `${value.vehicle.brand} ${value.vehicle.model}`, // Marca y modelo del vehículo asociado
      ]);

      return mappedAssignmentValues;
    } catch (error) {
      // Muestra un mensaje de error si la carga de datos falla.
      showToast(error.message || "Error loading assignments", "error");
      console.error(error);
      return []; // Retorna un array vacío en caso de error.
    }
  }

  // `useEffect` se usa para cargar los datos de las asignaciones cuando el componente se monta.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Indica que la carga ha comenzado.
      const assignmentValues = await getAssignments(); // Llama a la función para obtener las asignaciones.
      setData({
        headers: ["Driver", "Vehicle"], // Define los encabezados de la tabla.
        values: assignmentValues, // Asigna los valores mapeados.
      });
      setLoading(false); // Indica que la carga ha finalizado.
    };

    fetchData(); // Ejecuta la función de carga de datos.
  }, []); // El array vacío de dependencias asegura que este efecto se ejecute solo una vez al montar.

  return (
    <>
      {/* Muestra el componente Toast si hay un mensaje para mostrar */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)} // Cierra la tostada al hacer clic
        />
      )}

      {/* Muestra un indicador de carga mientras los datos están siendo fetched */}
      {loading ? (
        <p className="text-center mt-6 text-white">Loading...</p>
      ) : (
        // Renderiza el componente GenericIndex con los datos de las asignaciones
        <GenericIndex resource="Assignment" data={data} />
      )}
    </>
  );
};