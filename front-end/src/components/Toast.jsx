/**
 * @file Toast.jsx
 * @description Componente reutilizable para mostrar notificaciones temporales al usuario.
 * Puede ser utilizado para informar sobre el éxito de una operación, errores, o información general,
 * desapareciendo automáticamente después de un período definido.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar dentro de la tostada.
 * @param {string} [props.type="success"] - El tipo de notificación (ej. "success", "error", "info"), que afecta su estilo visual.
 * @param {function} props.onClose - Función de callback que se ejecuta cuando la tostada debe cerrarse.
 * @param {number} [props.duration=3000] - Duración en milisegundos antes de que la tostada se cierre automáticamente.
 * @author Equipo 3
 * @version 1.0.0
 */
import { useEffect } from "react";

export const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  /**
   * @function useEffect
   * @description Configura un temporizador para cerrar la tostada automáticamente.
   * Se limpia el temporizador si el componente se desmonta o las dependencias cambian.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Llama a la función onClose para cerrar la tostada después de la duración.
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador para evitar fugas de memoria.
  }, [duration, onClose]); // Dependencias: re-ejecuta el efecto si la duración o la función onClose cambian.

  // Mapea los tipos de tostada a clases CSS para un estilo visual distintivo.
  const typeClasses = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
  };

  return (
    // Contenedor principal de la tostada con estilos para posicionamiento, animación y color.
    <div className={`z-50 px-4 py-3 rounded border shadow transition-all animate-fade-in ${typeClasses[type]}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{message}</span> {/* Contenido del mensaje de la tostada. */}
        <button onClick={onClose} className="text-xl leading-none">&times;</button> {/* Botón de cierre manual de la tostada. */}
      </div>
    </div>
  );
};