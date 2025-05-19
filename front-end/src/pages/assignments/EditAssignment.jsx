import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const EditAssignment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ driverId: "", vehicleId: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [driversRes, vehiclesRes, assignment] = await Promise.all([
          fetch(`${baseRoute}/api/drivers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          fetch(`${baseRoute}/api/vehicles`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          fetch(`${baseRoute}/api/assignments/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
        ]);
        const driversData = await driversRes.json();
        const vehiclesData = await vehiclesRes.json();
        const assignmentData = await assignment.json();
        setDrivers(driversData);
        setVehicles(vehiclesData);

        if(isEdit) {
            setFormData({
                driverId: assignmentData.driver.id,
                vehicleId: assignmentData.vehicle.id
            })
        }
      } catch (err) {
        showToast("Error fetching drivers or vehicles", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unexpected error");
    }

      showToast(isEdit ? "Assignment updated" : "Assignment created");
      setTimeout(() => navigate("/assignment"), 1000);
    } catch (err) {
      showToast(err.message || "Error while saving the assignment", "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl text-center sm:text-3xl font-semibold text-white mb-6">
        {isEdit ? "Edit Assignment" : "Create Assignment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition duration-200 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};
