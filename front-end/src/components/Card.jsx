/**
 * @file Card.jsx
 * @description Componente funcional para renderizar una tarjeta de información genérica.
 * Su propósito es mostrar un título y un valor asociado de manera visualmente atractiva
 * y consistente en toda la aplicación, ideal para cuadros de mando o resúmenes de datos.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El título o etiqueta descriptiva de la tarjeta.
 * @param {string|number} props.value - El valor principal a mostrar en la tarjeta.
 * @author Equipo 3
 * @version 1.0.0
 */
export const Card = ({ title, value }) => {
  return (
    // Estilos Tailwind CSS para la apariencia de la tarjeta, incluyendo sombreado y esquinas redondeadas.
    <div className="bg-purple-800 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-sm text-purple-200 mb-1">{title}</h2> {/* Título estilizado para diferenciarlo del valor. */}
      <p className="text-2xl font-semibold">{value}</p> {/* Valor principal con un estilo más prominente. */}
    </div>
  )
}