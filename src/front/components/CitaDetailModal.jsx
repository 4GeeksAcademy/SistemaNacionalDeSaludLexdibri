import React from "react";

export const CitaDetailModal = ({ show, onClose, cita }) => {
  if (!show || !cita) return null;

  // Renderizado del badge según estado
  const renderBadge = (status) => {
    switch (status) {
      case "Confirmada":
        return <span className="badge bg-success bg-opacity-25 text-success border border-success px-3 py-2">Confirmada</span>;
      case "Pendiente":
        return <span className="badge bg-warning bg-opacity-25 text-warning border border-warning px-3 py-2">Pendiente</span>;
      default:
        return <span className="badge bg-info bg-opacity-25 text-info border border-info px-3 py-2">{status}</span>;
    }
  };

  return (
    <div className="modal d-block tab-index-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div 
          className="modal-content bg-dark text-white border border-white border-opacity-25 rounded-4 shadow-lg"
          style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
        >
          <div className="modal-header border-bottom border-white border-opacity-10">
            <h5 className="modal-title fw-bold text-info d-flex align-items-center gap-2">
              📅 Detalle de la Cita Médica
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white-50 small">Estado de la cita:</span>
              {renderBadge(cita.status || "Confirmada")}
            </div>

            <div className="mb-3">
              <label className="text-white-50 small d-block">Especialidad</label>
              <span className="fs-6 fw-semibold text-white">{cita.specialty || "Medicina General"}</span>
            </div>

            <div className="mb-3">
              <label className="text-white-50 small d-block">Médico Asignado</label>
              <span className="fs-6 fw-semibold text-white">{cita.doctor_name || "Dr. Carlos Morales"}</span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="text-white-50 small d-block">Fecha</label>
                <span className="fw-medium text-white">{cita.date || "15 de Mayo, 2026"}</span>
              </div>
              <div className="col-6">
                <label className="text-white-50 small d-block">Hora</label>
                <span className="fw-medium text-white">{cita.time || "10:00 AM"}</span>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-white-50 small d-block">Centro de Salud</label>
              <span className="text-white-50 small">{cita.health_center || "Centro de Salud Manuel Becerra"}</span>
            </div>
          </div>

          <div className="modal-footer border-top border-white border-opacity-10 d-flex justify-content-between">
            <button type="button" className="btn btn-outline-light btn-sm rounded-3" onClick={onClose}>
              Cerrar
            </button>
            <a 
              href={cita.teleconsulta_url || "https://meet.jit.si/sns-teleconsulta-demo"} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-info btn-sm rounded-3 text-dark fw-bold px-3 d-flex align-items-center gap-2"
            >
              📹 Acceder a Teleconsulta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};