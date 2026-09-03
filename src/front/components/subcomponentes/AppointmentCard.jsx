import React from "react";

export const AppointmentCard = ({ cita, onOpenTeleconsulta }) => {
  const isTeleconsulta = cita.tipo === "Teleconsulta";
  return (
    <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-bold mb-0 text-white">{cita.especialidad}</h6>
          <span className="text-white-50 small">{cita.medico}</span>
        </div>
        <span className={`badge ${isTeleconsulta ? "bg-info text-info border-info" : "bg-warning text-warning border-warning"} bg-opacity-25 border`}>
          {cita.tipo}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="small text-white-50">
          ⏱️ {cita.fecha} — {cita.hora}
        </div>

        {isTeleconsulta ? (
          <button 
            type="button"
            onClick={() => onOpenTeleconsulta ? onOpenTeleconsulta(cita) : window.open(cita.link, "_blank")}
            className="btn btn-info btn-sm rounded-3 text-dark fw-bold d-flex align-items-center gap-1"
          >
            📹 Unirse
          </button>
        ) : (
          <span className="text-white-50" style={{ fontSize: "0.75rem" }}>📍 {cita.centro}</span>
        )}
      </div>
    </div>
  );
};