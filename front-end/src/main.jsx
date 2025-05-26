/**
 * @file main.jsx
 * @description Punto de entrada principal de la aplicación React.
 * Este archivo es el encargado de montar el componente raíz de la aplicación (`App.jsx`)
 * en el elemento DOM con el id 'root' (generalmente ubicado en 'index.html').
 * Utiliza React's `createRoot` para una renderización concurrente y `StrictMode`
 * para detectar problemas potenciales en la aplicación durante el desarrollo.
 * @author Equipo 3
 * @version 1.0.0
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Importa estilos globales o base para la aplicación
import App from './App.jsx' // Importa el componente principal de la aplicación

// Crea una raíz de renderizado para la aplicación en el elemento 'root' del HTML.
createRoot(document.getElementById('root')).render(
  // StrictMode habilita comprobaciones adicionales y advertencias para tus componentes.
  <StrictMode>
    {/* El componente <App /> es la raíz de toda la lógica y la interfaz de usuario de la aplicación. */}
    <App />
  </StrictMode>,
)