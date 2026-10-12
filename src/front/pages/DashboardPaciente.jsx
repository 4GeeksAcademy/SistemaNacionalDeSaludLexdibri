import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { FeedbackModal } from "../components/FeedbackModal";
import { Icon } from "../components/Icon";

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
  ? new Date(
      /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`
    ).toLocaleString("es-ES", {
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

  const [mostrarTodasConsultas, setMostrarTodasConsultas] = useState(false);
  const [mostrarTodasRecetas, setMostrarTodasRecetas] = useState(false);
  const [mostrarTodosDiagnosticos, setMostrarTodosDiagnosticos] = useState(false);

  const [cancelandoConsultaId, setCancelandoConsultaId] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });
  const [editandoDatos, setEditandoDatos] = useState(false);
  const [emailEditado, setEmailEditado] = useState("");
  const [telefonoEditado, setTelefonoEditado] = useState("");
  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");
  const [exitoDatos, setExitoDatos] = useState("");
  const [mostrarPrivacidad, setMostrarPrivacidad] = useState(false);
  const [guardandoPrivacidad, setGuardandoPrivacidad] = useState(false);
  const [errorPrivacidad, setErrorPrivacidad] = useState("");
  const [exitoPrivacidad, setExitoPrivacidad] = useState("");
  const [alcancePrivacidad, setAlcancePrivacidad] = useState("national");
  const [restringirInformesSensibles, setRestringirInformesSensibles] =
    useState(false);
  const [notificarAccesos, setNotificarAccesos] = useState(false);
  const [notificationToReport, setNotificationToReport] = useState(null);
  const [reportDescription, setReportDescription] = useState("");
  const [sendingReport, setSendingReport] = useState(false);
  const [reportError, setReportError] = useState("");
  const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(4);

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
          const privacy = data.preferencias_privacidad || {};
          setAlcancePrivacidad(
            privacy.access_scope === "hospital" ? "hospital" : "national"
          );
          setRestringirInformesSensibles(
            privacy.restrict_sensitive_records === true ||
              privacy.access_scope === "national-restricted"
          );
          setNotificarAccesos(privacy.notify_accesses === true);
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
        <p>No se pudo cargar tu información sanitaria.</p>
        <button
          type="button"
          className="btn btn-outline-info rounded-pill"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
        <FeedbackModal
          message={error}
          type="danger"
          onClose={() => setError("")}
        />
      </div>
    );
  }

  const patient = dashboard.paciente;
  const consultations = dashboard.consultas || [];
  const diagnoses = dashboard.diagnosticos || [];
  const prescriptions = dashboard.recetas || [];
  const notifications = dashboard.notificaciones || [];

  const activePrescriptions = prescriptions.filter(
    (item) => item.status === "active"
  );

  const nextConsultation = consultations.find(
    (item) => !["cancelled", "completed"].includes(item.status)
  );

  const profileImage =
    store.user?.profile_image || rigoImageUrl;

  const iniciarEdicionDatos = () => {
    setEmailEditado(patient.email || "");
    setTelefonoEditado(patient.telefono || "");
    setErrorDatos("");
    setExitoDatos("");
    setEditandoDatos(true);
  };

  const guardarDatos = async (event) => {
    event.preventDefault();
    setGuardandoDatos(true);
    setErrorDatos("");
    setExitoDatos("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paciente/perfil`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: emailEditado,
            telefono: telefonoEditado
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudieron actualizar tus datos."
        );
      }

      setDashboard((current) => ({
        ...current,
        paciente: {
          ...current.paciente,
          email: data.email,
          telefono: data.telefono
        }
      }));
      setEditandoDatos(false);
      setExitoDatos(data.message);
    } catch (saveError) {
      setErrorDatos(saveError.message);
    } finally {
      setGuardandoDatos(false);
    }
  };

  const guardarPrivacidad = async () => {
    setGuardandoPrivacidad(true);
    setErrorPrivacidad("");
    setExitoPrivacidad("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paciente/privacidad`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            access_scope: alcancePrivacidad,
            restrict_sensitive_records: restringirInformesSensibles,
            notify_accesses: notificarAccesos
          })
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar tu configuración de privacidad."
        );
      }

      setDashboard((current) => ({
        ...current,
        preferencias_privacidad: data.privacy_settings
      }));
      setExitoPrivacidad("Tu configuración de privacidad se ha guardado.");
    } catch (saveError) {
      setErrorPrivacidad(saveError.message);
    } finally {
      setGuardandoPrivacidad(false);
    }
  };

  const denunciarAcceso = async (event) => {
    event.preventDefault();
    if (!notificationToReport) return;

    setSendingReport(true);
    setReportError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paciente/notificaciones/${notificationToReport.id}/denunciar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            description: reportDescription.trim()
          })
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo registrar la denuncia."
        );
      }

      setDashboard((current) => ({
        ...current,
        notificaciones: current.notificaciones.map((notification) =>
          notification.id === notificationToReport.id
            ? { ...notification, denuncia: {
                id: data.report.id,
                descripcion: data.report.description,
                estado: data.report.status,
                fecha: data.report.created_at
              } }
            : notification
        )
      }));
      setNotificationToReport(null);
      setReportDescription("");
    } catch (submitError) {
      setReportError(submitError.message);
    } finally {
      setSendingReport(false);
    }
  };

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
    setFeedback({ message: "", type: "success" });

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
      setFeedback({
        message: "La consulta se canceló correctamente.",
        type: "success"
      });
    } catch (cancelError) {
      setFeedback({
        message: cancelError.message,
        type: "danger"
      });
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
   * Si el usuario pulsa "Ver todos los registros", se muestran todos.
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
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">

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

            <button
              type="button"
              className="btn btn-outline-info text-light rounded-pill mt-3"
              onClick={() => {
                setErrorPrivacidad("");
                setExitoPrivacidad("");
                setMostrarPrivacidad(true);
              }}
              aria-haspopup="dialog"
            >
              <Icon name="Settings" className="me-2 " />
              Configuración de privacidad
            </button>

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

        <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
            <div>
              <span className="text-info text-uppercase small fw-semibold">
                Avisos de acceso
              </span>
              <h2 className="h4 fw-bold mb-0 mt-1">Notificaciones</h2>
            </div>
            <span className="badge bg-info bg-opacity-25 text-info border border-info">
              {notifications.length}
            </span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-white-50 mb-0">
              Aquí aparecerán los motivos que indiquen los médicos al abrir tu
              registro desde la búsqueda de pacientes.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {notifications.slice(0, visibleNotificationsCount).map((notification) => (
                <article
                  className="border border-secondary border-opacity-50 rounded-3 p-3"
                  key={notification.id}
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-1">
                    <h3 className="h6 fw-semibold mb-0">
                      {notification.titulo}
                    </h3>
                    <span className="small text-white-50">
                      {formatDateTime(notification.fecha)}
                    </span>
                  </div>
                  <p className="small text-white-50 mb-1 mt-2">
                    Profesional: {notification.medico} (
                    {notification.hospital || "Hospital no disponible"})
                  </p>
                  <p className="mb-0">
                    <span className="text-info">Motivo indicado: </span>
                    {notification.motivo}
                  </p>
                  {notification.denuncia ? (
                    <div className="small mt-3">
                      <p className="text-danger  mb-1">
                        Denuncia enviada: 
                      </p>
                      <p className="text-light">Estado:{" "}
                        {{
                          pending: "Pendiente de revisión",
                          in_review: "En proceso de estudio",
                          resolved: "Resuelta",
                        }[notification.denuncia.estado] ||
                          notification.denuncia.estado}</p>
                      <p className="text-white-50 mb-0">
                        Tu explicación: {notification.denuncia.descripcion}
                      </p>
                      {notification.denuncia.resolucion && (
                        <p className="text-white mb-0 mt-2">
                          Resolución: {notification.denuncia.resolucion}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-danger rounded-pill btn-sm mt-3"
                      onClick={() => {
                        setNotificationToReport(notification);
                        setReportDescription("");
                        setReportError("");
                      }}
                    >
                      Denunciar este acceso
                    </button>
                  )}
                </article>
              ))}
              {notifications.length > visibleNotificationsCount && (
                <button
                  type="button"
                  className="btn btn-outline-info rounded-pill align-self-center"
                  onClick={() =>
                    setVisibleNotificationsCount((count) =>
                      count + 4
                    )
                  }
                >
                  Ver más
                </button>
              )}
            </div>
          )}
        </section>

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
                      : "Ver todos los registros"}
                  </button>

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

              {editandoDatos ? (
                <form
                  className="d-flex flex-column gap-3"
                  onSubmit={guardarDatos}
                >
                  <div>
                    <label
                      className="form-label text-white-50"
                      htmlFor="patient-email"
                    >
                      Email
                    </label>
                    <input
                      id="patient-email"
                      type="email"
                      className="form-control bg-dark text-white border-secondary"
                      value={emailEditado}
                      onChange={(event) =>
                        setEmailEditado(event.target.value)
                      }
                      maxLength={120}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="form-label text-white-50"
                      htmlFor="patient-phone"
                    >
                      Teléfono
                    </label>
                    <input
                      id="patient-phone"
                      type="tel"
                      className="form-control bg-dark text-white border-secondary"
                      value={telefonoEditado}
                      onChange={(event) =>
                        setTelefonoEditado(event.target.value)
                      }
                      placeholder="+34600000000"
                      maxLength={30}
                      required
                    />
                  </div>

                  {errorDatos && (
                    <p className="text-danger mb-0" role="alert">
                      {errorDatos}
                    </p>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="btn btn-info rounded-pill btn-sm"
                      disabled={guardandoDatos}
                    >
                      {guardandoDatos
                        ? "Guardando..."
                        : "Guardar cambios"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light rounded-pill btn-sm"
                      onClick={() => {
                        setEditandoDatos(false);
                        setErrorDatos("");
                      }}
                      disabled={guardandoDatos}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
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

                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill btn-sm mt-3 align-self-start text-start"
                    onClick={iniciarEdicionDatos}
                  >
                    <Icon name="Settings" className="me-2" />
                    Editar datos
                  </button>
                </div>
              )}

              

              {exitoDatos && (
                <p className="text-success small mt-2 mb-0" role="status">
                  {exitoDatos}
                </p>
              )}

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

              {prescriptions.length === 0 ? (

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

              {prescriptions.length > 4 && (
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
                      : "Ver todos los registros"}
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

              {diagnoses.length === 0 ? (

                <p className="text-white-50 mb-0">
                  No tienes diagnósticos registrados.
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

              {diagnoses.length > 4 && (
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
                      : "Ver todos los registros"}
                  </button>

                </div>
              )}

            </section>

          </div>

        </div>
        {mostrarPrivacidad && (
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-privacy-modal-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setMostrarPrivacidad(false);
              }
            }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(5px)",
              zIndex: 1060
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div className="modal-content bg-dark text-white border border-info border-opacity-50 rounded-4 shadow-lg">
                <div className="modal-header border-bottom border-white border-opacity-10">
                  <div>
                    <h2
                      id="patient-privacy-modal-title"
                      className="modal-title fs-5 fw-bold text-info"
                    >
                      Mi privacidad sanitaria
                    </h2>
                    
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Cerrar"
                    onClick={() => setMostrarPrivacidad(false)}
                  />
                </div>

                <div className="modal-body">
                  <fieldset className="border border-secondary border-opacity-50 rounded-3 p-3 mb-3">
                    <legend className="h6 text-info float-none w-auto px-2 mb-1">
                      ¿Quién puede consultar tu información clínica?
                    </legend>
                    <p className="small text-white-50 mb-3">
                      Elige el alcance de acceso para profesionales autorizados
                      cuando exista una necesidad asistencial.
                    </p>
                    <div className="form-check mb-2">
                      <input
                        id="privacy-scope-hospital"
                        type="radio"
                        name="privacy-scope"
                        value="hospital"
                        className="form-check-input"
                        checked={alcancePrivacidad === "hospital"}
                        onChange={() => setAlcancePrivacidad("hospital")}
                      />
                      <label
                        htmlFor="privacy-scope-hospital"
                        className="form-check-label"
                      >
                        Solo los profesionales autorizados de mi hospital o
                        centro de referencia.
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        id="privacy-scope-national"
                        type="radio"
                        name="privacy-scope"
                        value="national"
                        className="form-check-input"
                        checked={alcancePrivacidad === "national"}
                        onChange={() => setAlcancePrivacidad("national")}
                      />
                      <label
                        htmlFor="privacy-scope-national"
                        className="form-check-label"
                      >
                        Profesionales autorizados de cualquier centro del
                        sistema nacional cuando exista una necesidad asistencial.
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="border border-secondary border-opacity-50 rounded-3 p-3 mb-3">
                    <legend className="h6 text-info float-none w-auto px-2 mb-1">
                      Restricciones de información sensible
                    </legend>
                    <p className="small text-white-50 mb-3">
                      Esta restricción afecta a profesionales de otros
                      hospitales; los profesionales de tu hospital mantienen
                      el acceso asistencial.
                    </p>
                    <div className="form-check">
                      <input
                        id="privacy-sensitive-reports"
                        type="checkbox"
                        className="form-check-input"
                        checked={restringirInformesSensibles}
                        onChange={(event) =>
                          setRestringirInformesSensibles(
                            event.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor="privacy-sensitive-reports"
                        className="form-check-label"
                      >
                        Restringir enfermedades, recetas y alergias.
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="border border-secondary border-opacity-50 rounded-3 p-3 mb-3">
                    <legend className="h6 text-info float-none w-auto px-2 mb-1">
                      Notificaciones
                    </legend>
                    <div className="form-check">
                      <input
                        id="privacy-access-notifications"
                        type="checkbox"
                        className="form-check-input"
                        checked={notificarAccesos}
                        onChange={(event) =>
                          setNotificarAccesos(event.target.checked)
                        }
                      />
                      <label
                        htmlFor="privacy-access-notifications"
                        className="form-check-label"
                      >
                        Notificarme los accesos a mis informes clínicos.
                      </label>
                    </div>
                  </fieldset>

                  <div className="border border-info border-opacity-50 rounded-3 p-3">
                    <h3 className="h6 text-info mb-3">
                      Vista previa de tu configuración
                    </h3>
                    <ul className="small mb-3">
                      <li>
                        Alcance:{" "}
                        {alcancePrivacidad === "hospital"
                          ? "Hospital o centro de referencia"
                          : "Red sanitaria nacional"}
                        .
                      </li>
                      <li>
                        Restricciones adicionales:{" "}
                        {restringirInformesSensibles
                          ? "Activadas"
                          : "Desactivadas"}
                        .
                      </li>
                      <li>
                        Notificaciones de acceso:{" "}
                        {notificarAccesos ? "Activadas" : "Desactivadas"}.
                      </li>
                    </ul>
                    <p className="small text-white-50 mb-0">
                      Las restricciones pueden limitar la disponibilidad de
                      información durante la atención fuera de tu centro.
                    </p>
                  </div>
                  {errorPrivacidad && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {errorPrivacidad}
                    </div>
                  )}
                  {exitoPrivacidad && (
                    <div className="alert alert-success mt-3 mb-0" role="status">
                      {exitoPrivacidad}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-top border-white border-opacity-10">
                  <button
                    type="button"
                    className="btn btn-outline-light rounded-pill"
                    onClick={() => setMostrarPrivacidad(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-info rounded-pill"
                    onClick={guardarPrivacidad}
                    disabled={guardandoPrivacidad}
                  >
                    {guardandoPrivacidad ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {notificationToReport && (
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-report-modal-title"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                !sendingReport
              ) {
                setNotificationToReport(null);
              }
            }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(5px)",
              zIndex: 1070
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <form
                className="modal-content bg-dark text-white border border-danger border-opacity-50 rounded-4 shadow-lg"
                onSubmit={denunciarAcceso}
              >
                <div className="modal-header border-bottom border-white border-opacity-10">
                  <div>
                    <h2
                      id="access-report-modal-title"
                      className="modal-title fs-5 fw-bold text-danger"
                    >
                      Denunciar acceso
                    </h2>
                    <p className="small text-white-50 mb-0 mt-1">
                      {notificationToReport.medico} ·{" "}
                      {formatDateTime(notificationToReport.fecha)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Cerrar"
                    onClick={() => setNotificationToReport(null)}
                    disabled={sendingReport}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Si crees que este acceso no estaba justificado, explica
                    brevemente por qué. La denuncia quedará registrada para
                    revisión.
                  </p>
                  <label
                    htmlFor="access-report-description"
                    className="form-label"
                  >
                    Motivo de la denuncia
                  </label>
                  <textarea
                    id="access-report-description"
                    className="form-control bg-dark text-white border-secondary"
                    rows="4"
                    minLength={10}
                    maxLength={1000}
                    value={reportDescription}
                    onChange={(event) =>
                      setReportDescription(event.target.value)
                    }
                    required
                    autoFocus
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <span className="small text-white-50">
                      Entre 10 y 1000 caracteres.
                    </span>
                    <span className="small text-white-50">
                      {reportDescription.length}/1000
                    </span>
                  </div>
                  {reportError && (
                    <div
                      className="alert alert-danger mt-3 mb-0"
                      role="alert"
                    >
                      {reportError}
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top border-white border-opacity-10">
                  <button
                    type="button"
                    className="btn btn-outline-light rounded-pill"
                    onClick={() => setNotificationToReport(null)}
                    disabled={sendingReport}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger rounded-pill"
                    disabled={
                      sendingReport ||
                      reportDescription.trim().length < 10
                    }
                  >
                    {sendingReport ? "Enviando..." : "Enviar denuncia"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <FeedbackModal
          message={feedback.message}
          type={feedback.type}
          onClose={() =>
            setFeedback({ message: "", type: "success" })
          }
        />
      </div>
    </div>
  );
};