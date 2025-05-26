import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const EditRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    assignmentId: "",
    name: "",
    startLatitude: "",
    startLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
    routeDate: "",
    successful: true,
    issueDescription: "",
    comments: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/assignments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        showToast("Error fetching assignments", "error");
        console.error(err);
      }
    };

    const fetchRoute = async () => {
      try {
        const res = await fetch(`${baseRoute}/api/routes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
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
        showToast("Error loading route", "error");
        console.error(err);
      }
    };

    fetchAssignments();
    if (isEdit) fetchRoute();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      startLatitude: parseFloat(formData.startLatitude),
      startLongitude: parseFloat(formData.startLongitude),
      destinationLatitude: parseFloat(formData.destinationLatitude),
      destinationLongitude: parseFloat(formData.destinationLongitude),
    };

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
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error saving route");

      showToast(isEdit ? "Route updated" : "Route created");
      setTimeout(() => navigate("/route"), 1000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
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
        {isEdit ? "Edit Route" : "Create Route"}
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
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {`${a.id} - ${a.driver?.fullName} / ${a.vehicle?.licensePlate}`}
              </option>
            ))}
          </select>
        </div>

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
          disabled={saving}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};
