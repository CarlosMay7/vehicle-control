/**
 * @file EditVehicle.jsx
 * @description Componente para crear o modificar la información de un Vehículo.
 * Provee un formulario que permite al usuario ingresar o actualizar detalles
 * como marca, modelo, VIN, matrícula, fecha de compra, fecha de entrada y costo.
 * Maneja la lógica de carga de datos para edición y el envío de información a la API.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast"; // Importa el componente para notificaciones al usuario.

const baseRoute = import.meta.env.VITE_API_URL; // URL base de la API.

export const EditVehicle = () => {
  const navigate = useNavigate(); // Hook para redirigir programáticamente.
  const { id } = useParams(); // Extrae el ID del vehículo de la URL para saber si es edición.
  const isEdit = !!id; // Bandera booleana para el modo edición.

  // Estado que contiene los datos del formulario del vehículo.
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    vin: "",
    licensePlate: "",
    purchaseDate: "",
    entryDate: "",
    cost: ""
  });
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
   * @description Hook para cargar los datos del vehículo si se está en modo edición.
   * Se ejecuta una vez al montar el componente si `isEdit` es verdadero.
   */
  useEffect(() => {
    if (!isEdit) return; // Si no es modo edición, no se necesita cargar datos.
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // Envía el token de autenticación.
        });
        if (!res.ok) throw new Error("Failed to fetch vehicle data"); // Manejo de error en la petición.
        const data = await res.json();
        // Llena el formulario con los datos del vehículo recuperado, formateando fechas.
        setFormData({
          brand: data.brand,
          model: data.model,
          vin: data.vin,
          licensePlate: data.licensePlate,
          purchaseDate: data.purchaseDate.split("T")[0],
          entryDate: data.entryDate.split("T")[0],
          cost: data.cost
        });
      } catch (err) {
        showToast("Error loading vehicle", "error"); // Notifica al usuario del error.
        console.error(err);
      }
    };
    fetchVehicle(); // Ejecuta la función de carga.
  }, [id, isEdit]); // Dependencias: re-ejecuta si el ID o el modo edición cambian.

  /**
   * @function handleChange
   * @description Actualiza el estado `formData` cuando un campo del formulario cambia.
   * @param {object} e - El evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @async
   * @function handleSubmit
   * @description Maneja el envío del formulario, realizando una petición POST o PATCH a la API.
   * Envía los datos del formulario para crear un nuevo vehículo o actualizar uno existente.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página.
    setSaving(true); // Activa el indicador de guardado.

    // Determina el método HTTP (POST para crear, PATCH para actualizar) y la URL.
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${baseRoute}/api/vehicles/${id}`
      : `${baseRoute}/api/vehicles`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          cost: Number(formData.cost), // Asegura que el costo sea un número.
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error saving vehicle"); // Manejo de error en la respuesta de la API.
      }

      showToast(isEdit ? "Vehicle updated" : "Vehicle created"); // Notifica el éxito.
      setTimeout(() => navigate("/vehicle"), 1000); // Redirige después de un breve retardo.
    } catch (err) {
      showToast(err.message, "error"); // Muestra el mensaje de error.
    } finally {
      setSaving(false); // Desactiva el indicador de guardado.
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        {isEdit ? "Edit Vehicle" : "Create Vehicle"} {/* Título dinámico */}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Renderiza dinámicamente los campos del formulario. */}
        {[
          { field: 'brand', type: 'text' },
          { field: 'model', type: 'text' },
          { field: 'vin', type: 'text' },
          { field: 'licensePlate', type: 'text' },
          { field: 'cost', type: 'number' },
          { field: 'purchaseDate', type: 'date' },
          { field: 'entryDate', type: 'date' }
        ].map(({ field, type }) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label> {/* Formatea label legible */}
            <input
              name={field}
              type={type}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-purple-950 text-white"
            />
          </div>
        ))}
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