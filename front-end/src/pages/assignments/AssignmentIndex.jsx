import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const AssignmentIndex = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function getAssignments() {
    try {
      const response = await fetch(`${baseRoute}/api/assignments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assignments");
      }

      const data = await response.json();
      const mappedAssignmentValues = data.map((value) => [
        value.id,
        value.driver.fullName,
        `${value.vehicle.brand} ${value.vehicle.model}`,
      ]);

      return mappedAssignmentValues;
    } catch (error) {
      showToast(error.message || "Error loading assignments", "error");
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const assignmentValues = await getAssignments();
      setData({
        headers: ["Driver", "Vehicle"],
        values: assignmentValues,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {loading ? (
        <p className="text-center mt-6 text-white">Loading...</p>
      ) : (
        <GenericIndex resource="Assignment" data={data} />
      )}
    </>
  );
};
