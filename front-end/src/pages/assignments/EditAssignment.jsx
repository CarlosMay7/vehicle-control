/**
 * @file EditAssignment.jsx
 * @description Componente para crear o editar una asignación (Assignment).
 * Este formulario permite al usuario seleccionar un conductor y un vehículo para
 * crear una nueva asignación, o modificar una existente. La lógica maneja la
 * recuperación de datos para edición, la validación y el envío a la API.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast"; // Componente para mostrar notificaciones.

// Obtiene la URL base de la API desde las variables de entorno.
const baseRoute = import.meta.env.VITE_API_URL;

export const EditAssignment = () => {
  const navigate = useNavigate(); // Hook para la navegación programática.
  const { id } = useParams(); // Obtiene el parámetro `id` de la URL para identificar si es edición.
  const isEdit = !!id; // Booleano para saber si estamos en modo edición (si `id` existe).

  // Estados para almacenar las listas de conductores y vehículos, y los datos del formulario.
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ driverId: "", vehicleId: "" });
  // Estados para controlar el estado de carga y guardado, y mensajes de tostada.
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

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

  // `useEffect` para cargar los datos iniciales (conductores y vehículos)
  // y, si es modo edición, los datos de la asignación específica.
    useEffect(() => {

    /**
     * @async
     * @function fetchOptions
     * @description Carga las listas de conductores y vehículos desde la API
     * para rellenar los selectores del formulario.
     */
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [driversRes, vehiclesRes] = await Promise.all([
          fetch(`${baseRoute}/api/drivers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          fetch(`${baseRoute}/api/vehicles`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
        ]);

        if(isEdit) {
          const assignment = await fetch(`${baseRoute}/api/assignments/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          })

          const assignmentData = await assignment.json();

          setFormData({
            driverId: assignmentData.driver.id,
            vehicleId: assignmentData.vehicle.id
          })
        }
        const driversData = await driversRes.json();
        const vehiclesData = await vehiclesRes.json();
        setDrivers(driversData);
        setVehicles(vehiclesData);
      } catch (err) {
        showToast("Error fetching drivers or vehicles", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    /**
     * @async
     * @function fetchAssignmentData
     * @description Carga los datos de una asignación específica si se está editando.
     */
    const fetchAssignmentData = async () => {
      if (!isEdit) return;
      try {
        const res = await fetch(`${baseRoute}/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await res.json();
        setFormData({
          driverId: data.driver.id,
          vehicleId: data.vehicle.id,
        });
      } catch (err) {
        showToast("Error loading the assignment", "error");
        console.error(err);
      }
    };

    fetchOptions();
    fetchAssignmentData();
  }, [id, isEdit]);

  /**
   * @function handleChange
   * @description Manejador de cambios para los campos del formulario.
   * Actualiza el estado `formData` con los valores de los inputs.
   * @param {object} e - El evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @async
   * @function handleSubmit
   * @description Manejador del evento de envío del formulario.
   * Envía los datos de la asignación a la API (creación o actualización).
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Determina el método HTTP y la URL según si es edición o creación.
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${baseRoute}/api/assignments/${id}`
      : `${baseRoute}/api/assignments`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

    // Si la respuesta no es exitosa, lanza un error.
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unexpected error");
    }

      // Muestra un mensaje de éxito y redirige a la página de asignaciones.
      showToast(isEdit ? "Assignment updated" : "Assignment created");
      setTimeout(() => navigate("/assignment"), 1000);
    } catch (err) {
      showToast(err.message || "Error while saving the assignment", "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Muestra un mensaje de carga mientras se obtienen los datos iniciales.
  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    // Estructura JSX del formulario de creación/edición de asignaciones.
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Muestra el componente Toast si hay un mensaje para mostrar */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Título del formulario que cambia según sea edición o creación */}
      <h2 className="text-2xl text-center sm:text-3xl font-semibold text-white mb-6">
        {isEdit ? "Edit Assignment" : "Create Assignment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector para elegir el conductor */}
        <div>
          <label className="block mb-1 text-sm font-medium">Driver</label>
          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-purple-950 text-white"
          >
            <option value="" disabled>Select driver</option>
            {/* Mapea la lista de conductores a opciones del selector */}
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-purple-950 text-white"
          >
            <option value="" disabled>Select vehicle</option>
            {/* Mapea la lista de vehículos a opciones del selector */}
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving} // Deshabilita el botón mientras se guarda.
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition duration-200 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};