
import React, { useEffect, useMemo, useState } from "react";

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || ""
).replace(/\/$/, "");

const getToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token");

export const DashboardAdmin = () => {
  const [hospital, setHospital] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busquedaDoctor, setBusquedaDoctor] = useState("");
  const [busquedaPaciente, setBusquedaPaciente] = useState("");

  // =========================================================
  // VER MÁS / VER MENOS
  // =========================================================

  const [cantidadDoctoresVisibles, setCantidadDoctoresVisibles] =
    useState(6);

  const [cantidadPacientesVisibles, setCantidadPacientesVisibles] =
    useState(4);

  // =========================================================
  // ACCIONES
  // =========================================================

  const [asignando, setAsignando] = useState(null);
  const [cambiandoMedico, setCambiandoMedico] = useState(null);
  const [accionDoctor, setAccionDoctor] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  // =========================================================
  // HEADERS
  // =========================================================

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // =========================================================
  // ESTADOS DE LOS MÉDICOS
  // =========================================================

  const estadosDoctor = {
    active: {
      texto: "Activo",
      clase: "bg-success",
      icono: "🟢",
    },

    vacation: {
      texto: "De baja",
      clase: "bg-warning text-dark",
      icono: "🏖️",
    },

    temporary_leave: {
      texto: "De baja",
      clase: "bg-secondary",
      icono: "⏸️",
    },

    inactive: {
      texto: "De baja",
      clase: "bg-danger",
      icono: "🔴",
    },
  };

  // =========================================================
  // HELPER PARA RESPUESTAS JSON
  // =========================================================

  const obtenerRespuesta = async (response) => {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const texto = await response.text();

    return {
      error:
        texto ||
        `Error HTTP ${response.status}`,
    };
  };

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        hospitalResponse,
        doctoresResponse,
        pacientesResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/admin/hospital`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/api/admin/doctores`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/api/admin/pacientes`, {
          headers: getHeaders(),
        }),
      ]);

      const hospitalData =
        await obtenerRespuesta(hospitalResponse);

      const doctoresData =
        await obtenerRespuesta(doctoresResponse);

      const pacientesData =
        await obtenerRespuesta(pacientesResponse);

      if (!hospitalResponse.ok) {
        throw new Error(
          hospitalData.error ||
            "No se ha podido cargar el hospital"
        );
      }

      if (!doctoresResponse.ok) {
        throw new Error(
          doctoresData.error ||
            "No se han podido cargar los médicos"
        );
      }

      if (!pacientesResponse.ok) {
        throw new Error(
          pacientesData.error ||
            "No se han podido cargar los pacientes"
        );
      }

      setHospital(hospitalData);
      setDoctores(doctoresData.doctores || []);
      setPacientes(pacientesData.pacientes || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Ha ocurrido un error al cargar el dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================================================
  // FILTRO MÉDICOS
  // =========================================================

  const doctoresFiltrados = useMemo(() => {
    const texto = busquedaDoctor
      .toLowerCase()
      .trim();

    if (!texto) {
      return doctores;
    }

    return doctores.filter((doctor) => {
      const nombre = `
        ${doctor.first_name || ""}
        ${doctor.last_name || ""}
      `.toLowerCase();

      const especialidad =
        (doctor.specialty || "").toLowerCase();

      const email =
        (doctor.email || "").toLowerCase();

      const status =
        (doctor.status || "").toLowerCase();

      return (
        nombre.includes(texto) ||
        especialidad.includes(texto) ||
        email.includes(texto) ||
        status.includes(texto)
      );
    });
  }, [doctores, busquedaDoctor]);

  // =========================================================
  // FILTRO PACIENTES
  // =========================================================

  const pacientesFiltrados = useMemo(() => {
    const texto = busquedaPaciente
      .toLowerCase()
      .trim();

    if (!texto) {
      return pacientes;
    }

    return pacientes.filter((patient) => {
      const nombre = `
        ${patient.first_name || ""}
        ${patient.last_name || ""}
      `.toLowerCase();

      const email =
        (patient.email || "").toLowerCase();

      const cip =
        (patient.cip || "").toLowerCase();

      const dni =
        (patient.dni || "").toLowerCase();

      return (
        nombre.includes(texto) ||
        email.includes(texto) ||
        cip.includes(texto) ||
        dni.includes(texto)
      );
    });
  }, [pacientes, busquedaPaciente]);

  // =========================================================
  // RESULTADOS VISIBLES
  // =========================================================

  const doctoresVisibles = doctoresFiltrados.slice(
    0,
    cantidadDoctoresVisibles
  );

  const pacientesVisibles = pacientesFiltrados.slice(
    0,
    cantidadPacientesVisibles
  );

  // =========================================================
  // CAMBIO DE BÚSQUEDA
  // =========================================================

  const cambiarBusquedaDoctor = (valor) => {
    setBusquedaDoctor(valor);
    setCantidadDoctoresVisibles(6);
  };

  const cambiarBusquedaPaciente = (valor) => {
    setBusquedaPaciente(valor);
    setCantidadPacientesVisibles(4);
  };

  // =========================================================
  // VER MÁS / VER MENOS MÉDICOS
  // =========================================================

  const verMasDoctores = () => {
    setCantidadDoctoresVisibles(
      (cantidadActual) => cantidadActual + 6
    );
  };

  const verMenosDoctores = () => {
    setCantidadDoctoresVisibles(6);
  };

  // =========================================================
  // VER MÁS / VER MENOS PACIENTES
  // =========================================================

  const verMasPacientes = () => {
    setCantidadPacientesVisibles(
      (cantidadActual) => cantidadActual + 4
    );
  };

  const verMenosPacientes = () => {
    setCantidadPacientesVisibles(4);
  };

  // =========================================================
  // CAMBIAR ESTADO DEL MÉDICO
  // =========================================================

  const cambiarEstadoDoctor = async (
    doctor,
    nuevoEstado
  ) => {
    const doctorNombre = `
      ${doctor.first_name || ""}
      ${doctor.last_name || ""}
    `.trim();

    const mensajesConfirmacion = {
      vacation:
        `¿Quieres poner a ${doctorNombre} como de vacaciones?`,

      temporary_leave:
        `¿Quieres poner a ${doctorNombre} en baja temporal?`,

      inactive:
        `¿Quieres marcar a ${doctorNombre} como inactivo?`,

      active:
        `¿Quieres reactivar a ${doctorNombre}?`,
    };

    const confirmar = window.confirm(
      mensajesConfirmacion[nuevoEstado]
    );

    if (!confirmar) {
      setAccionDoctor(null);
      return;
    }

    try {
      setAccionDoctor(
        `${nuevoEstado}-${doctor.id}`
      );

      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/admin/doctores/${doctor.id}/estado`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            status: nuevoEstado,
          }),
        }
      );

      const data = await obtenerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            `No se ha podido cambiar el estado del médico (HTTP ${response.status})`
        );
      }

      setTipoMensaje("success");

      const mensajesExito = {
        vacation:
          "Médico marcado como de baja correctamente.",

        temporary_leave:
          "Médico marcado en baja correctamente.",

        inactive:
          "Médico marcado como de baja correctamente.",

        active:
          "Médico reactivado correctamente.",
      };

      setMensaje(
        mensajesExito[nuevoEstado]
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido cambiar el estado del médico."
      );
    } finally {
      setAccionDoctor(null);
    }
  };

  // =========================================================
  // ASIGNAR MÉDICO DE CABECERA
  // =========================================================

  const asignarMedico = async (
    patientId,
    doctorId
  ) => {
    if (!doctorId) {
      return;
    }

    try {
      setAsignando(patientId);
      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/admin/asignar-medico`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            patient_id: patientId,
            doctor_id: Number(doctorId),
          }),
        }
      );

      const data = await obtenerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se ha podido asignar el médico"
        );
      }

      setCambiandoMedico(null);
      setTipoMensaje("success");

      setMensaje(
        "Médico de cabecera asignado correctamente."
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido asignar el médico."
      );
    } finally {
      setAsignando(null);
    }
  };

  // =========================================================
  // CAMBIAR MÉDICO DE CABECERA
  // =========================================================

  const cambiarMedicoCabecera = async (
    patientId,
    doctorActualId,
    nuevoDoctorId
  ) => {
    if (!nuevoDoctorId) {
      return;
    }

    try {
      setAsignando(patientId);
      setMensaje("");

      // -----------------------------------------------------
      // Primero desasignamos el actual
      // -----------------------------------------------------

      if (doctorActualId) {
        const desasignarResponse =
          await fetch(
            `${API_URL}/api/admin/desasignar-medico/${doctorActualId}/${patientId}`,
            {
              method: "PUT",
              headers: getHeaders(),
            }
          );

        const desasignarData =
          await obtenerRespuesta(
            desasignarResponse
          );

        if (!desasignarResponse.ok) {
          throw new Error(
            desasignarData.error ||
              "No se ha podido desasignar el médico actual"
          );
        }
      }

      // -----------------------------------------------------
      // Después asignamos el nuevo
      // -----------------------------------------------------

      const asignarResponse =
        await fetch(
          `${API_URL}/api/admin/asignar-medico`,
          {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              patient_id: patientId,
              doctor_id: Number(nuevoDoctorId),
            }),
          }
        );

      const asignarData =
        await obtenerRespuesta(
          asignarResponse
        );

      if (!asignarResponse.ok) {
        throw new Error(
          asignarData.error ||
            "No se ha podido asignar el nuevo médico"
        );
      }

      setCambiandoMedico(null);
      setTipoMensaje("success");

      setMensaje(
        "Médico de cabecera cambiado correctamente."
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido cambiar el médico de cabecera."
      );
    } finally {
      setAsignando(null);
    }
  };

  // =========================================================
  // DESASIGNAR MÉDICO
  // =========================================================

  const desasignarMedico = async (
    patientId,
    doctorId
  ) => {
    try {
      setAsignando(patientId);
      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/admin/desasignar-medico/${doctorId}/${patientId}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );

      const data = await obtenerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se ha podido desasignar el médico"
        );
      }

      setTipoMensaje("success");

      setMensaje(
        "Médico de cabecera desasignado correctamente."
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido desasignar el médico."
      );
    } finally {
      setAsignando(null);
    }
  };

  // =========================================================
  // QUITAR PACIENTE DEL HOSPITAL
  // =========================================================

  const quitarPacienteHospital = async (
    patientId
  ) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres quitar a este paciente del hospital?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setAsignando(patientId);
      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/admin/quitar-paciente/${patientId}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );

      const data = await obtenerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se ha podido quitar al paciente del hospital"
        );
      }

      setTipoMensaje("success");

      setMensaje(
        "Paciente quitado del hospital correctamente."
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido quitar al paciente del hospital."
      );
    } finally {
      setAsignando(null);
    }
  };

  // =========================================================
  // QUITAR MÉDICO DEL HOSPITAL
  // =========================================================

  const quitarDoctorHospital = async (
    doctorId,
    doctorNombre
  ) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que quieres quitar a ${doctorNombre} del hospital?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setAsignando(`doctor-${doctorId}`);
      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/admin/quitar-doctor/${doctorId}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );

      const data = await obtenerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se ha podido quitar el médico del hospital"
        );
      }

      setTipoMensaje("success");

      setMensaje(
        "Médico quitado del hospital correctamente."
      );

      await cargarDatos();
    } catch (err) {
      console.error(err);

      setTipoMensaje("danger");

      setMensaje(
        err.message ||
          "No se ha podido quitar el médico del hospital."
      );
    } finally {
      setAsignando(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="text-white py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="d-flex align-items-center gap-2 text-white-50">
              <div
                className="spinner-border spinner-border-sm text-info"
                role="status"
              >
                <span className="visually-hidden">
                  Cargando...
                </span>
              </div>

              Cargando panel de administración...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="text-white py-5">
        <div className="container">
          <div
            className="alert alert-danger rounded-4"
            role="alert"
          >
            {error}
          </div>

          <button
            className="btn btn-info rounded-pill"
            onClick={cargarDatos}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="text-white py-5">
      <div className="container">

        {/* =================================================
            CABECERA
        ================================================= */}

        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="text-info text-uppercase small fw-semibold">
                Administración
              </span>

              <h1 className="h3 fw-bold mb-1 mt-1">
                Panel de administración
              </h1>

              <p className="text-white-50 mb-0">
                Gestión de médicos y pacientes del hospital.
              </p>
            </div>

            <button
              className="btn btn-outline-info rounded-pill px-4"
              onClick={cargarDatos}
            >
              ↻ Actualizar
            </button>
          </div>
        </div>

        {/* =================================================
            MENSAJE
        ================================================= */}

        {mensaje && (
          <div
            className={`alert alert-${tipoMensaje} rounded-4 border-0 mb-4`}
          >
            {mensaje}
          </div>
        )}

        {/* =================================================
            HOSPITAL
        ================================================= */}

        {hospital && (
          <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-info bg-opacity-25 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "28px",
                  }}
                >
                  🏥
                </div>

                <div>
                  <span className="text-info text-uppercase small fw-semibold">
                    Centro sanitario
                  </span>

                  <h2 className="h4 fw-bold mb-1 mt-1">
                    {hospital.name}
                  </h2>

                  <p className="text-white-50 mb-0">
                    {hospital.city}

                    {hospital.city &&
                      hospital.address &&
                      " · "}

                    {hospital.address}
                  </p>
                </div>
              </div>

              <span className="badge bg-secondary text-white rounded-pill px-3 py-2">
                Hospital #{hospital.id}
              </span>
            </div>
          </section>
        )}

        {/* =================================================
            ESTADÍSTICAS
        ================================================= */}

        <div className="row g-4 mb-4">

          {/* MÉDICOS */}

          <div className="col-12 col-md-3">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <span className="fs-2">
                M
              </span>

              <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                Médicos
              </p>

              <h2 className="display-6 fw-bold mb-0">
                {doctores.length}
              </h2>
            </div>
          </div>

          {/* PACIENTES */}

          <div className="col-12 col-md-3">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <span className="fs-2">
                P
              </span>

              <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                Pacientes
              </p>

              <h2 className="display-6 fw-bold mb-0">
                {pacientes.length}
              </h2>
            </div>
          </div>

          {/* MÉDICOS ACTIVOS */}

          <div className="col-12 col-md-3">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <span className="fs-2">
                ✓
              </span>

              <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                Médicos activos
              </p>

              <h2 className="display-6 fw-bold mb-0">
                {
                  doctores.filter(
                    (doctor) =>
                      doctor.status === "active" &&
                      doctor.is_active === true
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* MÉDICOS DE BAJA */}

          <div className="col-12 col-md-3">
            <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
              <span className="fs-2">
                ⏸️
              </span>

              <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                Médicos de baja
              </p>

              <h2 className="display-6 fw-bold mb-0">
                {
                  doctores.filter(
                    (doctor) =>
                      doctor.status === "vacation" ||
                      doctor.status === "temporary_leave" ||
                      doctor.status === "inactive"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        {/* =================================================
            MÉDICOS
        ================================================= */}

        <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

            <div>
              <span className="text-info text-uppercase small fw-semibold">
                Equipo médico
              </span>

              <h2 className="h4 fw-bold mb-1 mt-1">
                Médicos del hospital
              </h2>

              <p className="text-white-50 mb-0">
                Gestiona el estado y pertenencia de los médicos.
              </p>
            </div>

            <div
              className="input-group"
              style={{
                maxWidth: "350px",
              }}
            >
              <span className="input-group-text bg-dark border-secondary text-white-50">
                🔎
              </span>

              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Buscar médico..."
                value={busquedaDoctor}
                onChange={(e) =>
                  cambiarBusquedaDoctor(e.target.value)
                }
              />
            </div>
          </div>

          {doctoresFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">
                👨‍⚕️
              </div>

              <p className="text-white-50 mb-0">
                No se han encontrado médicos.
              </p>
            </div>
          ) : (
            <>
              <div className="row g-3">

                {doctoresVisibles.map((doctor) => {
                  const doctorNombre = `
                    ${doctor.first_name || ""}
                    ${doctor.last_name || ""}
                  `.trim();

                  const estado =
                    estadosDoctor[doctor.status] ||
                    estadosDoctor.active;

                  const quitandoDoctor =
                    asignando ===
                    `doctor-${doctor.id}`;

                  const procesandoEstado =
                    accionDoctor?.endsWith(
                      `-${doctor.id}`
                    );

                  return (
                    <div
                      className="col-12 col-md-6 col-xl-4"
                      key={doctor.id}
                    >
                      <div className="bg-dark bg-opacity-25 border border-secondary border-opacity-50 rounded-4 p-3 h-100">

                        {/* CABECERA */}

                        <div className="d-flex justify-content-between align-items-start gap-2">

                          <div>
                            <h3 className="h6 fw-bold text-white mb-1">
                              {doctor.first_name}{" "}
                              {doctor.last_name}
                            </h3>

                            <p className="text-info mb-2">
                              {doctor.specialty ||
                                "Especialidad no disponible"}
                            </p>
                          </div>

                          <span
                            className={`badge rounded-pill ${estado.clase}`}
                          >
                            {estado.icono}{" "}
                            {estado.texto}
                          </span>
                        </div>

                        {/* DATOS */}

                        <div className="small text-white-50 mb-3">

                          <div className="mb-1">
                            ✉️ {doctor.email}
                          </div>

                          {doctor.phone && (
                            <div className="mb-1">
                              📞 {doctor.phone}
                            </div>
                          )}

                          <div className="mb-1">
                            🪪 {doctor.medical_license}
                          </div>

                          {doctor.years_experience != null && (
                            <div>
                              🕒{" "}
                              {doctor.years_experience}{" "}
                              años de experiencia
                            </div>
                          )}
                        </div>

                        {/* ACCIONES */}

                        <div className="dropdown">

                          <button
                            className="btn btn-outline-info rounded-pill btn-sm w-100 dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={
                              procesandoEstado ||
                              quitandoDoctor
                            }
                          >
                            {procesandoEstado ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                />

                                Procesando...
                              </>
                            ) : (
                              "Acciones"
                            )}
                          </button>

                          <ul className="dropdown-menu dropdown-menu-dark w-100">

                            {/* ACTIVAR */}

                            {doctor.status !== "active" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item text-success"
                                  onClick={() =>
                                    cambiarEstadoDoctor(
                                      doctor,
                                      "active"
                                    )
                                  }
                                >
                                  🟢 Reactivar
                                </button>
                              </li>
                            )}

                            {/* VACACIONES */}

                            {doctor.status !== "vacation" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    cambiarEstadoDoctor(
                                      doctor,
                                      "vacation"
                                    )
                                  }
                                >
                                  🏖️ Dar de vacaciones
                                </button>
                              </li>
                            )}

                            {/* BAJA TEMPORAL */}

                            {doctor.status !== "temporary_leave" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    cambiarEstadoDoctor(
                                      doctor,
                                      "temporary_leave"
                                    )
                                  }
                                >
                                  ⏸️ Dar de baja temporal
                                </button>
                              </li>
                            )}

                            {/* INACTIVO */}

                            {doctor.status !== "inactive" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item text-warning"
                                  onClick={() =>
                                    cambiarEstadoDoctor(
                                      doctor,
                                      "inactive"
                                    )
                                  }
                                >
                                  🔴 Marcar como inactivo
                                </button>
                              </li>
                            )}

                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            {/* QUITAR DEL HOSPITAL */}

                            <li>
                              <button
                                type="button"
                                className="dropdown-item text-danger"
                                disabled={quitandoDoctor}
                                onClick={() =>
                                  quitarDoctorHospital(
                                    doctor.id,
                                    doctorNombre
                                  )
                                }
                              >
                                🏥 Quitar del hospital
                              </button>
                            </li>

                          </ul>
                        </div>

                        {quitandoDoctor && (
                          <div className="d-flex align-items-center justify-content-center gap-2 text-white-50 small mt-2">

                            <div
                              className="spinner-border spinner-border-sm text-info"
                              role="status"
                            />

                            Quitando del hospital...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* VER MÁS / VER MENOS */}

              {doctoresFiltrados.length > 6 && (
                <div className="text-center mt-4">

                  {cantidadDoctoresVisibles <
                  doctoresFiltrados.length ? (
                    <button
                      type="button"
                      className="btn btn-outline-info rounded-pill btn-sm px-4"
                      onClick={verMasDoctores}
                    >
                      Ver más
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill btn-sm px-4"
                      onClick={verMenosDoctores}
                    >
                      Ver menos
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* =================================================
            PACIENTES
        ================================================= */}

        <section className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

            <div>
              <span className="text-info text-uppercase small fw-semibold">
                Gestión sanitaria
              </span>

              <h2 className="h4 fw-bold mb-1 mt-1">
                Gestión de pacientes
              </h2>

              <p className="text-white-50 mb-0">
                Asigna y gestiona los médicos de los pacientes.
              </p>
            </div>

            <div
              className="input-group"
              style={{
                maxWidth: "350px",
              }}
            >
              <span className="input-group-text bg-dark border-secondary text-white-50">
                🔎
              </span>

              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Buscar paciente..."
                value={busquedaPaciente}
                onChange={(e) =>
                  cambiarBusquedaPaciente(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {pacientesFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">
                👤
              </div>

              <p className="text-white-50 mb-0">
                No se han encontrado pacientes.
              </p>
            </div>
          ) : (
            <>
              <div className="row g-3">

                {pacientesVisibles.map((patient) => {
                  const doctoresAsignados =
                    patient.doctores || [];

                  const medicoCabecera =
                    doctoresAsignados.find(
                      (doctor) =>
                        (doctor.specialty || "")
                          .trim()
                          .toLowerCase() ===
                        "médico de cabecera"
                    );

                  // =================================================
                  // SOLO MÉDICOS DE CABECERA ACTIVOS
                  // =================================================

                  const doctoresDisponibles =
                    doctores.filter((doctor) => {
                      const especialidad =
                        (doctor.specialty || "")
                          .trim()
                          .toLowerCase();

                      return (
                        doctor.is_active === true &&
                        doctor.status === "active" &&
                        especialidad ===
                          "médico de cabecera" &&
                        doctor.id !==
                          medicoCabecera?.id
                      );
                    });

                  const mostrandoCambio =
                    cambiandoMedico === patient.id;

                  return (
                    <div
                      className="col-12"
                      key={patient.id}
                    >
                      <div className="bg-dark bg-opacity-25 border border-secondary border-opacity-50 rounded-4 p-4">

                        <div className="row align-items-center g-3">

                          {/* DATOS PACIENTE */}

                          <div className="col-lg-4">

                            <div className="d-flex align-items-center gap-3">

                              <div
                                className="rounded-circle bg-secondary bg-opacity-50 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              >
                                👤
                              </div>

                              <div>

                                <h3 className="h6 fw-bold text-white mb-1">
                                  {patient.first_name}{" "}
                                  {patient.last_name}
                                </h3>

                                <div className="small text-white-50">
                                  CIP:{" "}
                                  {patient.cip ||
                                    "No disponible"}
                                </div>

                                {patient.email && (
                                  <div className="small text-white-50">
                                    {patient.email}
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>

                          {/* MÉDICO ACTUAL */}

                          <div className="col-lg-4">

                            <p className="text-info text-uppercase small fw-semibold mb-2">
                              Médico de cabecera
                            </p>

                            {medicoCabecera ? (
                              <div>

                                <div className="d-flex align-items-center justify-content-between gap-2">

                                  <div>
                                    <div className="text-white fw-semibold">
                                      {
                                        medicoCabecera.first_name
                                      }{" "}
                                      {
                                        medicoCabecera.last_name
                                      }
                                    </div>
                                  </div>

                                  <span className="badge bg-success rounded-pill">
                                    Asignado
                                  </span>
                                </div>

                              </div>
                            ) : (
                              <span className="badge bg-secondary text-white rounded-pill">
                                Sin médico de cabecera
                              </span>
                            )}

                          </div>

                          {/* ACCIONES */}

                          <div className="col-lg-4">

                            <p className="text-info text-uppercase small fw-semibold mb-2">
                              Gestión
                            </p>

                            <div className="d-flex flex-column gap-2">

                              {/* CAMBIAR / ASIGNAR MÉDICO */}

                              {medicoCabecera &&
                              !mostrandoCambio ? (
                                <button
                                  type="button"
                                  className="btn btn-outline-info rounded-pill btn-sm w-100"
                                  disabled={
                                    asignando ===
                                    patient.id
                                  }
                                  onClick={() =>
                                    setCambiandoMedico(
                                      patient.id
                                    )
                                  }
                                >
                                  Cambiar médico de cabecera
                                </button>
                              ) : (
                                <>
                                  <div className="d-flex gap-2">

                                    <select
                                      className="form-select bg-dark text-white border-secondary"
                                      defaultValue=""
                                      disabled={
                                        asignando ===
                                        patient.id
                                      }
                                      onChange={(e) => {
                                        const nuevoDoctorId =
                                          e.target.value;

                                        if (
                                          medicoCabecera
                                        ) {
                                          cambiarMedicoCabecera(
                                            patient.id,
                                            medicoCabecera.id,
                                            nuevoDoctorId
                                          );
                                        } else {
                                          asignarMedico(
                                            patient.id,
                                            nuevoDoctorId
                                          );
                                        }
                                      }}
                                    >

                                      <option
                                        value=""
                                        disabled
                                      >
                                        Seleccionar médico de cabecera
                                      </option>

                                      {doctoresDisponibles.map(
                                        (doctor) => (
                                          <option
                                            key={doctor.id}
                                            value={doctor.id}
                                          >
                                            {
                                              doctor.first_name
                                            }{" "}
                                            {
                                              doctor.last_name
                                            }
                                          </option>
                                        )
                                      )}

                                    </select>

                                    {mostrandoCambio && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-pill btn-sm"
                                        disabled={
                                          asignando ===
                                          patient.id
                                        }
                                        onClick={() =>
                                          setCambiandoMedico(
                                            null
                                          )
                                        }
                                      >
                                        Cancelar
                                      </button>
                                    )}

                                  </div>

                                  {doctoresDisponibles.length ===
                                    0 && (
                                    <small className="text-white-50">
                                      No hay médicos de cabecera
                                      activos disponibles.
                                    </small>
                                  )}
                                </>
                              )}

                              {/* DESASIGNAR MÉDICO */}

                              {medicoCabecera && (
                                <button
                                  type="button"
                                  className="btn btn-outline-warning rounded-pill btn-sm w-100"
                                  disabled={
                                    asignando ===
                                    patient.id
                                  }
                                  onClick={() =>
                                    desasignarMedico(
                                      patient.id,
                                      medicoCabecera.id
                                    )
                                  }
                                >
                                  Desasignar médico
                                </button>
                              )}

                              {/* QUITAR PACIENTE */}

                              <button
                                type="button"
                                className="btn btn-outline-danger rounded-pill btn-sm w-100"
                                disabled={
                                  asignando ===
                                  patient.id
                                }
                                onClick={() =>
                                  quitarPacienteHospital(
                                    patient.id
                                  )
                                }
                              >
                                Quitar paciente del hospital
                              </button>

                              {asignando ===
                                patient.id && (
                                <div className="d-flex align-items-center justify-content-center gap-2 text-white-50 small">

                                  <div
                                    className="spinner-border spinner-border-sm text-info"
                                    role="status"
                                  />

                                  Procesando...
                                </div>
                              )}

                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* VER MÁS / VER MENOS */}

              {pacientesFiltrados.length > 4 && (
                <div className="text-center mt-4">

                  {cantidadPacientesVisibles <
                  pacientesFiltrados.length ? (
                    <button
                      type="button"
                      className="btn btn-outline-info rounded-pill btn-sm px-4"
                      onClick={verMasPacientes}
                    >
                      Ver más
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill btn-sm px-4"
                      onClick={verMenosPacientes}
                    >
                      Ver menos
                    </button>
                  )}

                </div>
              )}
            </>
          )}

        </section>
      </div>
    </div>
  );
};

