export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Vehículos" value="25" />
          <Card title="Conductores" value="18" />
          <Card title="Asignaciones activas" value="12" />
          <Card title="Rutas hoy" value="5" />
        </div>
  
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Resumen reciente</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>2 vehículos fueron asignados hoy</li>
            <li>1 ruta fallida registrada</li>
            <li>Se agregó un nuevo conductor</li>
          </ul>
        </div>
      </div>
    )
  }
  
  function Card({ title, value }) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-start justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-bold text-blue-600">{value}</span>
      </div>
    )
  }
  