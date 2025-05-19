import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
//Rutas reales, quizás tenerlos en un archivo
  { name: "Assignments", path: "/assignment" },
//   { name: "Viajes", path: "/viajes" },
//   { name: "Vehículos", path: "/vehiculos" },
//   { name: "Conductores", path: "/conductores" },
];

export const SideBar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen flex">
      <aside
        className={`bg-purple-900 text-white flex flex-col py-6 transition-all duration-300 ${
          collapsed ? "w-16 items-center" : "w-64 px-4"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 self-end text-xs bg-purple-700 px-2 py-1 rounded hover:bg-purple-600"
        >
          {collapsed ? "➤" : "←"}
        </button>

        <div className="flex flex-col justify-between flex-1">

            <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded transition-all px-3 py-2 hover:bg-purple-500 ${
                    location.pathname.startsWith(item.path) ? "bg-purple-500" : ""
                }`}
                >
                <span className="text-lg w-6 text-center">
                    {item.name.charAt(0)}
                </span>
                {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
                </Link>
            ))}
            </nav>

            <div className="mt-4">
                <Link
                    to="/logout"
                    className="flex items-center rounded transition-all px-3 py-2 hover:bg-red-500"
                >
                    <span className="text-lg w-6 text-center">⎋</span>
                    {!collapsed && <span className="ml-2 text-sm">Cerrar sesión</span>}
                </Link>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gradient-to-br from-purple-900 to-gray-900 text-white">
        <Outlet />
      </main>
    </div>
  );
}
