import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ==========================================================
// HORARIO PROVISIONAL
// ==========================================================

const HORA_INICIO = 8;
const HORA_FIN = 18;
const INTERVALO_MINUTOS = 30;

// ==========================================================
// GENERAR HORAS
// ==========================================================

const generarHoras = () => {
    const horas = [];

    for (
        let minutos = HORA_INICIO * 60;
        minutos < HORA_FIN * 60;
        minutos += INTERVALO_MINUTOS
    ) {
        const hora = Math.floor(minutos / 60);
        const minuto = minutos % 60;

        horas.push(
            `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
        );
    }

    return horas;
};

const HORAS_DISPONIBLES = generarHoras();

// ==========================================================
// FECHA LOCAL
// ==========================================================

const crearFechaLocal = (year, month, day) => {
    const fecha = new Date(year, month, day);

    fecha.setHours(0, 0, 0, 0);

    return fecha;
};

// ==========================================================
// FORMATO YYYY-MM-DD
// ==========================================================

const formatearFechaInput = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// ==========================================================
// HOY
// ==========================================================

const obtenerHoy = () => {
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    return hoy;
};

// ==========================================================
// FIN DE SEMANA
// ==========================================================

const esFinDeSemana = (fecha) => {
    const dia = fecha.getDay();

    return dia === 0 || dia === 6;
};

// ==========================================================
// GENERAR DÍAS DEL CALENDARIO
// ==========================================================

const generarDiasCalendario = (mes, año) => {
    const primerDia = crearFechaLocal(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    const dias = [];

    const diaSemanaPrimerDia =
        primerDia.getDay() === 0
            ? 6
            : primerDia.getDay() - 1;

    for (let i = 0; i < diaSemanaPrimerDia; i++) {
        dias.push(null);
    }

    for (
        let dia = 1;
        dia <= ultimoDia.getDate();
        dia++
    ) {
        dias.push(
            crearFechaLocal(año, mes, dia)
        );
    }

    return dias;
};

// ==========================================================
// NOMBRE DEL MES
// ==========================================================

const obtenerNombreMes = (mes, año) => {
    const fecha = crearFechaLocal(año, mes, 1);

    return fecha.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric"
    });
};

// ==========================================================
// FORMATEAR FECHA BONITA
// ==========================================================

const formatearFechaBonita = (fechaString) => {
    if (!fechaString) {
        return "";
    }

    const [year, month, day] =
        fechaString.split("-");

    const fecha = crearFechaLocal(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    return fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

// ==========================================================
// COMPROBAR SI LA HORA YA HA PASADO
// ==========================================================

const horaYaHaPasado = (
    fechaString,
    horaString
) => {
    const ahora = new Date();

    const fechaHoy =
        formatearFechaInput(ahora);

    if (fechaString > fechaHoy) {
        return false;
    }

    if (fechaString < fechaHoy) {
        return true;
    }

    const [hora, minutos] =
        horaString.split(":").map(Number);

    const fechaHora = new Date();

    fechaHora.setHours(
        hora,
        minutos,
        0,
        0
    );

    return fechaHora <= ahora;
};

// ==========================================================
// OBTENER NOMBRE DEL PACIENTE
// ==========================================================

const obtenerNombrePaciente = (patient) => {
    if (!patient) {
        return "No seleccionado";
    }

    const firstName =
        patient.first_name ||
        patient.firstName ||
        patient.user?.first_name ||
        patient.user?.firstName ||
        "";

    const lastName =
        patient.last_name ||
        patient.lastName ||
        patient.user?.last_name ||
        patient.user?.lastName ||
        "";

    const nombreCompleto =
        `${firstName} ${lastName}`.trim();

    return (
        nombreCompleto ||
        patient.nombreCompleto ||
        patient.full_name ||
        patient.name ||
        (
            patient.nombre
                ? `${patient.nombre} ${patient.apellidos || ""}`.trim()
                : "Paciente"
        )
    );
};

// ==========================================================
// OBTENER DNI DEL PACIENTE
// ==========================================================

const obtenerDniPaciente = (patient) => {
    if (!patient) {
        return "No disponible";
    }

    return (
        patient.dni ||
        patient.user?.dni ||
        "No disponible"
    );
};

// ==========================================================
// COMPONENTE
// ==========================================================

export const NuevaConsulta = () => {
    const { state } = useLocation();

    // Paciente seleccionado desde DashboardMedico
    const patient = state?.patient;

    const hoy = obtenerHoy();

    // ======================================================
    // CALENDARIO
    // ======================================================

    const [mesActual, setMesActual] = useState(
        hoy.getMonth()
    );

    const [añoActual, setAñoActual] = useState(
        hoy.getFullYear()
    );

    const [fechaSeleccionada, setFechaSeleccionada] =
        useState("");

    const [horaSeleccionada, setHoraSeleccionada] =
        useState("");

    // ======================================================
    // ESPECIALIDADES
    // ======================================================

    const [especialidades, setEspecialidades] =
        useState([]);

    const [cargandoEspecialidades, setCargandoEspecialidades] =
        useState(true);

    // ======================================================
    // FORMULARIO
    // ======================================================

    const [formulario, setFormulario] = useState({
        appointment_type: "Consulta médica",
        specialty_id: "",
        modality: "presencial",
        scheduled_start: "",
        status: "scheduled",
        reason: ""
    });

    // ======================================================
    // ESTADOS
    // ======================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [consultaCreada, setConsultaCreada] =
        useState(null);

    // ======================================================
    // CARGAR ESPECIALIDADES
    // ======================================================

    useEffect(() => {
        const cargarEspecialidades = async () => {
            setCargandoEspecialidades(true);
            setError("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "No hay una sesión iniciada."
                    );
                }

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/especialidades`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las especialidades."
                    );
                }

                const listaEspecialidades =
                    Array.isArray(data)
                        ? data
                        : data.especialidades || [];

                setEspecialidades(
                    listaEspecialidades
                );

            } catch (errorEspecialidades) {
                console.error(
                    "Error cargando especialidades:",
                    errorEspecialidades
                );

                setError(
                    errorEspecialidades.message ||
                    "No se pudieron cargar las especialidades."
                );
            } finally {
                setCargandoEspecialidades(false);
            }
        };

        cargarEspecialidades();
    }, []);

    // ======================================================
    // DÍAS DEL CALENDARIO
    // ======================================================

    const diasCalendario =
        generarDiasCalendario(
            mesActual,
            añoActual
        );

    // ======================================================
    // INFORMACIÓN DEL PACIENTE
    // ======================================================

    const nombrePaciente =
        obtenerNombrePaciente(patient);

    const dniPaciente =
        obtenerDniPaciente(patient);

    // ======================================================
    // CAMBIAR MES
    // ======================================================

    const cambiarMes = (direccion) => {
        let nuevoMes = mesActual + direccion;
        let nuevoAño = añoActual;

        if (nuevoMes < 0) {
            nuevoMes = 11;
            nuevoAño--;
        }

        if (nuevoMes > 11) {
            nuevoMes = 0;
            nuevoAño++;
        }

        const mesHoy = hoy.getMonth();
        const añoHoy = hoy.getFullYear();

        if (
            nuevoAño < añoHoy ||
            (
                nuevoAño === añoHoy &&
                nuevoMes < mesHoy
            )
        ) {
            return;
        }

        setMesActual(nuevoMes);
        setAñoActual(nuevoAño);

        setFechaSeleccionada("");
        setHoraSeleccionada("");

        setFormulario((actual) => ({
            ...actual,
            scheduled_start: ""
        }));
    };

    // ======================================================
    // SELECCIONAR FECHA
    // ======================================================

    const seleccionarFecha = (fecha) => {
        if (!fecha) {
            return;
        }

        const fechaFormateada =
            formatearFechaInput(fecha);

        const hoyActual =
            obtenerHoy();

        if (fecha < hoyActual) {
            return;
        }

        if (esFinDeSemana(fecha)) {
            return;
        }

        setFechaSeleccionada(
            fechaFormateada
        );

        setHoraSeleccionada("");

        setFormulario((actual) => ({
            ...actual,
            scheduled_start: ""
        }));

        setError("");
        setSuccess("");
        setConsultaCreada(null);
    };

    // ======================================================
    // SELECCIONAR HORA
    // ======================================================

    const seleccionarHora = (hora) => {
        if (!fechaSeleccionada) {
            return;
        }

        if (
            horaYaHaPasado(
                fechaSeleccionada,
                hora
            )
        ) {
            return;
        }

        setHoraSeleccionada(hora);

        setFormulario((actual) => ({
            ...actual,
            scheduled_start:
                `${fechaSeleccionada}T${hora}`
        }));

        setError("");
        setSuccess("");
        setConsultaCreada(null);
    };

    // ======================================================
    // CAMBIAR CAMPOS
    // ======================================================

    const actualizarCampo = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value
        }));

        setError("");
        setSuccess("");
        setConsultaCreada(null);
    };

    // ======================================================
    // ENVIAR
    // ======================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setConsultaCreada(null);

        // --------------------------------------------------
        // PACIENTE
        // --------------------------------------------------

        if (!patient?.id) {
            setError(
                "No se ha seleccionado ningún paciente."
            );
            return;
        }

        // --------------------------------------------------
        // ESPECIALIDAD
        // --------------------------------------------------

        if (!formulario.specialty_id) {
            setError(
                "Selecciona una especialidad para la consulta."
            );
            return;
        }

        // --------------------------------------------------
        // FECHA
        // --------------------------------------------------

        if (!fechaSeleccionada) {
            setError(
                "Selecciona un día para la consulta."
            );
            return;
        }

        // --------------------------------------------------
        // HORA
        // --------------------------------------------------

        if (!horaSeleccionada) {
            setError(
                "Selecciona una hora para la consulta."
            );
            return;
        }

        // --------------------------------------------------
        // COMPROBAR FECHA
        // --------------------------------------------------

        const hoyActual =
            obtenerHoy();

        const [
            year,
            month,
            day
        ] = fechaSeleccionada
            .split("-")
            .map(Number);

        const fechaCita =
            crearFechaLocal(
                year,
                month - 1,
                day
            );

        if (fechaCita < hoyActual) {
            setError(
                "No puedes programar una consulta para una fecha anterior a hoy."
            );
            return;
        }

        // --------------------------------------------------
        // FIN DE SEMANA
        // --------------------------------------------------

        if (esFinDeSemana(fechaCita)) {
            setError(
                "Las consultas no pueden programarse los fines de semana."
            );
            return;
        }

        // --------------------------------------------------
        // HORA
        // --------------------------------------------------

        if (
            horaYaHaPasado(
                fechaSeleccionada,
                horaSeleccionada
            )
        ) {
            setError(
                "La hora seleccionada ya ha pasado."
            );
            return;
        }

        setLoading(true);

        try {
            const token =
                localStorage.getItem("access_token") ||
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "No hay una sesión iniciada."
                );
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/consultas`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formulario,

                        specialty_id:
                            Number(
                                formulario.specialty_id
                            )
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "No se pudo crear la consulta."
                );
            }

            const consulta =
                data.consulta;

            if (!consulta?.id) {
                throw new Error(
                    "La consulta se creó, pero el servidor no devolvió su identificador."
                );
            }

            setConsultaCreada({
                ...consulta,
                doctor_asignado:
                    data.doctor_asignado || null
            });

            setSuccess(
                consulta.modality === "virtual"
                    ? "Consulta virtual creada correctamente."
                    : "Consulta creada correctamente."
            );

            // --------------------------------------------------
            // LIMPIAR FECHA/HORA/MOTIVO
            // --------------------------------------------------

            setFechaSeleccionada("");
            setHoraSeleccionada("");

            setFormulario((actual) => ({
                ...actual,
                scheduled_start: "",
                reason: ""
            }));

        } catch (submitError) {
            console.error(
                "Error creando consulta:",
                submitError
            );

            setError(
                submitError.message ||
                "No se pudo crear la consulta."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // SI NO HAY PACIENTE
    // ======================================================

    if (!patient) {
        return (
            <div className="container py-5 text-white">

                <div className="alert alert-warning">
                    No se ha seleccionado ningún paciente.
                </div>

                <Link
                    to="/dashboard/medico"
                    className="btn btn-outline-light rounded-pill"
                >
                    Volver al dashboard médico
                </Link>

            </div>
        );
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="text-white py-4">

            <div className="container">

                {/* ==================================================
                    CABECERA
                ================================================== */}

                <div className="row justify-content-center mb-4">

                    <div className="col-12 col-xl-9">

                        <div className="text-center">

                            <div className="d-flex justify-content-end mb-3">

                                <Link
                                    to="/dashboard/medico"
                                    className="btn btn-outline-light rounded-pill"
                                >
                                    Volver al dashboard médico
                                </Link>

                            </div>

                            

                            <h1 className="h2 fw-bold mb-1 mt-1 text-info">
                                Nueva consulta
                            </h1>

                            <p className="text-white-50 mb-0">
                                Programa una consulta para el paciente seleccionado.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    CONTENIDO
                ================================================== */}

                <div className="row justify-content-center">

                    <div className="col-12 col-xl-9">

                        {/* ==================================================
                            PACIENTE
                        ================================================== */}

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4 shadow-sm">

                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="rounded-circle bg-info bg-opacity-25 text-info d-flex align-items-center justify-content-center fw-bold"
                                    style={{
                                        width: "56px",
                                        height: "56px"
                                    }}
                                >
                                    {nombrePaciente
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <span className="text-white-50 small">
                                        Paciente
                                    </span>

                                    <h2 className="h4 fw-bold mb-1">
                                        {nombrePaciente}
                                    </h2>

                                    <div className="text-white-50 small">
                                        DNI: {dniPaciente}
                                    </div>

                                    <div className="text-white-50 small">
                                        Paciente #{patient.id}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            FORMULARIO
                        ================================================== */}

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 shadow-sm">

                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >

                                    <div className="fw-semibold">
                                        {success}
                                    </div>

                                    {consultaCreada?.id && (
                                        <div className="small mt-1">
                                            Consulta #{consultaCreada.id}
                                        </div>
                                    )}

                                    {consultaCreada?.doctor_asignado && (
                                        <div className="small mt-2">
                                            <strong>
                                                Médico asignado:
                                            </strong>{" "}
                                            {consultaCreada.doctor_asignado.first_name}{" "}
                                            {consultaCreada.doctor_asignado.last_name}
                                        </div>
                                    )}

                                    {consultaCreada?.doctor_asignado?.specialty_name && (
                                        <div className="small">
                                            <strong>
                                                Especialidad:
                                            </strong>{" "}
                                            {consultaCreada.doctor_asignado.specialty_name}
                                        </div>
                                    )}

                                    {consultaCreada?.modality ===
                                        "virtual" &&
                                        consultaCreada?.id && (
                                            <Link
                                                to={`/teleconsulta/${consultaCreada.id}`}
                                                className="btn btn-info rounded-pill mt-3"
                                            >
                                                🎥 Entrar a teleconsulta
                                            </Link>
                                        )}

                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="row g-4">

                                    {/* ==================================================
                                        ESPECIALIDAD
                                    ================================================== */}

                                    <div className="col-12 col-md-6">

                                        <label
                                            htmlFor="specialty_id"
                                            className="form-label fw-semibold"
                                        >
                                            Especialidad
                                        </label>

                                        <select
                                            id="specialty_id"
                                            name="specialty_id"
                                            className="form-select bg-dark text-white border-secondary"
                                            value={
                                                formulario.specialty_id
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            required
                                            disabled={
                                                cargandoEspecialidades ||
                                                loading
                                            }
                                        >

                                            <option value="">
                                                {cargandoEspecialidades
                                                    ? "Cargando especialidades..."
                                                    : "Selecciona una especialidad"}
                                            </option>

                                            {especialidades.map(
                                                (especialidad) => (
                                                    <option
                                                        key={
                                                            especialidad.id
                                                        }
                                                        value={
                                                            especialidad.id
                                                        }
                                                    >
                                                        {
                                                            especialidad.name
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <div className="form-text text-white-50">
                                            El sistema asignará un médico
                                            disponible de esta especialidad.
                                        </div>

                                    </div>

                                    {/* ==================================================
                                        TIPO DE CONSULTA
                                    ================================================== */}

                                    <div className="col-12 col-md-6">

                                        <label
                                            htmlFor="appointment_type"
                                            className="form-label fw-semibold"
                                        >
                                            Tipo de consulta
                                        </label>

                                        <input
                                            id="appointment_type"
                                            name="appointment_type"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={
                                                formulario.appointment_type
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            required
                                            disabled={loading}
                                        />

                                    </div>

                                    {/* ==================================================
                                        MODALIDAD
                                    ================================================== */}

                                    <div className="col-12 col-md-6">

                                        <label
                                            htmlFor="modality"
                                            className="form-label fw-semibold"
                                        >
                                            Modalidad
                                        </label>

                                        <select
                                            id="modality"
                                            name="modality"
                                            className="form-select bg-dark text-white border-secondary"
                                            value={
                                                formulario.modality
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            required
                                            disabled={loading}
                                        >

                                            <option value="presencial">
                                                Presencial
                                            </option>

                                            <option value="virtual">
                                                Virtual
                                            </option>

                                        </select>

                                    </div>

                                    {/* ==================================================
                                        ESTADO
                                    ================================================== */}

                                    <div className="col-12 col-md-6">

                                        <label
                                            htmlFor="status"
                                            className="form-label fw-semibold"
                                        >
                                            Estado
                                        </label>

                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select bg-dark text-white border-secondary"
                                            value={
                                                formulario.status
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            disabled={loading}
                                        >

                                            <option value="scheduled">
                                                Programada
                                            </option>

                                            <option value="confirmed">
                                                Confirmada
                                            </option>

                                            <option value="cancelled">
                                                Cancelada
                                            </option>

                                        </select>

                                    </div>

                                    {/* ==================================================
                                        CALENDARIO
                                    ================================================== */}

                                    <div className="col-12">

                                        <label className="form-label fw-semibold">
                                            Fecha de la consulta
                                        </label>

                                        <div className="border border-secondary border-opacity-50 rounded-4 p-3 p-md-4">

                                            <div className="d-flex justify-content-between align-items-center mb-4">

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-light rounded-circle"
                                                    style={{
                                                        width: "42px",
                                                        height: "42px"
                                                    }}
                                                    onClick={() =>
                                                        cambiarMes(-1)
                                                    }
                                                    disabled={
                                                        (
                                                            mesActual ===
                                                            hoy.getMonth()
                                                        ) &&
                                                        (
                                                            añoActual ===
                                                            hoy.getFullYear()
                                                        )
                                                    }
                                                >
                                                    ‹
                                                </button>

                                                <h2 className="h5 fw-bold text-capitalize mb-0">
                                                    {obtenerNombreMes(
                                                        mesActual,
                                                        añoActual
                                                    )}
                                                </h2>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-light rounded-circle"
                                                    style={{
                                                        width: "42px",
                                                        height: "42px"
                                                    }}
                                                    onClick={() =>
                                                        cambiarMes(1)
                                                    }
                                                >
                                                    ›
                                                </button>

                                            </div>

                                            {/* CABECERA */}

                                            <div
                                                className="mb-2"
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(7, minmax(0, 1fr))",
                                                    gap: "0.5rem"
                                                }}
                                            >

                                                {[
                                                    "Lun",
                                                    "Mar",
                                                    "Mié",
                                                    "Jue",
                                                    "Vie",
                                                    "Sáb",
                                                    "Dom"
                                                ].map(
                                                    (dia) => (
                                                        <div
                                                            key={dia}
                                                            className="text-center text-white-50 small fw-semibold"
                                                        >
                                                            {dia}
                                                        </div>
                                                    )
                                                )}

                                            </div>

                                            {/* DÍAS */}

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(7, minmax(0, 1fr))",
                                                    gap: "0.5rem"
                                                }}
                                            >

                                                {diasCalendario.map(
                                                    (
                                                        fecha,
                                                        index
                                                    ) => {

                                                        if (!fecha) {
                                                            return (
                                                                <div
                                                                    key={`empty-${index}`}
                                                                    style={{
                                                                        minWidth: 0,
                                                                        height: "52px"
                                                                    }}
                                                                />
                                                            );
                                                        }

                                                        const fechaString =
                                                            formatearFechaInput(
                                                                fecha
                                                            );

                                                        const fechaHoy =
                                                            formatearFechaInput(
                                                                hoy
                                                            );

                                                        const esAnterior =
                                                            fecha < hoy;

                                                        const esHoy =
                                                            fechaString ===
                                                            fechaHoy;

                                                        const finDeSemana =
                                                            esFinDeSemana(
                                                                fecha
                                                            );

                                                        const seleccionada =
                                                            fechaString ===
                                                            fechaSeleccionada;

                                                        const deshabilitada =
                                                            esAnterior ||
                                                            finDeSemana;

                                                        return (
                                                            <div
                                                                key={
                                                                    fechaString
                                                                }
                                                                style={{
                                                                    minWidth: 0,
                                                                    width: "100%"
                                                                }}
                                                            >

                                                                <button
                                                                    type="button"
                                                                    className={`w-100 rounded-3 fw-semibold ${
                                                                        seleccionada
                                                                            ? "btn btn-info text-dark"
                                                                            : esHoy
                                                                                ? "btn btn-outline-info"
                                                                                : deshabilitada
                                                                                    ? "btn btn-outline-secondary text-white-50"
                                                                                    : "btn btn-outline-light"
                                                                    }`}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "52px",
                                                                        minHeight: "52px",
                                                                        padding: "4px",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }}
                                                                    disabled={
                                                                        deshabilitada ||
                                                                        loading
                                                                    }
                                                                    onClick={() =>
                                                                        seleccionarFecha(
                                                                            fecha
                                                                        )
                                                                    }
                                                                >

                                                                    <span>
                                                                        {
                                                                            fecha.getDate()
                                                                        }
                                                                    </span>

                                                                    {esHoy && (
                                                                        <small
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.65rem",
                                                                                lineHeight:
                                                                                    "1"
                                                                            }}
                                                                        >
                                                                            Hoy
                                                                        </small>
                                                                    )}

                                                                </button>

                                                            </div>
                                                        );
                                                    }
                                                )}

                                            </div>

                                            <div className="d-flex flex-wrap gap-3 mt-4 text-white-50 small">

                                                <div className="d-flex align-items-center gap-2">

                                                    <span
                                                        className="bg-info rounded-circle"
                                                        style={{
                                                            width: "10px",
                                                            height: "10px"
                                                        }}
                                                    />

                                                    Día seleccionado

                                                </div>

                                                <div>
                                                    Lunes a viernes
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ==================================================
                                        HORAS
                                    ================================================== */}

                                    {fechaSeleccionada && (
                                        <div className="col-12">

                                            <label className="form-label fw-semibold">
                                                Hora de la consulta
                                            </label>

                                            <div className="border border-secondary border-opacity-50 rounded-4 p-3 p-md-4">

                                                <div className="mb-3">

                                                    <span className="text-info text-uppercase small fw-semibold">
                                                        Horas disponibles
                                                    </span>

                                                    <p className="text-white-50 small mb-0 mt-1 text-capitalize">
                                                        {formatearFechaBonita(
                                                            fechaSeleccionada
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="row g-2">

                                                    {HORAS_DISPONIBLES.map(
                                                        (hora) => {

                                                            const yaHaPasado =
                                                                horaYaHaPasado(
                                                                    fechaSeleccionada,
                                                                    hora
                                                                );

                                                            const seleccionada =
                                                                hora ===
                                                                horaSeleccionada;

                                                            return (
                                                                <div
                                                                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                                                                    key={hora}
                                                                >

                                                                    <button
                                                                        type="button"
                                                                        className={`btn w-100 rounded-pill ${
                                                                            seleccionada
                                                                                ? "btn-info text-dark fw-bold"
                                                                                : yaHaPasado
                                                                                    ? "btn-secondary text-white"
                                                                                    : "btn-outline-light"
                                                                        }`}
                                                                        disabled={
                                                                            yaHaPasado ||
                                                                            loading
                                                                        }
                                                                        onClick={() =>
                                                                            seleccionarHora(
                                                                                hora
                                                                            )
                                                                        }
                                                                    >
                                                                        {hora}
                                                                    </button>

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                                <div className="text-white-50 small mt-3">
                                                    Horario provisional:
                                                    {" "}
                                                    08:00 - 18:00
                                                    {" · "}
                                                    Lunes a viernes
                                                    {" · "}
                                                    Duración: 30 minutos
                                                </div>

                                            </div>

                                        </div>
                                    )}

                                    {/* ==================================================
                                        RESUMEN
                                    ================================================== */}

                                    {fechaSeleccionada &&
                                        horaSeleccionada && (
                                            <div className="col-12">

                                                <div className="border border-info border-opacity-50 rounded-3 p-3">

                                                    <span className="text-info small text-uppercase fw-semibold">
                                                        Cita seleccionada
                                                    </span>

                                                    <div className="fw-semibold mt-1">
                                                        {nombrePaciente}
                                                    </div>

                                                    <p className="mb-0 text-white-50 text-capitalize">
                                                        {formatearFechaBonita(
                                                            fechaSeleccionada
                                                        )}
                                                        {" · "}
                                                        {horaSeleccionada}
                                                        {" · "}
                                                        {formulario.specialty_id &&
                                                            (
                                                                especialidades.find(
                                                                    (
                                                                        especialidad
                                                                    ) =>
                                                                        String(
                                                                            especialidad.id
                                                                        ) ===
                                                                        String(
                                                                            formulario.specialty_id
                                                                        )
                                                                )?.name ||
                                                                "Especialidad"
                                                            )}
                                                        {" · "}
                                                        {formulario.modality ===
                                                        "virtual"
                                                            ? "Consulta virtual"
                                                            : "Consulta presencial"}
                                                    </p>

                                                </div>

                                            </div>
                                        )}

                                    {/* ==================================================
                                        MOTIVO
                                    ================================================== */}

                                    <div className="col-12">

                                        <label
                                            htmlFor="reason"
                                            className="form-label fw-semibold"
                                        >
                                            Motivo de la consulta
                                        </label>

                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows="4"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={
                                                formulario.reason
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            placeholder="Describe el motivo de la consulta"
                                            disabled={loading}
                                        />

                                    </div>

                                </div>

                                {/* ==================================================
                                    BOTONES
                                ================================================== */}

                                <div className="d-flex justify-content-end gap-2 mt-4">

                                    <Link
                                        to="/dashboard/medico"
                                        className="btn btn-danger rounded-pill"
                                    >
                                        Cancelar
                                    </Link>

                                    <button
                                        type="submit"
                                        className="btn btn-success rounded-pill fw-semibold"
                                        disabled={
                                            loading ||
                                            cargandoEspecialidades ||
                                            !formulario.specialty_id ||
                                            !fechaSeleccionada ||
                                            !horaSeleccionada
                                        }
                                    >
                                        {loading
                                            ? "Guardando..."
                                            : "Guardar consulta"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};