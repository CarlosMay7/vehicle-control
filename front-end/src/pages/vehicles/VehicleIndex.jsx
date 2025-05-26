import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const VehicleIndex = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function getVehicles() {
    try {
      const res = await fetch(`${baseRoute}/api/vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();

      const rows = data.map((v) => [
        v.id,
        v.brand,
        v.model,
        v.vin,
        v.licensePlate,
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
      const values = await getVehicles();
      setData({
        headers: ["Brand", "Model", "VIN", "License Plate"],
        values,
      });
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading ? <p className="text-center">Loading...</p> : <GenericIndex resource="Vehicle" data={data} />}
    </>
  );
};
