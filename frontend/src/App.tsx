import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MapaPage from './pages/MapaPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MapaPage />} />
        <Route path="/mapa" element={<MapaPage />} />
      </Routes>
    </div>
  )
}

export default App
