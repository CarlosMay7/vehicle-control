import { useEffect, useState } from "react";
import { GenericIndex } from "../components/GenericIndex";
import { Toast } from "../../components/Toast";

const baseRoute = import.meta.env.VITE_API_URL;

export const RouteIndex = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function getRoutes() {
    try {
      const res = await fetch(`${baseRoute}/api/routes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch routes");
      const data = await res.json();

      const rows = data.map((r) => [
        r.id,
        r.name,
        r.routeDate.split("T")[0],
        r.successful ? "Yes" : "No",
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
      const values = await getRoutes();
      setData({
        headers: ["Name", "Date", "Successful"],
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
        <GenericIndex resource="Route" data={data} />
      )}
    </>
  );
};
