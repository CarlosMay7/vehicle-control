import { useEffect } from "react";

export const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
  };

  return (
    <div className={`z-50 px-4 py-3 rounded border shadow transition-all animate-fade-in ${typeClasses[type]}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-xl leading-none">&times;</button>
      </div>
    </div>
  );
};
