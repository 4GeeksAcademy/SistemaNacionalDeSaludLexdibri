import React from "react";

export const PatientMedicalDetails = ({ onOpenTeleconsulta }) => {
  // Datos de prueba (pueden conectarse al backend o context)
  const recetas = [
    { id: 1, medicamento: "Paracetamol 1g", dosis: "1 comprimido cada 8 horas", duracion: "7 días", estado: "Activa" },
    { id: 2, medicamento: "Omeprazol 20mg", dosis: "1 cápsula en ayunas", duracion: "30 días", estado: "Activa" },
    { id: 3, medicamento: "Ibuprofeno 600mg", dosis: "1 comprimido cada 12 horas", duracion: "Tratamiento finalizado", estado: "Concluida" }
  ];

  const citas = [
    { id: 101, especialidad: "Medicina General", medico: "Dr. Carlos Morales", fecha: "28 de Agosto, 2026", hora: "10:00 AM", tipo: "Teleconsulta", link: "https://meet.jit.si/sns-teleconsulta-101" },
    { id: 102, especialidad: "Cardiología", medico: "Dra. Elena Ramos", fecha: "15 de Septiembre, 2026", hora: "11:30 AM", tipo: "Presencial", centro: "H. U. Río Hortega" }
  ];

  return (
    <div className="container py-3">
      <div className="row g-4">
        
        {/* SECCIÓN 1: MIS RECETAS ACTIVAS */}
        <div className="col-12 col-lg-6">
          <div 
            className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white h-100"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-info d-flex align-items-center gap-2">
                💊 Mis Recetas Activas
              </h5>
              <span className="badge bg-info bg-opacity-25 text-info border border-info">
                {recetas.filter(r => r.estado === "Activa").length} Vigentes
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {recetas.map((receta) => (
                <div 
                  key={receta.id} 
                  className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="fw-bold mb-1 text-white">{receta.medicamento}</h6>
                    <p className="mb-0 text-white-50 small">
                      <strong>Dosis:</strong> {receta.dosis}
                    </p>
                    <span className="text-white-50 extra-small">{receta.duracion}</span>
                  </div>
                  <div>
                    {receta.estado === "Activa" ? (
                      <span className="badge bg-success bg-opacity-25 text-success border border-success">Activa</span>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary">Concluida</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: CITAS MÉDICAS PROGRAMADAS */}
        <div className="col-12 col-lg-6">
          <div 
            className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white h-100"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-info d-flex align-items-center gap-2">
                📅 Citas Médicas Programadas
              </h5>
              <span className="badge bg-success bg-opacity-25 text-success border border-success">
                {citas.length} Pendientes
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {citas.map((cita) => (
                <div 
                  key={cita.id} 
                  className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10"
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-0 text-white">{cita.especialidad}</h6>
                      <span className="text-white-50 small">{cita.medico}</span>
                    </div>
                    <span className={`badge ${cita.tipo === "Teleconsulta" ? "bg-info" : "bg-warning"} bg-opacity-25 text-white border`}>
                      {cita.tipo}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="small text-white-50">
                      ⏱️ {cita.fecha} — {cita.hora}
                    </div>

                    {/* Botón directo a Teleconsulta si es de tipo online */}
                    {cita.tipo === "Teleconsulta" ? (
                      <a 
                        href={cita.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-info btn-sm rounded-3 text-dark fw-bold d-flex align-items-center gap-1"
                      >
                        📹 Unirse a Teleconsulta
                      </a>
                    ) : (
                      <span className="extra-small text-white-50">{cita.centro}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};