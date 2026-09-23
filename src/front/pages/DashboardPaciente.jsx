import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

const getToken = () => (
  localStorage.getItem("access_token") || localStorage.getItem("token")
);

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  : "Fecha no disponible";

const formatDateTime = (value) => value
  ? new Date(value).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short"
    })
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
  const { store } = useGlobalReducer();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarRecetas, setMostrarRecetas] = useState(false);
  const [mostrarDiagnosticos, setMostrarDiagnosticos] = useState(false);

  /*
   * Nuevos estados para mostrar el historial completo.
   */
  const [mostrarTodasConsultas, setMostrarTodasConsultas] = useState(false);
  const [mostrarTodasRecetas, setMostrarTodasRecetas] = useState(false);
  const [mostrarTodosDiagnosticos, setMostrarTodosDiagnosticos] = useState(false);

  const [cancelandoConsultaId, setCancelandoConsultaId] = useState(null);
  const [errorCancelacion, setErrorCancelacion] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/paciente/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json"
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "No se pudo cargar tu información."
          );
        }

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center gap-2 text-white-50">
          <div
            className="spinner-border spinner-border-sm text-info"
            role="status"
          >
            <span className="visually-hidden">
              Cargando...
            </span>
          </div>

          Cargando tu información sanitaria...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container text-white py-5">
        <div className="alert alert-danger" role="alert">
          {error || "No se pudo cargar tu información sanitaria."}
        </div>
      </div>
    );
  }

  const patient = dashboard.paciente;
  const consultations = dashboard.consultas || [];
  const diagnoses = dashboard.diagnosticos || [];
  const prescriptions = dashboard.recetas || [];

  const activePrescriptions = prescriptions.filter(
    (item) => item.status === "active"
  );

  const nextConsultation = consultations.find(
    (item) => !["cancelled", "completed"].includes(item.status)
  );

  const profileImage =
    store.user?.profile_image || rigoImageUrl;

  /*
   * ==========================================================
   * MÉDICO DE CABECERA
   * ==========================================================
   */

  const backendAssignedDoctor =
    dashboard.medico_asignado || null;

  const rawAssignedSpecialty =
    backendAssignedDoctor?.especialidad ||
    backendAssignedDoctor?.specialty ||
    backendAssignedDoctor?.especialidad_nombre ||
    "";

  const assignedSpecialty =
    typeof rawAssignedSpecialty === "string"
      ? rawAssignedSpecialty
      : rawAssignedSpecialty?.nombre ||
        rawAssignedSpecialty?.name ||
        "";

  const normalizedAssignedSpecialty = assignedSpecialty
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const isPrimaryCareDoctor = [
    "medicina de familia",
    "medicina familiar y comunitaria",
    "medico de familia",
    "medicina general",
    "medicina familiar",
    "medico de cabecera",
    "medicina de cabecera"
  ].includes(normalizedAssignedSpecialty);

  const assignedDoctor = backendAssignedDoctor;

  /*
   * ==========================================================
   * CONSULTA PENDIENTE
   * ==========================================================
   */

  const hasPendingAssignedDoctorConsultation = assignedDoctor
    ? consultations.some((consultation) => {
        if (
          ["cancelled", "completed"].includes(
            consultation.status
          )
        ) {
          return false;
        }

        if (
          consultation.doctor_id !== undefined &&
          consultation.doctor_id !== null &&
          assignedDoctor.id !== undefined &&
          assignedDoctor.id !== null
        ) {
          return consultation.doctor_id === assignedDoctor.id;
        }

        const rawConsultationSpecialty =
          consultation.doctor_specialty ||
          consultation.especialidad ||
          "";

        const consultationSpecialty =
          typeof rawConsultationSpecialty === "string"
            ? rawConsultationSpecialty
            : rawConsultationSpecialty?.nombre ||
              rawConsultationSpecialty?.name ||
              "";

        const normalizedConsultationSpecialty =
          consultationSpecialty
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        return (
          normalizedConsultationSpecialty ===
          normalizedAssignedSpecialty
        );
      })
    : false;

  const cancelarConsulta = async (appointmentId) => {
    setCancelandoConsultaId(appointmentId);
    setErrorCancelacion("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paciente/consultas/${appointmentId}/cancelar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo cancelar la consulta."
        );
      }

      setDashboard((actual) => ({
        ...actual,
        consultas: (actual.consultas || []).map(
          (consultation) =>
            consultation.id === appointmentId
              ? {
                  ...consultation,
                  status: "cancelled"
                }
              : consultation
        )
      }));
    } catch (cancelError) {
      setErrorCancelacion(cancelError.message);
    } finally {
      setCancelandoConsultaId(null);
    }
  };

  /*
   * ==========================================================
   * ELEMENTOS VISIBLES
   * ==========================================================
   *
   * Por defecto se muestran solamente los 4 más recientes.
   * Si el usuario pulsa "Ver más", se muestran todos.
   */

  const visibleConsultations = mostrarTodasConsultas
    ? consultations
    : consultations.slice(0, 4);

  const visiblePrescriptions = mostrarTodasRecetas
    ? prescriptions
    : prescriptions.slice(0, 4);

  const visibleDiagnoses = mostrarTodosDiagnosticos
    ? diagnoses
    : diagnoses.slice(0, 4);

  return (
    <div className="text-white py-5">
      <div className="container">

        {/* CABECERA */}

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
                Hola, {patient.nombre || "Paciente"}
              </h1>

              <p className="text-white-50 mb-0">
                Información sanitaria actualizada desde tu cuenta.
              </p>
            </div>

          </div>
        </div>

        {/* RESUMEN */}

        <div className="row g-4 mb-4">

          {[
            ["Consultas", consultations.length, "C"],
            ["Recetas activas", activePrescriptions.length, "R"],
            ["Diagnósticos", diagnoses.length, "D"]
          ].map(([label, value, icon]) => (
            <div
              className="col-12 col-md-4"
              key={label}
            >
              <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                <span className="fs-2">
                  {icon}
                </span>

                <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                  {label}
                </p>

                <h2 className="display-6 fw-bold mb-0">
                  {value}
                </h2>

              </div>
            </div>
          ))}

        </div>

        <div className="row g-4">

          {/* PEDIR CONSULTA */}

          <div className="col-12">
            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                <div>
                  <span className="text-info text-uppercase small fw-semibold">
                    Agenda
                  </span>

                  <h2 className="h4 fw-bold mb-1 mt-1">
                    Pedir una consulta
                  </h2>

                  <p className="text-white-50 mb-0">
                    Programa una consulta con tu médico de cabecera.
                  </p>
                </div>

                {assignedDoctor &&
                !hasPendingAssignedDoctorConsultation ? (

                  <Link
                    to="/solicitar-consulta"
                    className="btn btn-info rounded-pill fw-semibold"
                  >
                    Pedir consulta
                  </Link>

                ) : hasPendingAssignedDoctorConsultation ? (

                  <span className="text-danger small fw-semibold">
                    Ya tienes una consulta pendiente con tu médico
                    de cabecera. Cancélala antes de pedir otra.
                  </span>

                ) : (

                  <span className="text-warning small">
                    No tienes médico de cabecera asignado
                  </span>

                )}

              </div>

            </section>
          </div>

          {/* ==================================================
              CONSULTAS
          ================================================== */}

          <div className="col-12 col-lg-7">

            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <span className="text-info text-uppercase small fw-semibold">
                    Agenda
                  </span>

                  <h2 className="h4 fw-bold mb-0 mt-1">
                    Mis consultas
                  </h2>
                </div>

                <span className="badge bg-info bg-opacity-25 text-info border border-info">
                  {consultations.length}
                </span>

              </div>

              {nextConsultation && (
                <div className="border border-info border-opacity-50 rounded-3 p-3 mb-3">

                  <span className="text-info small">
                    Próxima consulta
                  </span>

                  <h3 className="h6 fw-bold mt-1 mb-2">
                    {nextConsultation.appointment_type ||
                      "Consulta médica"}
                  </h3>

                  <p className="text-white mb-2">
                    {formatDateTime(
                      nextConsultation.scheduled_start
                    )}
                  </p>

                  {nextConsultation.modality === "virtual" && (
                    <Link
                      to={`/teleconsulta/${nextConsultation.id}`}
                      className="btn btn-info rounded-pill btn-sm"
                    >
                      Entrar a teleconsulta
                    </Link>
                  )}

                </div>
              )}

              {consultations.length === 0 ? (

                <p className="text-white-50 mb-0">
                  No tienes consultas registradas.
                </p>

              ) : (

                visibleConsultations.map((consultation) => (

                  <div
                    className="border-bottom border-secondary border-opacity-25 py-2 d-flex flex-column align-items-start"
                    key={consultation.id}
                  >

                    <div className="d-flex justify-content-between gap-2">

                      <span className="fw-semibold">
                        {formatDateTime(
                          consultation.scheduled_start
                        )}
                      </span>

                      <span
                        className={`badge ${
                          consultation.status === "completed"
                            ? "bg-success"
                            : consultation.status === "cancelled"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                        }`}
                      >
                        {statusLabels[consultation.status] ||
                          consultation.status}
                      </span>

                    </div>

                    <span className="text-white-50 small">

                      {consultation.modality === "virtual"
                        ? "Virtual"
                        : "Presencial"}

                      {consultation.doctor_specialty &&
                        ` · ${consultation.doctor_specialty}`}

                    </span>

                    {!["cancelled", "completed"].includes(
                      consultation.status
                    ) && (

                      <button
                        type="button"
                        className="btn btn-outline-danger rounded-pill btn-sm mt-3 align-self-start"
                        onClick={() =>
                          cancelarConsulta(consultation.id)
                        }
                        disabled={
                          cancelandoConsultaId ===
                          consultation.id
                        }
                      >
                        {cancelandoConsultaId ===
                        consultation.id
                          ? "Cancelando..."
                          : "Cancelar cita"}
                      </button>

                    )}

                  </div>

                ))
              )}

              {/* VER MÁS CONSULTAS */}

              {consultations.length > 4 && (
                <div className="text-center mt-3">

                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill btn-sm"
                    onClick={() =>
                      setMostrarTodasConsultas(
                        (visible) => !visible
                      )
                    }
                  >
                    {mostrarTodasConsultas
                      ? "Ver menos"
                      : "Ver más"}
                  </button>

                </div>
              )}

              {errorCancelacion && (
                <div className="alert alert-danger mt-3 mb-0">
                  {errorCancelacion}
                </div>
              )}

            </section>

          </div>

          {/* ==================================================
              MÉDICO DE CABECERA + DATOS
          ================================================== */}

          <div className="col-12 col-lg-5">

            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

              <span className="text-info text-uppercase small fw-semibold">
                Atención médica
              </span>

              <h2 className="h4 fw-bold mb-3 mt-1">
                Médico de cabecera
              </h2>

              {assignedDoctor ? (

                <div className="d-flex flex-column gap-2 text-white mb-4">

                  <strong className="text-info fs-5">
                    Dr. {assignedDoctor.nombre}{" "}
                    {assignedDoctor.apellidos}
                  </strong>

                </div>

              ) : (

                <p className="text-white-50 mb-4">
                  No tienes un médico de cabecera asignado actualmente.
                </p>

              )}

              <h3 className="h6 text-info fw-bold mb-3">
                Mis datos
              </h3>

              <div className="d-flex flex-column gap-2 text-white">

                <div>
                  <span className="text-white-50">
                    Email:
                  </span>{" "}
                  {patient.email || "No disponible"}
                </div>

                <div>
                  <span className="text-white-50">
                    Teléfono:
                  </span>{" "}
                  {patient.telefono || "No disponible"}
                </div>

                <div>
                  <span className="text-white-50">
                    CIP:
                  </span>{" "}
                  {patient.cip || "No disponible"}
                </div>

                <div>
                  <span className="text-white-50">
                    Nacimiento:
                  </span>{" "}
                  {formatDate(patient.fecha_nacimiento)}
                </div>

                <div>
                  <span className="text-white-50">
                    Grupo sanguíneo:
                  </span>{" "}
                  {patient.grupo_sanguineo ||
                    "No disponible"}
                </div>

              </div>

            </section>

          </div>

          {/* ==================================================
              RECETAS
          ================================================== */}

          <div className="col-12 col-lg-6">

            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h2 className="h4 fw-bold mb-0">
                  Recetas electrónicas
                </h2>

                <span className="badge bg-info bg-opacity-25 text-info border border-info">
                  {prescriptions.length}
                </span>

              </div>

              <button
                type="button"
                className="btn btn-outline-info rounded-pill btn-sm mb-3"
                onClick={() =>
                  setMostrarRecetas((visible) => !visible)
                }
              >
                {mostrarRecetas
                  ? "Ocultar recetas"
                  : "Ver recetas"}
              </button>

              {!mostrarRecetas ? null : prescriptions.length === 0 ? (

                <p className="text-white-50 mb-0">
                  No tienes recetas registradas.
                </p>

              ) : (

                visiblePrescriptions.map((prescription) => (

                  <div
                    className="border-bottom border-secondary border-opacity-25 py-2"
                    key={prescription.id}
                  >

                    <div className="d-flex justify-content-between gap-2">

                      <strong>
                        {prescription.medications?.[0]?.name ||
                          "Medicamento"}
                      </strong>

                      <span
                        className={`badge ${
                          prescription.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {statusLabels[prescription.status] ||
                          prescription.status}
                      </span>

                    </div>

                    <span className="text-white-50 small">
                      {prescription.medications?.[0]?.dosage ||
                        "Dosis no indicada"}{" "}
                      ·{" "}
                      {formatDate(
                        prescription.issued_at
                      )}
                    </span>

                  </div>

                ))
              )}

              {/* VER MÁS RECETAS */}

              {mostrarRecetas && prescriptions.length > 4 && (
                <div className="text-center mt-3">

                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill btn-sm"
                    onClick={() =>
                      setMostrarTodasRecetas(
                        (visible) => !visible
                      )
                    }
                  >
                    {mostrarTodasRecetas
                      ? "Ver menos"
                      : "Ver más"}
                  </button>

                </div>
              )}

            </section>

          </div>

          {/* ==================================================
              DIAGNÓSTICOS
          ================================================== */}

          <div className="col-12 col-lg-6">

            <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h2 className="h4 fw-bold mb-0">
                  Diagnósticos
                </h2>

                <span className="badge bg-info bg-opacity-25 text-info border border-info">
                  {diagnoses.length}
                </span>

              </div>

              <button
                type="button"
                className="btn btn-outline-info rounded-pill btn-sm mb-3"
                onClick={() =>
                  setMostrarDiagnosticos(
                    (visible) => !visible
                  )
                }
              >
                {mostrarDiagnosticos
                  ? "Ocultar enfermedades"
                  : "Ver enfermedades"}
              </button>

              {!mostrarDiagnosticos ? null : diagnoses.length === 0 ? (

                <p className="text-white-50 mb-0">
                  No tienes enfermedades registradas.
                </p>

              ) : (

                visibleDiagnoses.map((diagnosis) => (

                  <div
                    className="border-bottom border-secondary border-opacity-25 py-2"
                    key={diagnosis.id}
                  >

                    <div className="d-flex justify-content-between gap-2">

                      <strong>
                        {diagnosis.nombre}
                      </strong>

                      <span className="badge bg-warning text-dark">
                        {diagnosis.estado}
                      </span>

                    </div>

                    <span className="text-white-50 small">
                      {formatDate(diagnosis.fecha)}
                    </span>

                  </div>

                ))
              )}

              {/* VER MÁS DIAGNÓSTICOS */}

              {mostrarDiagnosticos && diagnoses.length > 4 && (
                <div className="text-center mt-3">

                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill btn-sm"
                    onClick={() =>
                      setMostrarTodosDiagnosticos(
                        (visible) => !visible
                      )
                    }
                  >
                    {mostrarTodosDiagnosticos
                      ? "Ver menos"
                      : "Ver más"}
                  </button>

                </div>
              )}

            </section>

          </div>

        </div>
      </div>
    </div>
  );
};