/**
 * @file Dashboard.jsx
 * @description Componente de la vista principal del Dashboard.
 * Muestra un resumen general de la aplicación a través de tarjetas informativas
 * que presentan datos clave como el número de usuarios, viajes, vehículos y conductores creados.
 * @author Equipo 3
 * @version 1.0.0
 */
import { Card } from "../components/Card"; // Importa el componente Card para mostrar información resumida.

export const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-300">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Usuarios creados" value="150" />
        <Card title="Viajes hoy" value="32" />
        <Card title="Vehículos creados" value="20" />
        <Card title="Conductores creados" value="18" />
      </div>
    </div>
  );
}