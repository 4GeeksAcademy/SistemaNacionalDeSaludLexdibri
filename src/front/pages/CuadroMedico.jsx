import React from "react";

export const CuadroMedico = () => {
  const medicos = [
    { nombre: "Dra. Elena Gómez", espec: "Medicina Familiar", centro: "C.S. Centro", estado: "Disponible" },
    { nombre: "Dr. Carlos Ruiz", espec: "Pediatría", centro: "Hospital General", estado: "Consulta Completa" },
    { nombre: "Dra. Sofía Martin", espec: "Cardiología", centro: "C.S. Norte", estado: "Disponible" }
  ];

  return (
    <div className="container text-white py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">🩺 Cuadro Médico</h2>
          <p className="text-secondary m-0">Directorio de profesionales y centros asistenciales</p>
        </div>
        <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary w-auto" placeholder="Filtrar médico o centro..." />
      </div>

      <div className="row g-3">
        {medicos.map((med, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-info">{med.nombre}</h5>
                <p className="card-text text-secondary mb-1"><strong>Especialidad:</strong> {med.espec}</p>
                <p className="card-text text-secondary mb-3"><strong>Centro:</strong> {med.centro}</p>
                <span className={`badge ${med.estado === 'Disponible' ? 'bg-success' : 'bg-warning text-dark'}`}>{med.estado}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};