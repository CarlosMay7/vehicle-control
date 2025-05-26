/**
 * @file Sidebar.jsx
 * @description Componente de barra lateral de navegación para la aplicación.
 * Ofrece una interfaz de usuario consistente para la navegación principal,
 * permitiendo al usuario colapsar/expandir la barra y destacando la ruta activa.
 * También integra el `Outlet` para renderizar las rutas principales de la aplicación.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom"; // `Link` para navegación declarativa, `useLocation` para obtener la ruta actual, `Outlet` para rutas anidadas.

// Definición de los elementos del menú de navegación, con sus nombres y rutas.
const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Assignments", path: "/assignment" },
  { name: "Vehicles", path: "/vehicle" },
  { name: "Drivers", path: "/driver" },
  { name: "Routes", path: "/route" },
];

export const SideBar = () => {
  const location = useLocation(); // Obtiene el objeto de ubicación actual para resaltar el elemento de menú activo.
  const [collapsed, setCollapsed] = useState(true); // Estado para controlar si la barra lateral está colapsada.

  return (
    <div className="min-h-screen flex">
      <aside
        // Estilos dinámicos para la barra lateral que controlan su ancho y alineación
        // basados en el estado `collapsed`.
        className={`bg-purple-900 text-white flex flex-col py-6 transition-all duration-300 ${
          collapsed ? "w-16 items-center" : "w-64 px-4"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)} // Alterna el estado de colapso de la barra lateral.
          className="mb-6 self-end text-xs bg-purple-700 px-2 py-1 rounded hover:bg-purple-600"
        >
          {collapsed ? "➤" : "←"} {/* Icono que indica el estado de colapso/expansión. */}
        </button>

        <div className="flex flex-col justify-between flex-1">
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                // Estilos dinámicos para resaltar el elemento de menú que corresponde a la ruta actual.
                className={`flex items-center rounded transition-all px-3 py-2 hover:bg-purple-500 ${
                  location.pathname.startsWith(item.path) ? "bg-purple-500" : ""
                }`}
              >
                <span className="text-lg w-6 text-center">
                  {item.name.charAt(0)} {/* Muestra la primera letra del nombre del menú como icono cuando está colapsado. */}
                </span>
                {!collapsed && <span className="ml-2 text-sm">{item.name}</span>} {/* Muestra el nombre completo cuando está expandido. */}
              </Link>
            ))}
          </nav>

          <div className="mt-4">
            <Link
              to="/logout"
              className="flex items-center rounded transition-all px-3 py-2 hover:bg-red-500"
            >
              <span className="text-lg w-6 text-center">⎋</span> {/* Icono de cierre de sesión. */}
              {!collapsed && <span className="ml-2 text-sm">Cerrar sesión</span>} {/* Texto para cerrar sesión. */}
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gradient-to-br from-purple-900 to-gray-900 text-white">
        <Outlet /> {/* Aquí se renderizarán los componentes de las rutas principales. */}
      </main>
    </div>
  );
}