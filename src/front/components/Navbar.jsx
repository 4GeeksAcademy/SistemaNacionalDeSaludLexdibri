import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [selectedRegion, setSelectedRegion] = useState("Castilla y León");

  return (
    <header 
      className="w-100 text-light py-2 px-3 px-md-4 border-bottom border-white border-opacity-10 position-relative" 
      style={{ background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(10px)", zIndex: 1000 }}
    >

      {/* BARRA SUPERIOR PRINCIPAL */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">

        {/* Lado Izquierdo: Selector de Region + Búsqueda + Logo */}
        <div className="d-flex align-items-center gap-3 flex-wrap">

          {/* Selector de Comunidad Autónoma */}
          <select
            className="form-select form-select-sm bg-white bg-opacity-10 text-white border-0 cursor-pointer"
            style={{ width: "auto" }}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="Castilla y León" className="text-dark">JCyL - Castilla y León</option>
            <option value="Madrid" className="text-dark">Sermas - Madrid</option>
            <option value="Andalucía" className="text-dark">SAS - Andalucía</option>
            <option value="Cataluña" className="text-dark">CatSalut - Cataluña</option>
            <option value="Valencia" className="text-dark">GVA - Comunitat Valenciana</option>
          </select>

          {/* Input de Búsqueda Rápida */}
          <div className="input-group input-group-sm d-none d-md-flex" style={{ maxWidth: "240px" }}>
            <span className="input-group-text bg-white bg-opacity-10 border-0 text-white-50">🔍</span>
            <input 
              type="text" 
              className="form-control bg-white bg-opacity-10 border-0 text-white placeholder-white-50" 
              placeholder="Buscar especialidad..." 
            />
          </div>

          {/* Logo Principal */}
          <Link to="/" className="text-decoration-none h5 m-0 fw-bold text-white d-flex align-items-center gap-2">
            <span className="fs-3 text-info">+</span> Sistema Nacional de Salud
          </Link>
        </div>

        {/* Lado Derecho: Menú "Mi Portal SNS" */}
        <div className="dropdown position-relative" style={{ zIndex: 1050 }}>
          <button 
            className="btn btn-sm bg-white bg-opacity-10 text-white border-0 dropdown-toggle px-3 rounded-pill" 
            type="button" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            👤 Mi Portal SNS
          </button>
          
          <ul 
            className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary" 
            style={{ zIndex: 1060, backgroundColor: "#1e293b" }}
          >
            <li>
              <Link className="dropdown-item py-2" to="/profile">
                Perfil del Paciente
              </Link>
            </li>
            <li>
              <Link className="dropdown-item py-2" to="/settings">
                Ajustes
              </Link>
            </li>
            <li><hr className="dropdown-divider border-secondary" /></li>
            <li>
              <button className="dropdown-item py-2 text-danger">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* NAVEGACIÓN SECUNDARIA */}
      <nav className="d-flex gap-3 gap-md-4 text-white-50 small flex-wrap pt-2 border-top border-white border-opacity-10">
        <span className="text-white opacity-75 cursor-pointer">Cuadro Médico ▾</span>
        <span className="text-white opacity-75 cursor-pointer">Especialidades ▾</span>
        <span className="text-white opacity-75 cursor-pointer">Diagnóstico y Tecnología ▾</span>
        <span className="text-white opacity-75 cursor-pointer">Salud Pública ▾</span>
        <span className="text-white opacity-75 cursor-pointer">El Sistema ▾</span>
        <span className="text-white opacity-75 cursor-pointer">Contacto</span>
        <span className="text-danger fw-bold cursor-pointer">Urgencias ▾</span>
      </nav>

    </header>
  );
};