import React from "react";

export const Especialidades = () => {
  const especialidades = [
    { titulo: "Cardiología", desc: "Atención especializada del sistema cardiovascular y pruebas de esfuerzo." },
    { titulo: "Pediatría", desc: "Seguimiento del desarrollo infantil y vacunación." },
    { titulo: "Neurología", desc: "Diagnóstico y tratamiento de patologías del sistema nervioso." },
    { titulo: "Oftalmología", desc: "Revisiones de salud visual y cirugía refractiva." }
  ];

  return (
    <div className="container text-white py-4">
      <h2 className="fw-bold mb-1">🧬 Especialidades Médicas</h2>
      <p className="text-secondary mb-4">Catálogo de servicios sanitarios disponibles en el sistema público</p>

      <div className="row g-3">
        {especialidades.map((esp, i) => (
          <div key={i} className="col-12 col-md-6">
            <div className="p-3 bg-dark border border-secondary rounded-3 shadow-sm d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-white mb-1">{esp.titulo}</h5>
                <small className="text-secondary">{esp.desc}</small>
              </div>
              <button className="btn btn-outline-info btn-sm text-nowrap ms-2">Solicitar Cita</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};