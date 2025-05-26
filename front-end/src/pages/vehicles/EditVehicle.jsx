import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    vin: "",
    licensePlate: "",
    purchaseDate: "",
    entryDate: "",
    cost: ""
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isEdit) return;
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await res.json();
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
        showToast("Error loading vehicle", "error");
        console.error(err);
      }
    };
    fetchVehicle();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
          cost: Number(formData.cost),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error saving vehicle");
      }

      showToast(isEdit ? "Vehicle updated" : "Vehicle created");
      setTimeout(() => navigate("/vehicle"), 1000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}      
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        {isEdit ? "Edit Vehicle" : "Create Vehicle"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block mb-1 capitalize">{field}</label>
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
          disabled={saving}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};
