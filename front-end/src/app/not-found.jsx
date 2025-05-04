import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl mt-2">Página no encontrada</h2>
        <p className="mt-4 text-lg text-gray-700">
          Lo siento, pero la página que estás buscando no existe.
        </p>
        <Link href="/" className="mt-6 text-blue-600 hover:underline">
          Regresar al inicio
        </Link>
      </div>
    </div>
  );
}
