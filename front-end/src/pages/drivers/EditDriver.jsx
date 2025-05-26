
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    fullName: "",
    birthdate: "",
    curp: "",
    address: "",
    monthlySalary: "",
    licenseNumber: "",
    entryDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isEdit) return;
    const fetchDriver = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/drivers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await res.json();
        setFormData({
          fullName: data.fullName,
          birthdate: data.birthdate.split("T")[0],
          curp: data.curp,
          address: data.address,
          monthlySalary: data.monthlySalary,
          licenseNumber: data.licenseNumber,
          entryDate: data.entryDate?.split("T")[0] || "",
        });
      } catch (err) {
        showToast("Error loading driver", "error");
        console.error(err);
      }
    };
    fetchDriver();
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
          monthlySalary: parseFloat(formData.monthlySalary),
        }),
      });

      if (!res.ok) throw new Error("Error saving driver");

      showToast(isEdit ? "Driver updated" : "Driver created");
      setTimeout(() => navigate("/driver"), 1000);
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
        {isEdit ? "Edit Driver" : "Create Driver"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={saving}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};
