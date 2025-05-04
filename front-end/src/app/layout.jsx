import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Sistema de Flotilla',
  description: 'Administra vehículos, conductores y rutas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen bg-gray-700 text-gray-900">

        <aside className="w-64 bg-purple-800 shadow-md px-4 py-6">
          <h1 className="text-2xl font-bold mb-8">Flotilla</h1>
          <nav className="space-y-4">
            <Link href="/dashboard" className="block font-bold transition-colors hover:text-pink-300">Dashboard</Link>
            <Link href="/vehicles" className="block font-bold transition-colors hover:text-pink-300">Vehículos</Link>
            <Link href="/drivers" className="block font-bold transition-colors hover:text-pink-300">Conductores</Link>
            <Link href="/assignments" className="block font-bold transition-colors hover:text-pink-300">Asignaciones</Link>
            <Link href="/routes" className="block font-bold transition-colors hover:text-pink-300">Rutas</Link>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">

          <header className="h-16 bg-purple-800 shadow-md flex items-center justify-between px-6">
            <span className="font-bold">Nombre Administrador</span>
            <button className="text-red-600 hover:underline">Cerrar sesión</button>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
