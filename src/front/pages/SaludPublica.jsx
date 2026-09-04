import React from "react";

export const SaludPublica = () => {
  return (
    <div className="container text-white py-4">
      <h2 className="fw-bold mb-1">📊 Salud Pública y Prevención</h2>
      <p className="text-secondary mb-4">Campañas activas y vigilancia epidemiológica</p>

      <div className="list-group bg-dark border border-secondary rounded-3">
        <div className="list-group-item bg-dark text-white border-secondary p-3">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-warning">💉 Campaña Vacunación Antigripal 2026</h5>
            <small className="text-secondary">Activa</small>
          </div>
          <p className="mb-1 text-secondary small">Cita previa disponible para grupos de riesgo y mayores de 60 años.</p>
        </div>
        <div className="list-group-item bg-dark text-white border-secondary p-3">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-info">☀️ Prevención Ola de Calor</h5>
            <small className="text-secondary">Informativa</small>
          </div>
          <p className="mb-1 text-secondary small">Recomendaciones e hidratación para personas vulnerables.</p>
        </div>
      </div>
    </div>
  );
};