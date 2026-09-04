import React from "react";

export const Urgencias = () => {
  return (
    <div className="container text-white py-4">
      <div className="p-4 bg-danger bg-opacity-10 border border-danger rounded-3 mb-4">
        <h2 className="text-danger fw-bold mb-2">🚨 Urgencias Sanitarias 24h</h2>
        <p className="text-white mb-3">Si requiere asistencia médica inmediata ante una emergencia de riesgo vital, llame directamente:</p>
        <div className="d-flex gap-3 flex-wrap">
          <a href="tel:112" className="btn btn-danger btn-lg fw-bold px-4">📞 Llamar al 112</a>
          <a href="tel:061" className="btn btn-outline-danger btn-lg fw-bold px-4">🚑 Llamar al 061</a>
        </div>
      </div>

      <div className="p-4 bg-dark border border-secondary rounded-3">
        <h5 className="fw-bold text-white mb-3">Centros de Urgencias Más Cercanos</h5>
        <ul className="list-unstyled m-0 text-secondary small d-flex flex-column gap-2">
          <li className="p-2 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <span><strong>Hospital General Universitario:</strong> Servicio de Urgencias Continuado (24h)</span>
            <span className="badge bg-success">Abierto</span>
          </li>
          <li className="p-2 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <span><strong>Centro de Salud Urbano I:</strong> Urgencias de Atención Primaria (15:00 - 08:00)</span>
            <span className="badge bg-success">Abierto</span>
          </li>
        </ul>
      </div>
    </div>
  );
};