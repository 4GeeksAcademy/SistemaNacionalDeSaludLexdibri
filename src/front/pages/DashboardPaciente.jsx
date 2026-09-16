import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const DashboardPaciente = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  
  // OPCIÓN 1: Icono neutro vectorial en SVG con temática médica/paciente
  const defaultProfileImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230dcaf0'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-.85-5.05-2.2.03-1.68 3.37-2.6 5.05-2.6s5.02.92 5.05 2.6C15.8 19.15 14.03 20 12 20z'/></svg>";

  // OPCIÓN 2 (Alternativa dinámica): Iniciales del paciente sobre fondo cyan sanitario
  // const userInitial = user?.first_name ? user.first_name.charAt(0).toUpperCase() : "P";
  // const defaultProfileImage = `https://ui-avatars.com/api/?name=${userInitial}&background=0dcaf0&color=000&size=128&bold=true`;

  const profileImage = user?.profile_image || defaultProfileImage;

  return (
    <div className="dashboard-paciente-page py-4 bg-dark text-white min-vh-100">
      <section className="dashboard-paciente-section">
        <div className="container">

          {/* BIENVENIDA */}
          <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3 shadow-sm">
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="rounded-circle object-fit-cover flex-shrink-0 bg-dark p-1 border border-info border-opacity-50"
                  style={{ width: "64px", height: "64px" }}
                />
              </div>
              <div>
                <span className="text-info small d-block mb-1 fw-semibold">
                  Área personal sanitaria
                </span>
                <h2 className="m-0 fw-bold fs-3 text-white">
                  Hola, {user?.first_name || "Paciente"} 👋
                </h2>
                <p className="m-0 text-white-50 small">
                  Aquí tienes un resumen de tu información clínica y citas.
                </p>
              </div>
            </div>

            <div className="bg-success bg-opacity-25 text-success border border-success px-3 py-1 rounded-pill small">
              Cuenta activa
            </div>
          </div>

          <div className="row g-4">

            {/* COLUMNA PRINCIPAL */}
            <div className="col-12 col-lg-8">
              <div className="row g-4">

                {/* CITAS */}
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100 d-flex flex-column shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="fs-5">📅</span>
                      <span className="text-white-50 small">Próxima cita</span>
                    </div>
                    <h3 className="h5 fw-bold text-white mb-2">Citas médicas</h3>
                    <p className="text-white-50 mb-4 flex-grow-1">15 de Mayo · 10:00 AM</p>
                    <button className="btn btn-info text-dark fw-semibold w-100 mt-auto shadow-none">
                      Ver citas
                    </button>
                  </div>
                </div>

                {/* RECETAS */}
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100 d-flex flex-column shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="fs-5">💊</span>
                      <span className="text-white-50 small">Tratamiento</span>
                    </div>
                    <h3 className="h5 fw-bold text-white mb-2">Recetas electrónicas</h3>
                    <p className="text-white-50 mb-4 flex-grow-1">2 recetas activas</p>
                    <button className="btn btn-info text-dark fw-semibold w-100 mt-auto shadow-none">
                      Ver recetas
                    </button>
                  </div>
                </div>

                {/* DIAGNÓSTICOS */}
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100 d-flex flex-column shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="fs-5">🔬</span>
                      <span className="text-white-50 small">Información clínica</span>
                    </div>
                    <h3 className="h5 fw-bold text-white mb-2">Diagnósticos</h3>
                    <p className="text-white-50 mb-4 flex-grow-1">Hipertensión · Diabetes Tipo 2</p>
                    <button className="btn btn-info text-dark fw-semibold w-100 mt-auto shadow-none">
                      Ver diagnósticos
                    </button>
                  </div>
                </div>

                {/* HISTORIAL */}
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 h-100 d-flex flex-column shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="fs-5">📁</span>
                      <span className="text-white-50 small">Historial</span>
                    </div>
                    <h3 className="h5 fw-bold text-white mb-2">Historial médico</h3>
                    <p className="text-white-50 mb-4 flex-grow-1">Consulta toda tu información clínica.</p>
                    <button className="btn btn-info text-dark fw-semibold w-100 mt-auto shadow-none">
                      Ver historial
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMNA LATERAL */}
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column gap-4">

                {/* MI SALUD */}
                <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                    <h3 className="h5 m-0 text-white fw-bold">Mi salud</h3>
                    <span>📡</span>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                      <span className="text-white-50 small">Última revisión</span>
                      <strong className="text-white">05/04/2024</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                      <span className="text-white-50 small">Presión arterial</span>
                      <strong className="text-white">125/80 mmHg</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                      <span className="text-white-50 small">Peso</span>
                      <strong className="text-white">78 kg</strong>
                    </div>
                  </div>
                </div>

                {/* NOTIFICACIONES */}
                <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                    <h3 className="h5 m-0 text-white fw-bold">Notificaciones</h3>
                    <span>🔔</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2 py-1">
                      <span>💊</span>
                      <p className="m-0 small text-white-50">Receta próxima a vencer</p>
                    </div>
                    <div className="d-flex align-items-center gap-2 py-1">
                      <span>📅</span>
                      <p className="m-0 small text-white-50">Cita confirmada para el 15 de Mayo</p>
                    </div>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="p-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                    <h3 className="h5 m-0 text-white fw-bold">Mensajes</h3>
                    <span>💬</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="fs-4">👨‍⚕️</div>
                    <div>
                      <strong className="d-block small text-white">Dr. Pérez</strong>
                      <p className="m-0 small text-white-50">"Hola, ¿cómo se encuentra?"</p>
                    </div>
                  </div>
                  <button className="btn btn-info text-dark fw-semibold w-100 shadow-none">
                    Ver mensajes
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* SEGURIDAD */}
          <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25 text-white-50 small">
            🔒 Conexión cifrada SSL · Sistema Nacional de Salud LEXDIBRI
          </div>

        </div>
      </section>
    </div>
  );
};