import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Toast } from "../../components/Toast";

export const GenericIndex = ({ resource, data = {} }) => {
  const navigate = useNavigate();
  const baseRoute = import.meta.env.VITE_API_URL;
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseRoute}/api/${resource.toLowerCase()}s/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting item');
      }

      showToast(`${resource} deleted`);
    } catch (error) {
      showToast(error.message || "Failed to delete", "error");
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 capitalize">
        {resource}
      </h1>
      <div>
        <button
          onClick={() => navigate(`/${resource.toLowerCase()}/new`)}
          className="mb-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Create {resource}
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white text-black rounded-xl">
            <thead className="bg-purple-700 text-white">
              <tr>
                {data.headers?.map((header, index) => (
                  <th key={index} className="p-3 text-left capitalize whitespace-nowrap">
                    {header}
                  </th>
                ))}
                <th className="p-3 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.values?.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {row.slice(1).map((cell, colIndex) => (
                    <td key={colIndex} className="p-3 align-middle whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                  <td className="p-3 align-middle flex justify-center space-x-2">
                    <button
                      onClick={() => navigate(`/${resource.toLowerCase()}/${row[0]}/edit`)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transform transition-transform duration-200 hover:scale-110"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(row[0])}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transform transition-transform duration-200 hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
