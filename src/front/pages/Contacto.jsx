import React from "react";

export const Contacto = () => {
  return (
    <div className="container text-white py-4">
      <h2 className="fw-bold mb-1">📞 Atención y Contacto</h2>
      <p className="text-secondary mb-4">Canales oficiales de asistencia al paciente</p>

      <div className="row g-4">
        <div className="col-md-6">
          <form className="p-4 bg-dark border border-secondary rounded-3">
            <div className="mb-3">
              <label className="form-label small text-secondary">Nombre Completo</label>
              <input type="text" className="form-control bg-secondary bg-opacity-10 text-white border-secondary" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-secondary">Correo Electrónico</label>
              <input type="email" className="form-control bg-secondary bg-opacity-10 text-white border-secondary" placeholder="nombre@correo.com" />
            </div>
            <div className="mb-3">
              <label className="form-label small text-secondary">Consulta o Mensaje</label>
              <textarea className="form-control bg-secondary bg-opacity-10 text-white border-secondary" rows="3"></textarea>
            </div>
            <button type="button" className="btn btn-info w-100 fw-bold">Enviar Consulta</button>
          </form>
        </div>
        <div className="col-md-6 d-flex flex-column gap-3">
          <div className="p-3 bg-dark border border-secondary rounded-3">
            <h6 className="fw-bold text-info">Centro de Atención Telefónica</h6>
            <p className="m-0 text-secondary small">Teléfono gratuito: <strong>012</strong> / <strong>900 100 200</strong></p>
          </div>
          <div className="p-3 bg-dark border border-secondary rounded-3">
            <h6 className="fw-bold text-info">Soporte Digital</h6>
            <p className="m-0 text-secondary small">Soporte técnico para el portal web: soporte@sns.gob.es</p>
          </div>
        </div>
      </div>
    </div>
  );
};