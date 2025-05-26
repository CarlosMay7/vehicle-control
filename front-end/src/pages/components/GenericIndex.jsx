/**
 * @file GenericIndex.jsx
 * @description Componente reutilizable para mostrar una tabla de índices genérica.
 * Este componente está diseñado para ser usado en diferentes módulos (asignaciones,
 * vehículos, conductores, rutas) para listar elementos, permitiendo acciones de
 * creación, edición y eliminación. Recibe los encabezados y los datos de las filas
 * como propiedades y maneja la interacción con la API para la eliminación de ítems.
 * @author Equipo 3
 * @version 1.0.0
 * @param {object} props - Propiedades pasadas al componente.
 * @param {string} props.resource - El nombre del recurso (ej. "Assignment", "Vehicle"). Se usa para generar rutas y mensajes.
 * @param {object} props.data - Un objeto que contiene `headers` (array de strings) y `values` (array de arrays) para la tabla.
 */
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react"; // Iconos para acciones de editar y eliminar.
import { useState } from "react";
import { Toast } from "../../components/Toast"; // Componente para mostrar notificaciones.

export const GenericIndex = ({ resource, data = {} }) => {
  const navigate = useNavigate(); // Hook para la navegación programática.
  const baseRoute = import.meta.env.VITE_API_URL; // URL base de la API.
  const [toast, setToast] = useState(null); // Estado para manejar los mensajes de tostada.

  /**
   * @function showToast
   * @description Muestra un mensaje de tostada con un tipo específico (éxito o error).
   * El mensaje se oculta automáticamente después de 3 segundos.
   * @param {string} message - El mensaje a mostrar.
   * @param {string} [type="success"] - El tipo de mensaje ('success' o 'error').
   */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * @async
   * @function handleDelete
   * @description Manejador para la acción de eliminación de un ítem.
   * Envía una solicitud DELETE a la API para el recurso y el ID especificados.
   * Muestra notificaciones de éxito o error.
   * @param {string} id - El ID del ítem a eliminar.
   */
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseRoute}/api/${resource.toLowerCase()}s/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          // Se incluye el token de autorización para acceder a la API protegida.
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      // Si la respuesta no es exitosa, se lanza un error.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting item');
      }

      showToast(`${resource} deleted`);
    } catch (error) {
      showToast(error.message || "Failed to delete", "error");
      console.error(error);
    }
  };

  return (
    // Contenedor principal con padding.
    <div className="p-4 sm:p-6 md:p-8">
      {/* Muestra el componente Toast si hay un mensaje para mostrar */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Título de la sección, capitalizando el nombre del recurso (ej. "Assignment" -> "Assignment") */}
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 capitalize">
        {resource}
      </h1>
      <div>
        {/* Botón para navegar a la página de creación de un nuevo recurso */}
        <button
          onClick={() => navigate(`/${resource.toLowerCase()}/new`)}
          className="mb-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Create {resource}
        </button>
        {/* Contenedor para la tabla con scroll horizontal si es necesario */}
        <div className="overflow-x-auto">
          {/* Tabla para mostrar los datos del recurso */}
          <table className="min-w-full table-auto bg-white text-black rounded-xl">
            {/* Encabezado de la tabla */}
            <thead className="bg-purple-700 text-white">
              <tr>
                {/* Mapea los encabezados de los datos a las columnas de la tabla */}
                {data.headers?.map((header, index) => (
                  <th key={index} className="p-3 text-left capitalize whitespace-nowrap">
                    {header}
                  </th>
                ))}
                {/* Columna para las acciones (editar/eliminar) */}
                <th className="p-3 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody>
              {/* Mapea los valores de los datos a las filas de la tabla */}
              {data.values?.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {/* Mapea las celdas de cada fila (excluyendo el ID que está en `row[0]`) */}
                  {row.slice(1).map((cell, colIndex) => (
                    <td key={colIndex} className="p-3 align-middle whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                  {/* Celdas para los botones de acciones */}
                  <td className="p-3 align-middle flex justify-center space-x-2">
                    {/* Botón de Editar: navega a la página de edición del recurso con su ID */}
                    <button
                      onClick={() => navigate(`/${resource.toLowerCase()}/${row[0]}/edit`)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transform transition-transform duration-200 hover:scale-110"
                    >
                      <Pencil size={16} />
                    </button>
                    {/* Botón de Eliminar: llama a la función handleDelete con el ID del recurso */}
                    <button
                      onClick={() => handleDelete(row[0])}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transform transition-transform duration-200 hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};