import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const DashboardPaciente = () => {
  const { store } = useGlobalReducer();

  const user = store.user;

  const profileImage = user?.profile_image || rigoImageUrl;

  return (
    <div className="dashboard-paciente-page">

      {/* ESTILO IMAGEN DE PERFIL (tamaño fijo) + TARJETAS A LA MISMA ALTURA */}
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

        .dashboard-paciente-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dashboard-paciente-card h3 {
          margin-bottom: 0.5rem;
        }

        .dashboard-paciente-card p {
          flex-grow: 1;
        }

        .dashboard-paciente-card .dashboard-paciente-button {
          margin-top: auto;
        }

        .dashboard-paciente-main-row {
          align-items: stretch;
        }

        .col-12.col-lg-8 {
          display: flex;
        }

        .dashboard-paciente-cards-row {
          width: 100%;
          align-content: space-between;
        }
      `}</style>

      {/* DASHBOARD */}
      <section className="dashboard-paciente-section">
        <div className="container">

          {/* BIENVENIDA */}
          <div className="dashboard-paciente-welcome glass-card">

            <div className="dashboard-paciente-user">

              <img
                src={profileImage}
                alt="Foto de perfil"
                className="dashboard-paciente-profile-image"
              />

              <div>
                <span className="dashboard-paciente-eyebrow">
                  Área personal
                </span>

                <h2>
                  Hola, {user?.first_name || "paciente"} 👋
                </h2>

                <p>
                  Aquí tienes un resumen de tu información sanitaria.
                </p>
              </div>

            </div>

            <div className="dashboard-paciente-status">
              <span></span>
              Cuenta activa
            </div>

          </div>

          <div className="row g-4 dashboard-paciente-main-row">

            {/* COLUMNA PRINCIPAL */}
            <div className="col-12 col-lg-8">

              <div className="row g-4 dashboard-paciente-cards-row">

                {/* CITAS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">

                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">
                        📅
                      </div>

                      <span className="dashboard-paciente-card-label">
                        Próxima cita
                      </span>
                    </div>

                    <h3>Citas médicas</h3>

                    <p>
                      15 de Mayo · 10:00 AM
                    </p>

                    <button className="dashboard-paciente-button">
                      Ver citas
                    </button>

                  </div>
                </div>

                {/* RECETAS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">

                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">
                        💊
                      </div>

                      <span className="dashboard-paciente-card-label">
                        Tratamiento
                      </span>
                    </div>

                    <h3>Recetas electrónicas</h3>

                    <p>
                      2 recetas activas
                    </p>

                    <button className="dashboard-paciente-button">
                      Ver recetas
                    </button>

                  </div>
                </div>

                {/* DIAGNÓSTICOS */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">

                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">
                        🔬
                      </div>

                      <span className="dashboard-paciente-card-label">
                        Información clínica
                      </span>
                    </div>

                    <h3>Diagnósticos</h3>

                    <p>
                      Hipertensión · Diabetes Tipo 2
                    </p>

                    <button className="dashboard-paciente-button">
                      Ver diagnósticos
                    </button>

                  </div>
                </div>

                {/* HISTORIAL */}
                <div className="col-12 col-md-6">
                  <div className="dashboard-paciente-card glass-card">

                    <div className="dashboard-paciente-card-header">
                      <div className="dashboard-paciente-card-icon">
                        📁
                      </div>

                      <span className="dashboard-paciente-card-label">
                        Historial
                      </span>
                    </div>

                    <h3>Historial médico</h3>

                    <p>
                      Consulta toda tu información clínica.
                    </p>

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
                    <h3>Mi salud</h3>
                    <span>📡</span>
                  </div>

                  <div className="dashboard-paciente-health-list">

                    <div>
                      <span>Última revisión</span>
                      <strong>05/04/2024</strong>
                    </div>

                    <div>
                      <span>Presión arterial</span>
                      <strong>125/80 mmHg</strong>
                    </div>

                    <div>
                      <span>Peso</span>
                      <strong>78 kg</strong>
                    </div>

                  </div>

                </div>

                {/* NOTIFICACIONES */}
                <div className="dashboard-paciente-widget glass-card">

                  <div className="dashboard-paciente-widget-header">
                    <h3>Notificaciones</h3>
                    <span>🔔</span>
                  </div>

                  <div className="dashboard-paciente-notifications">

                    <div>
                      <span>💊</span>
                      <p>
                        Receta próxima a vencer
                      </p>
                    </div>

                    <div>
                      <span>📅</span>
                      <p>
                        Cita confirmada para el 15 de Mayo
                      </p>
                    </div>

                  </div>

                </div>

                {/* MENSAJES */}
                <div className="dashboard-paciente-widget glass-card">

                  <div className="dashboard-paciente-widget-header">
                    <h3>Mensajes</h3>
                    <span>💬</span>
                  </div>

                  <div className="dashboard-paciente-message">

                    <div className="dashboard-paciente-message-icon">
                      👨‍⚕️
                    </div>

                    <div>
                      <strong>Dr. Pérez</strong>

                      <p>
                        "Hola, ¿cómo se encuentra?"
                      </p>
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
          <div className="dashboard-paciente-security">
            <span>🔒</span>
            Conexión cifrada SSL · Información sanitaria protegida
          </div>

        </div>
      </section>

    </div>
  );
};