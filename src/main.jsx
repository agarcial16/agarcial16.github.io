import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PrintableCV from './PrintableCV.jsx'
import './index.css' // Importamos los estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cv" element={<PrintableCV />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)