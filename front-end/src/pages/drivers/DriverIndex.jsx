import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const DriverIndex = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function getDrivers() {
    try {
      const res = await fetch(`${baseRoute}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch drivers");
      const data = await res.json();

      const rows = data.map((d) => [
        d.id,
        d.fullName,
        d.birthdate.split("T")[0],
        d.licenseNumber,
      ]);

      return rows;
    } catch (err) {
      showToast(err.message);
      return [];
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const values = await getDrivers();
      setData({
        headers: ["Full Name", "Birthdate", "License Number"],
        values,
      });
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <GenericIndex resource="Driver" data={data} />
      )}
    </>
  );
};
