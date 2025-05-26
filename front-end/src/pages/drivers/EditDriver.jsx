/**
 * @file EditDriver.jsx
 * @description Componente para crear o modificar la información de un Conductor.
 * Provee un formulario dinámico que permite al usuario ingresar o actualizar
 * detalles como nombre completo, fecha de nacimiento, CURP, dirección, salario
 * y número de licencia. Maneja la lógica de carga de datos para edición y el envío
 * de información a la API.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast"; // Importa el componente para notificaciones al usuario.

const baseRoute = import.meta.env.VITE_API_URL; // URL base de la API.

export const EditDriver = () => {
  const navigate = useNavigate(); // Hook para redirigir programáticamente.
  const { id } = useParams(); // Extrae el ID del conductor de la URL para saber si es edición.
  const isEdit = !!id; // Bandera booleana para el modo edición.

  // Estado que contiene los datos del formulario del conductor.
  const [formData, setFormData] = useState({
    fullName: "",
    birthdate: "",
    curp: "",
    address: "",
    monthlySalary: "",
    licenseNumber: "",
    entryDate: "",
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
   * @description Hook para cargar los datos del conductor si se está en modo edición.
   * Se ejecuta una vez al montar el componente si `isEdit` es verdadero.
   */
  useEffect(() => {
    if (!isEdit) return; // Si no es modo edición, no se necesita cargar datos.
    const fetchDriver = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/drivers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // Envía el token de autenticación.
        });
        if (!res.ok) throw new Error("Failed to fetch driver data"); // Manejo de error en la petición.
        const data = await res.json();
        // Llena el formulario con los datos del conductor recuperado, formateando fechas.
        setFormData({
          fullName: data.fullName,
          birthdate: data.birthdate.split("T")[0],
          curp: data.curp,
          address: data.address,
          monthlySalary: data.monthlySalary,
          licenseNumber: data.licenseNumber,
          entryDate: data.entryDate?.split("T")[0] || "", // Manejo de fecha de entrada opcional.
        });
      } catch (err) {
        showToast("Error loading driver", "error"); // Notifica al usuario del error.
        console.error(err);
      }
    };
    fetchDriver(); // Ejecuta la función de carga.
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
   * Envía los datos del formulario para crear un nuevo conductor o actualizar uno existente.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página.
    setSaving(true); // Activa el indicador de guardado.

    // Determina el método HTTP (POST para crear, PATCH para actualizar) y la URL.
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${baseRoute}/api/drivers/${id}`
      : `${baseRoute}/api/drivers`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          monthlySalary: parseFloat(formData.monthlySalary), // Asegura que el salario sea un número.
        }),
      });

      if (!res.ok) throw new Error("Error saving driver"); // Manejo de error en la respuesta de la API.

      showToast(isEdit ? "Driver updated" : "Driver created"); // Notifica el éxito.
      setTimeout(() => navigate("/driver"), 1000); // Redirige después de un breve retardo.
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
        {isEdit ? "Edit Driver" : "Create Driver"} {/* Título dinámico */}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Renderiza dinámicamente los campos del formulario. */}
        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "birthdate", label: "Birthdate", type: "date" },
          { name: "curp", label: "CURP", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "monthlySalary", label: "Monthly Salary", type: "number" },
          { name: "licenseNumber", label: "License Number", type: "text" },
          { name: "entryDate", label: "Entry Date", type: "date" },
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