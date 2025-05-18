import { Card } from "../components/Card";

export const Dashboard = () => {
  return (
    //Integrar
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
