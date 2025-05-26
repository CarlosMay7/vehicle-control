/**
 * @file App.jsx
 * @description Componente principal de la aplicación React.
 * Este archivo define la estructura de enrutamiento de la aplicación utilizando
 * `react-router-dom`. Contiene la lógica para la autenticación básica (`user` state)
 * y renderiza rutas públicas (login, registro) y rutas protegidas (dashboard,
 * gestión de asignaciones, vehículos, conductores, rutas) que requieren que el
 * usuario esté autenticado.
 * También establece el diseño global con un fondo de gradiente.
 * @author Equipo 3
 * @version 1.0.0
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
// Importación de componentes de autenticación
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { Logout } from "./auth/Logout";
// Importación de componentes de diseño y utilidad
import { SideBar } from "./components/Sidebar"; // Barra lateral de navegación
import { PrivateRoute } from "./components/PrivateRoute"; // Componente para proteger rutas
// Importación de componentes de página (vistas principales)
import { Dashboard } from "./dashboard/Dashboard";
import { AssignmentIndex } from "./pages/assignments/AssignmentIndex";
import { VehicleIndex } from "./pages/vehicles/VehicleIndex";
import { RouteIndex } from "./pages/routes/RouteIndex";
import { DriverIndex } from "./pages/drivers/DriverIndex";
// Importación de componentes para edición/creación
import { EditAssignment } from "./pages/assignments/EditAssignment";
import { EditVehicle } from "./pages/vehicles/EditVehicle";
import { EditRoute } from "./pages/routes/EditRoute";
import { EditDriver } from "./pages/drivers/EditDriver";

import "./index.css"; // Importa estilos globales o base

export const App = () => {
  // `user` state: simula el estado de autenticación del usuario.
  // Podría ser un objeto de usuario si está autenticado, o `null` si no lo está.
  const [user, setUser] = useState(null); // Se inicializa como `null` hasta que el usuario inicie sesión.

  return (
    // Contenedor principal con estilos de fondo y texto global.
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      {/* BrowserRouter permite el enrutamiento basado en el historial del navegador */}
      <BrowserRouter>
        {/* Routes define las diferentes rutas de la aplicación */}
        <Routes>
          {/* Rutas Públicas: accesibles sin autenticación */}
          <Route path="/login" element={<Login onLogin={setUser} />} /> {/* Formulario de inicio de sesión */}
          <Route path="/register" element={<Register />} /> {/* Formulario de registro */}
          <Route path="/logout" element={<Logout />} /> {/* Cierra la sesión del usuario */}

          {/* Rutas Protegidas: solo accesibles si el usuario está autenticado */}
          {user ? (
            // Si el usuario está autenticado, se renderizan las rutas protegidas.
            // PrivateRoute actúa como un guardián de ruta.
            <Route element={<PrivateRoute />}>
              {/* SideBar envuelve las rutas que deben tener la barra lateral de navegación */}
              <Route element={<SideBar />}>
                <Route path="/dashboard" element={<Dashboard />} /> {/* Vista principal después del login */}

                {/* Rutas para la gestión de Asignaciones */}
                <Route path="/assignment" element={<AssignmentIndex />} /> {/* Lista de asignaciones */}
                <Route path="/assignment/new" element={<EditAssignment />} /> {/* Formulario para nueva asignación */}
                <Route path="/assignment/:id/edit" element={<EditAssignment />} /> {/* Formulario para editar asignación */}
                
                {/* Rutas para la gestión de Vehículos */}
                <Route path="/vehicle" element={<VehicleIndex />} /> {/* Lista de vehículos */}
                <Route path="/vehicle/new" element={<EditVehicle />} /> {/* Formulario para nuevo vehículo */}
                <Route path="/vehicle/:id/edit" element={<EditVehicle />} /> {/* Formulario para editar vehículo */}

                {/* Rutas para la gestión de Conductores (Drivers) */}
                <Route path="/driver" element={<DriverIndex />} /> {/* Lista de conductores */}
                <Route path="/driver/new" element={<EditDriver />} /> {/* Formulario para nuevo conductor */}
                <Route path="/driver/:id/edit" element={<EditDriver />} /> {/* Formulario para editar conductor */}

                {/* Rutas para la gestión de Rutas de viaje */}
                <Route path="/route" element={<RouteIndex />} /> {/* Lista de rutas de viaje */}
                <Route path="/route/new" element={<EditRoute />} /> {/* Formulario para nueva ruta de viaje */}
                <Route path="/route/:id/edit" element={<EditRoute />} /> {/* Formulario para editar ruta de viaje */}
              </Route>
            </Route>
          ) : (
            // Si el usuario NO está autenticado, cualquier intento de acceder a una ruta protegida
            // lo redirige automáticamente a la página de login.
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;