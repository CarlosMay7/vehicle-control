import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { Dashboard } from "./dashboard/Dashboard";
import { SideBar } from "./components/Sidebar";
import { PrivateRoute } from "./components/PrivateRoute";
import { Logout } from "./auth/Logout";

import "./index.css";

export const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected routes */}
          {user ? (
            <Route element={<PrivateRoute />}>
              <Route element={<SideBar />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
