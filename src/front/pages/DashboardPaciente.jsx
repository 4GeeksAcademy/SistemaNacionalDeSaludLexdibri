import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const DashboardPaciente = () => {
  const { store } = useGlobalReducer();
  const user = store.user;
  const profileImage = user?.profile_image || rigoImageUrl;

  return (
    <div className="text-white py-5">
      <div className="container">

        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            <img
              src={profileImage}
              alt="Foto de perfil"
              className="rounded-circle"
              width="64"
              height="64"
            />

            <div>
              <span className="text-info small text-uppercase">
                Área personal
              </span>

              <h1 className="h3 fw-bold mb-1">
                Hola, {user?.first_name || "Miguel"} 👋
              </h1>

              <p className="text-white-50 mb-0">
                Aquí tienes un resumen de tu información sanitaria.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">

          <div className="col-12 col-md-6 col-lg-4">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="fs-2 mb-3">📅</div>

              <span className="text-info small text-uppercase">
                Próxima cita
              </span>

              <h2 className="h4 fw-bold mt-2">
                Citas médicas
              </h2>

              <p className="text-white-50">
                15 de Mayo · 10:00 AM
              </p>

              <button className="btn btn-info rounded-pill w-100">
                Ver citas
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="fs-2 mb-3">💊</div>

              <span className="text-info small text-uppercase">
                Tratamiento
              </span>

              <h2 className="h4 fw-bold mt-2">
                Recetas electrónicas
              </h2>

              <p className="text-white-50">
                2 recetas activas
              </p>

              <button className="btn btn-info rounded-pill w-100">
                Ver recetas
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="fs-2 mb-3">🔬</div>

              <span className="text-info small text-uppercase">
                Información clínica
              </span>

              <h2 className="h4 fw-bold mt-2">
                Diagnósticos
              </h2>

              <p className="text-white-50">
                Hipertensión · Diabetes Tipo 2
              </p>

              <button className="btn btn-info rounded-pill w-100">
                Ver diagnósticos
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="fs-2 mb-3">📁</div>

              <span className="text-info small text-uppercase">
                Historial
              </span>

              <h2 className="h4 fw-bold mt-2">
                Historial médico
              </h2>

              <p className="text-white-50">
                Consulta toda tu información clínica.
              </p>

              <button className="btn btn-info rounded-pill w-100">
                Ver historial
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">
                  Mi salud
                </h2>

                <span className="fs-4">📡</span>
              </div>

              <div className="border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between py-3 border-bottom border-secondary border-opacity-25">
                  <span className="text-white-50">
                    Última revisión
                  </span>
                  <strong>05/04/2024</strong>
                </div>

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary border-opacity-25">
                  <span className="text-white-50">
                    Presión arterial
                  </span>
                  <strong>125/80 mmHg</strong>
                </div>

                <div className="d-flex justify-content-between py-3">
                  <span className="text-white-50">
                    Peso
                  </span>
                  <strong>78 kg</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">
                  Notificaciones
                </h2>

                <span className="fs-4">🔔</span>
              </div>

              <div className="d-flex gap-3 mb-3">
                <span>💊</span>
                <span className="text-white-50 small">
                  Receta próxima a vencer
                </span>
              </div>

              <div className="d-flex gap-3">
                <span>📅</span>
                <span className="text-white-50 small">
                  Cita confirmada para el 15 de Mayo
                </span>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">
                  Mensajes
                </h2>

                <span className="fs-4">💬</span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fs-2">👨‍⚕️</span>

                <div>
                  <strong className="d-block">
                    Dr. Pérez
                  </strong>

                  <span className="text-white-50 small">
                    "Hola, ¿cómo se encuentra?"
                  </span>
                </div>
              </div>

              <button className="btn btn-info rounded-pill">
                Ver mensajes
              </button>
            </div>
          </div>

        </div>

        <div className="text-center border-top border-secondary border-opacity-25 mt-5 pt-4">
          <span className="text-white-50 small">
            🔒 Conexión cifrada SSL · Información sanitaria protegida
          </span>
        </div>

      </div>
    </div>
  );
};