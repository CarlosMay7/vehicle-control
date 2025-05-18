import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría el registro real
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white text-black p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">Crear Cuenta</h2>
        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
