import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

const getToken = () => (
  localStorage.getItem("access_token") || localStorage.getItem("token")
);

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
  : "Fecha no disponible";

const formatDateTime = (value) => value
  ? new Date(value).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })
  : "Fecha no disponible";

const statusLabels = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  active: "Activa",
  expired: "Caducada"
};

export const DashboardPaciente = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const user = store.user;
  const profileImage = user?.profile_image || rigoImageUrl;

  // Función genérica para obtener datos del backend y almacenar en el estado global
  const handleFetchData = async (endpoint, redirectPath) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.token || localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar información en el store global según corresponda
      dispatch({
        type: "SET_PACIENTE_DATA",
        payload: { key: endpoint, data }
      });

      // Navegar a la ruta destino
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error(`Error al conectar con el backend (${endpoint}):`, error);
      // Opcional: Navegar incluso si falla la petición directa
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  };

  return (
    <div className="text-white py-5">
      <div className="container">
        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            <img src={profileImage} alt="Foto de perfil" className="rounded-circle" width="64" height="64" />
            <div>
              <span className="text-info small text-uppercase">Área personal</span>
              <h1 className="h3 fw-bold mb-1">Hola, {patient.nombre || "Paciente"}</h1>
              <p className="text-white-50 mb-0">Información sanitaria actualizada desde tu cuenta.</p>
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

              <button 
                className="btn btn-info rounded-pill w-100"
                onClick={() => handleFetchData("citas", "/citas")}
              >
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

              <button 
                className="btn btn-info rounded-pill w-100"
                onClick={() => handleFetchData("recetas", "/recetas")}
              >
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

              <button 
                className="btn btn-info rounded-pill w-100"
                onClick={() => handleFetchData("diagnosticos", "/diagnosticos")}
              >
                Ver diagnósticos
              </button>
            </div>
          ))}
        </div>

              <button 
                className="btn btn-info rounded-pill w-100"
                onClick={() => handleFetchData("historial", "/historial")}
              >
                Ver historial
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="text-info text-uppercase small fw-semibold">Agenda</span>
                  <h2 className="h4 fw-bold mb-0 mt-1">Mis consultas</h2>
                </div>
                <span className="badge bg-info bg-opacity-25 text-info border border-info">{consultations.length}</span>
              </div>

              {nextConsultation && (
                <div className="border border-info border-opacity-50 rounded-3 p-3 mb-3">
                  <span className="text-info small">Próxima consulta</span>
                  <h3 className="h6 fw-bold mt-1 mb-2">{nextConsultation.appointment_type || "Consulta médica"}</h3>
                  <p className="text-white mb-2">{formatDateTime(nextConsultation.scheduled_start)}</p>
                  {nextConsultation.modality === "virtual" && (
                    <Link to={`/teleconsulta/${nextConsultation.id}`} className="btn btn-info rounded-pill btn-sm">
                      Entrar a teleconsulta
                    </Link>
                  )}
                </div>
              )}

              {consultations.length === 0 ? (
                <p className="text-white-50 mb-0">No tienes consultas registradas.</p>
              ) : consultations.slice(0, 5).map((consultation) => (
                <div className="border-bottom border-secondary border-opacity-25 py-2 d-flex flex-column align-items-start" key={consultation.id}>
                  <div className="d-flex justify-content-between gap-2">
                    <span className="fw-semibold">{formatDateTime(consultation.scheduled_start)}</span>
                    <span className={`badge ${consultation.status === "completed" ? "bg-success" : consultation.status === "cancelled" ? "bg-danger" : "bg-warning text-dark"}`}>
                      {statusLabels[consultation.status] || consultation.status}
                    </span>
                  </div>
                  <span className="text-white-50 small">
                    {consultation.modality === "virtual" ? "Virtual" : "Presencial"}
                    {consultation.doctor_specialty && ` · ${consultation.doctor_specialty}`}
                  </span>
                  {!['cancelled', 'completed'].includes(consultation.status) && (
                    <button
                      type="button"
                      className="btn btn-outline-danger rounded-pill btn-sm mt-3 align-self-start"
                      onClick={() => cancelarConsulta(consultation.id)}
                      disabled={cancelandoConsultaId === consultation.id}
                    >
                      {cancelandoConsultaId === consultation.id ? "Cancelando..." : "Cancelar cita"}
                    </button>
                  )}
                </div>
              ))}
              {errorCancelacion && <div className="alert alert-danger mt-3 mb-0">{errorCancelacion}</div>}
            </section>
          </div>

          <div className="col-12 col-lg-5">
            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <span className="text-info text-uppercase small fw-semibold">Atención médica</span>
              <h2 className="h4 fw-bold mb-3 mt-1">Médico asignado</h2>
              {assignedDoctor ? (
                <div className="d-flex flex-column gap-2 text-white">
                  <strong className="text-info fs-5">
                    Dr. {assignedDoctor.nombre} {assignedDoctor.apellidos}
                  </strong>
                </div>
              ) : (
                <p className="text-white-50 mb-0">No tienes un médico asignado actualmente.</p>
              )}
              <h3 className="h6 text-info fw-bold mb-3">Mis datos</h3>
              <div className="d-flex flex-column gap-2 text-white">
                <div><span className="text-white-50">Email:</span> {patient.email || "No disponible"}</div>
                <div><span className="text-white-50">Teléfono:</span> {patient.telefono || "No disponible"}</div>
                <div><span className="text-white-50">CIP:</span> {patient.cip || "No disponible"}</div>
                <div><span className="text-white-50">Nacimiento:</span> {formatDate(patient.fecha_nacimiento)}</div>
                <div><span className="text-white-50">Grupo sanguíneo:</span> {patient.grupo_sanguineo || "No disponible"}</div>
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-6">
            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold mb-0">Recetas electrónicas</h2>
                <span className="badge bg-info bg-opacity-25 text-info border border-info">{prescriptions.length}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-info rounded-pill btn-sm mb-3"
                onClick={() => setMostrarRecetas((visible) => !visible)}
              >
                {mostrarRecetas ? "Ocultar recetas" : "Ver recetas"}
              </button>
              {!mostrarRecetas ? null : prescriptions.length === 0 ? <p className="text-white-50 mb-0">No tienes recetas registradas.</p> : prescriptions.slice(0, 4).map((prescription) => (
                <div className="border-bottom border-secondary border-opacity-25 py-2" key={prescription.id}>
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{prescription.medications?.[0]?.name || "Medicamento"}</strong>
                    <span className={`badge ${prescription.status === "active" ? "bg-success" : "bg-secondary"}`}>
                      {statusLabels[prescription.status] || prescription.status}
                    </span>
                  </div>
                  <span className="text-white-50 small">{prescription.medications?.[0]?.dosage || "Dosis no indicada"} · {formatDate(prescription.issued_at)}</span>
                </div>
              ))}
            </section>
          </div>

          <div className="col-12 col-lg-6">
            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold mb-0">Diagnósticos</h2>
                <span className="badge bg-info bg-opacity-25 text-info border border-info">{diagnoses.length}</span>
              </div>

              <button 
                className="btn btn-info rounded-pill"
                onClick={() => handleFetchData("mensajes", "/mensajes")}
              >
                Ver mensajes
              </button>
              {!mostrarDiagnosticos ? null : diagnoses.length === 0 ? <p className="text-white-50 mb-0">No tienes enfermedades registradas.</p> : diagnoses.slice(0, 4).map((diagnosis) => (
                <div className="border-bottom border-secondary border-opacity-25 py-2" key={diagnosis.id}>
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{diagnosis.nombre}</strong>
                    <span className="badge bg-warning text-dark">{diagnosis.estado}</span>
                  </div>
                  <span className="text-white-50 small">{formatDate(diagnosis.fecha)}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
