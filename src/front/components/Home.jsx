import React from "react";

export const Home = () => {
  return (
    <div 
      className="min-vh-100 text-light py-4 px-2 px-md-4"
      style={{
        background: "radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 70%, #090d16 100%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      <div className="container-fluid max-w-1200">
        
        {/* REJILLA PRINCIPAL DEL PORTAL */}
        <div className="row g-4">
          
          {/* COLUMNA IZQUIERDA: TARJETAS DE ACCESO RÁPIDO */}
          <div className="col-12 col-lg-8">
            <div className="row g-3">
              
              {/* Citas Médicas */}
              <div className="col-12 col-md-6">
                <div className="card h-100 bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-2">📅</span>
                    <h5 className="fw-bold mb-0">Citas Médicas</h5>
                  </div>
                  <p className="text-white-50 small mb-4">Próxima cita: 15 de Mayo, 10:00 AM</p>
                  <button className="btn btn-primary w-100 rounded-3 border-0 py-2 shadow-sm" style={{ background: "#0284c7" }}>Ver más</button>
                </div>
              </div>

              {/* Recetas Electrónicas */}
              <div className="col-12 col-md-6">
                <div className="card h-100 bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-2">💊</span>
                    <h5 className="fw-bold mb-0">Recetas Electrónicas</h5>
                  </div>
                  <p className="text-white-50 small mb-4">Recetas activas: 2</p>
                  <button className="btn btn-primary w-100 rounded-3 border-0 py-2 shadow-sm" style={{ background: "#0284c7" }}>Ver más</button>
                </div>
              </div>

              {/* Enfermedades Diagnosticadas */}
              <div className="col-12 col-md-6">
                <div className="card h-100 bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-2">🔬</span>
                    <h5 className="fw-bold mb-0">Enfermedades Diagnosticadas</h5>
                  </div>
                  <p className="text-white-50 small mb-4">Hipertensión, Diabetes Tipo 2</p>
                  <button className="btn btn-primary w-100 rounded-3 border-0 py-2 shadow-sm" style={{ background: "#0284c7" }}>Ver más</button>
                </div>
              </div>

              {/* Historial Médico */}
              <div className="col-12 col-md-6">
                <div className="card h-100 bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-2">📁</span>
                    <h5 className="fw-bold mb-0">Historial Médico</h5>
                  </div>
                  <p className="text-white-50 small mb-4">Acceso a su historial completo</p>
                  <button className="btn btn-primary w-100 rounded-3 border-0 py-2 shadow-sm" style={{ background: "#0284c7" }}>Ver más</button>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: WIDGETS LATERALES */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            
            {/* Widget Mi Salud */}
            <div className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Mi Salud</h6>
                <span className="small text-white-50">📡</span>
              </div>
              <div className="small text-white-50">
                <p className="mb-1">Última revisión: 05/04/2024</p>
                <p className="mb-1">Presión: 125/80 mmHg</p>
                <p className="mb-0">Peso: 78 kg</p>
              </div>
            </div>

            {/* Widget Notificaciones */}
            <div className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Notificaciones</h6>
                <span className="small text-white-50">🔔</span>
              </div>
              <div className="small d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span>💊</span> <span>Receta próxima a vencer</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span>📅</span> <span>Cita confirmada para el 15 de Mayo</span>
                </div>
              </div>
            </div>

            {/* Widget Mensajes */}
            <div className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white" style={{ backdropFilter: "blur(12px)" }}>
              <h6 className="fw-bold mb-2">Mensajes</h6>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fs-5">👨‍⚕️</span>
                <div>
                  <p className="mb-0 fw-bold small">Dr. Pérez:</p>
                  <p className="mb-0 text-white-50 extra-small">"Hola, ¿cómo se encuentra?"</p>
                </div>
              </div>
              <button className="btn btn-primary w-100 rounded-3 border-0 py-1 small" style={{ background: "#0284c7" }}>Ver mensajes</button>
            </div>

          </div>

        </div>

        {/* PIE DE SEGURIDAD */}
        <div className="text-center mt-5 text-white-50 small">
          <span className="border-top border-white border-opacity-25 pt-2 d-inline-block px-4">
            — Conexión cifrada SSL - Ley 25.128 —
          </span>
        </div>

      </div>
    </div>
  );
};