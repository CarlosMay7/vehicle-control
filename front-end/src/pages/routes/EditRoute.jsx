/**
 * @file EditRoute.jsx
 * @description Componente para crear o modificar la información de una Ruta de viaje.
 * Provee un formulario que permite al usuario seleccionar una asignación, definir
 * coordenadas de inicio y destino, fecha de la ruta, si fue exitosa, y añadir
 * descripciones de problemas o comentarios. Maneja la lógica de carga de datos
 * para edición y el envío de información a la API.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast"; // Importa el componente para notificaciones al usuario.

const baseRoute = import.meta.env.VITE_API_URL; // URL base de la API.

export const EditRoute = () => {
  const navigate = useNavigate(); // Hook para redirigir programáticamente.
  const { id } = useParams(); // Extrae el ID de la ruta de la URL para saber si es edición.
  const isEdit = !!id; // Bandera booleana para el modo edición.

  // Estado que contiene los datos del formulario de la ruta.
  const [formData, setFormData] = useState({
    assignmentId: "",
    name: "",
    startLatitude: "",
    startLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
    routeDate: "",
    successful: true, // Por defecto, una ruta es exitosa.
    issueDescription: "",
    comments: "",
  });

  const [assignments, setAssignments] = useState([]); // Almacena la lista de asignaciones disponibles.
  const [saving, setSaving] = useState(false); // Controla el estado de guardado del formulario.
  const [toast, setToast] = useState(null); // Gestiona la visualización de mensajes de tostada.

  /**
   * @function showToast
   * @description Activa un mensaje de tostada visible temporalmente para el usuario.
   * @param {string} message - Contenido del mensaje.
   * @param {string} [type="success"] - Tipo de tostada (ej. "success", "error").
   */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * @function useEffect
   * @description Hook para cargar las asignaciones disponibles y, si es modo edición,
   * los datos de la ruta específica.
   */
  useEffect(() => {
    /**
     * @async
     * @function fetchAssignments
     * @description Obtiene la lista de asignaciones desde la API para el selector.
     */
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/assignments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setAssignments(data); // Actualiza el estado con las asignaciones.
      } catch (err) {
        showToast("Error fetching assignments", "error"); // Notifica si falla.
        console.error(err);
      }
    };

    /**
     * @async
     * @function fetchRoute
     * @description Obtiene los datos de una ruta específica si se está editando.
     */
    const fetchRoute = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/routes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch route data"); // Manejo de error en la petición.
        const data = await res.json();
        // Llena el formulario con los datos de la ruta recuperada, formateando fechas y manejando valores nulos.
        setFormData({
          assignmentId: data.assignmentId,
          name: data.name,
          startLatitude: data.startLatitude,
          startLongitude: data.startLongitude,
          destinationLatitude: data.destinationLatitude,
          destinationLongitude: data.destinationLongitude,
          routeDate: data.routeDate.split("T")[0],
          successful: data.successful,
          issueDescription: data.issueDescription || "",
          comments: data.comments || "",
        });
      } catch (err) {
        showToast("Error loading route", "error"); // Notifica si falla.
        console.error(err);
      }
    };

    fetchAssignments(); // Siempre carga las asignaciones.
    if (isEdit) fetchRoute(); // Carga la ruta solo si es modo edición.
  }, [id, isEdit]); // Dependencias para re-ejecutar el efecto.

  /**
   * @function handleChange
   * @description Actualiza el estado `formData` cuando un campo del formulario cambia.
   * Maneja inputs de texto, números y checkboxes.
   * @param {object} e - El evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Manejo específico para checkboxes.
    }));
  };

  /**
   * @async
   * @function handleSubmit
   * @description Maneja el envío del formulario, realizando una petición POST o PATCH a la API.
   * Prepara el payload convirtiendo coordenadas a números y envía los datos para crear
   * o actualizar una ruta.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página.
    setSaving(true); // Activa el indicador de guardado.

    // Convierte las coordenadas a números flotantes antes de enviarlas.
    const payload = {
      ...formData,
      startLatitude: parseFloat(formData.startLatitude),
      startLongitude: parseFloat(formData.startLongitude),
      destinationLatitude: parseFloat(formData.destinationLatitude),
      destinationLongitude: parseFloat(formData.destinationLongitude),
    };

    // Determina el método HTTP (POST para crear, PATCH para actualizar) y la URL.
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${baseRoute}/api/routes/${id}`
      : `${baseRoute}/api/routes`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload), // Envía los datos del formulario como JSON.
      });

      if (!res.ok) throw new Error("Error saving route"); // Manejo de error en la respuesta de la API.

      showToast(isEdit ? "Route updated" : "Route created"); // Notifica el éxito.
      setTimeout(() => navigate("/route"), 1000); // Redirige después de un breve retardo.
    } catch (err) {
      showToast(err.message, "error"); // Muestra el mensaje de error.
    } finally {
      setSaving(false); // Desactiva el indicador de guardado.
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        {isEdit ? "Edit Route" : "Create Route"} {/* Título dinámico */}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 capitalize">Assignment</label>
          <select
            name="assignmentId"
            value={formData.assignmentId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-purple-950 text-white"
          >
            <option value="">Select an assignment</option>
            {/* Mapea las asignaciones disponibles para el selector. */}
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {`${a.id} - ${a.driver?.fullName} / ${a.vehicle?.licensePlate}`}
              </option>
            ))}
          </select>
        </div>

        {/* Campos de entrada de texto y número renderizados dinámicamente. */}
        {[
          { name: "name", label: "Name", type: "text" },
          { name: "startLatitude", label: "Start Latitude", type: "number" },
          { name: "startLongitude", label: "Start Longitude", type: "number" },
          { name: "destinationLatitude", label: "Destination Latitude", type: "number" },
          { name: "destinationLongitude", label: "Destination Longitude", type: "number" },
          { name: "routeDate", label: "Route Date", type: "date" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 capitalize">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-purple-950 text-white"
            />
          </div>
        ))}

        {/* Checkbox para indicar si la ruta fue exitosa. */}
        <div className="flex items-center space-x-2">
          <input
            id="successful"
            name="successful"
            type="checkbox"
            checked={formData.successful}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="successful" className="capitalize">
            Successful
          </label>
        </div>

        {/* Campos de área de texto para descripción de problemas y comentarios. */}
        <div>
          <label className="block mb-1 capitalize">Issue Description</label>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-purple-950 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 capitalize">Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-purple-950 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving} // Deshabilita el botón durante el guardado.
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"} {/* Texto dinámico del botón */}
        </button>
      </form>
    </div>
  );
};