import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const DashboardPaciente = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  const profileImage = user?.profile_image || rigoImageUrl;

  return (
    <div className="dashboard-paciente-page py-4">

      {/* ESTILOS DE ESPACIADO Y ESTRUCTURA */}
      <style>{`
        .dashboard-paciente-profile-image {
          width: 64px;
          height: 64px;
          min-width: 64px;
          min-height: 64px;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          display: block;
        }

        /* RELLENO INTERNO Y ESPACIADO EN TARJETAS */
        .glass-card {
          padding: 1.5rem !important;
          border-radius: 12px;
        }

        .dashboard-paciente-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dashboard-paciente-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .dashboard-paciente-card h3 {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .dashboard-paciente-card p {
          flex-grow: 1;
          margin-bottom: 1.25rem;
          opacity: 0.85;
        }

        /* BOTONES DE LAS TARJETAS */
        .dashboard-paciente-button {
          margin-top: auto;
          width: 100%;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background-color: #ffffff;
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .dashboard-paciente-button:hover {
          background-color: #f8f9fa;
        }

        /* FILAS Y SIDEBAR */
        .dashboard-paciente-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-paciente-widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dashboard-paciente-health-list > div {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .dashboard-paciente-notifications > div {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .dashboard-paciente-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <section className="dashboard-paciente-section">
        <div className="container">

          {/* BIENVENIDA */}
          <div className="dashboard-paciente-welcome glass-card mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="dashboard-paciente-user d-flex align-items-center gap-3">
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="dashboard-paciente-profile-image"
              />
              <div>
                <span className="dashboard-paciente-eyebrow text-muted small d-block mb-1">
                  Área personal
                </span>
                <h2 className="m-0 fw-bold">
                  Hola, {user?.first_name || "Miguel"} 👋
                </h2>
                <p className="m-0 text-muted small">
                  Aquí tienes un resumen de tu información sanitaria.
                </p>
              </div>
            </div>

            <div className="dashboard-paciente-status bg-success bg-opacity-25 text-success border border-success px-3 py-1 rounded-pill small">
              Cuenta activa
            </div>
          </div>

          <div className="row g-4">

            {/* COLUMNA PRINCIPAL */}
            <div className="col-12 col-lg-8">
              <div className="row g-4">

                {/* CITAS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">
                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">📅</div>
                      <span className="dashboard-paciente-card-label text-muted small">
                        Próxima cita
                      </span>
                    </div>
                    <h3>Citas médicas</h3>
                    <p>15 de Mayo · 10:00 AM</p>
                    <button className="dashboard-paciente-button">
                      Ver citas
                    </button>
                  </div>
                </div>

                {/* RECETAS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">
                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">💊</div>
                      <span className="dashboard-paciente-card-label text-muted small">
                        Tratamiento
                      </span>
                    </div>
                    <h3>Recetas electrónicas</h3>
                    <p>2 recetas activas</p>
                    <button className="dashboard-paciente-button">
                      Ver recetas
                    </button>
                  </div>
                </div>

                {/* DIAGNÓSTICOS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">
                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">🔬</div>
                      <span className="dashboard-paciente-card-label text-muted small">
                        Información clínica
                      </span>
                    </div>
                    <h3>Diagnósticos</h3>
                    <p>Hipertensión · Diabetes Tipo 2</p>
                    <button className="dashboard-paciente-button">
                      Ver diagnósticos
                    </button>
                  </div>
                </div>

                {/* HISTORIAL */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">
                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">📁</div>
                      <span className="dashboard-paciente-card-label text-muted small">
                        Historial
                      </span>
                    </div>
                    <h3>Historial médico</h3>
                    <p>Consulta toda tu información clínica.</p>
                    <button className="dashboard-paciente-button">
                      Ver historial
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMNA LATERAL */}
            <div className="col-12 col-lg-4">
              <div className="dashboard-paciente-sidebar">

                {/* MI SALUD */}
                <div className="dashboard-paciente-widget glass-card">
                  <div className="dashboard-paciente-widget-header">
                    <h3 className="h5 m-0">Mi salud</h3>
                    <span>📡</span>
                  </div>
                  <div className="dashboard-paciente-health-list">
                    <div>
                      <span className="text-muted small">Última revisión</span>
                      <strong>05/04/2024</strong>
                    </div>
                    <div>
                      <span className="text-muted small">Presión arterial</span>
                      <strong>125/80 mmHg</strong>
                    </div>
                    <div>
                      <span className="text-muted small">Peso</span>
                      <strong>78 kg</strong>
                    </div>
                  </div>
                </div>

                {/* NOTIFICACIONES */}
                <div className="dashboard-paciente-widget glass-card">
                  <div className="dashboard-paciente-widget-header">
                    <h3 className="h5 m-0">Notificaciones</h3>
                    <span>🔔</span>
                  </div>
                  <div className="dashboard-paciente-notifications">
                    <div>
                      <span>💊</span>
                      <p className="m-0 small">Receta próxima a vencer</p>
                    </div>
                    <div>
                      <span>📅</span>
                      <p className="m-0 small">Cita confirmada para el 15 de Mayo</p>
                    </div>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="dashboard-paciente-widget glass-card">
                  <div className="dashboard-paciente-widget-header">
                    <h3 className="h5 m-0">Mensajes</h3>
                    <span>💬</span>
                  </div>
                  <div className="dashboard-paciente-message">
                    <div className="dashboard-paciente-message-icon fs-4">👨‍⚕️</div>
                    <div>
                      <strong className="d-block small">Dr. Pérez</strong>
                      <p className="m-0 small text-muted">"Hola, ¿cómo se encuentra?"</p>
                    </div>
                  </div>
                  <button className="dashboard-paciente-button">
                    Ver mensajes
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* SEGURIDAD */}
          <div className="dashboard-paciente-security text-center mt-4 pt-3 border-top border-secondary text-muted small">
            🔒 Conexión cifrada SSL · Información sanitaria protegida
          </div>

        </div>
      </section>
    </div>
  );
};