import React from "react";

export const Diagnostico = () => {
  return (
    <div className="container text-white py-4">
      <h2 className="fw-bold mb-1">🔬 Diagnóstico y Tecnología</h2>
      <p className="text-secondary mb-4">Acceso a pruebas analíticas, imagenología y resultados médicos</p>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-4 bg-dark border border-secondary rounded-3">
            <h4 className="text-info fw-bold mb-2">🧪 Analíticas de Sangre y Orina</h4>
            <p className="text-secondary small">Consulte sus últimos análisis clínicos sincronizados con su historial de la comunidad autónoma.</p>
            <button className="btn btn-sm btn-info text-dark fw-bold">Ver Mis Análisis</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 bg-dark border border-secondary rounded-3">
            <h4 className="text-info fw-bold mb-2">🩻 Radiología e Imagen</h4>
            <p className="text-secondary small">Acceso al visor de radiografías, resonancias magnéticas y ecografías.</p>
            <button className="btn btn-sm btn-info text-dark fw-bold">Ver Pruebas de Imagen</button>
          </div>
        </div>
      </div>
    </div>
  );
};