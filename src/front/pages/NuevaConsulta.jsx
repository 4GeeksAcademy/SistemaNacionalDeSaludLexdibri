import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../components/Icon";

// ==========================================================
// HORARIO PROVISIONAL
// ==========================================================
// Mientras no exista un horario real asociado al médico:
//
// Lunes - Viernes
// 08:00 - 18:00
//
// Cada 30 minutos.
// ==========================================================

const HORA_INICIO = 8;
const HORA_FIN = 18;
const INTERVALO_MINUTOS = 30;

// ==========================================================
// GENERAR HORAS
// ==========================================================

const generarHoras = () => {
    const horas = [];

    for (let hora = HORA_INICIO; hora < HORA_FIN; hora++) {
        horas.push(
            `${String(hora).padStart(2, "0")}:00`
        );

        horas.push(
            `${String(hora).padStart(2, "0")}:30`
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

    // Domingo = 0
    // Convertimos para que lunes sea la primera columna.
    const diaSemanaPrimerDia =
        primerDia.getDay() === 0
            ? 6
            : primerDia.getDay() - 1;

    // Huecos antes del día 1
    for (let i = 0; i < diaSemanaPrimerDia; i++) {
        dias.push(null);
    }

    // Días reales
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

    // Día futuro
    if (fechaString > fechaHoy) {
        return false;
    }

    // Día anterior
    if (fechaString < fechaHoy) {
        return true;
    }

    // Hoy
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
// COMPONENTE
// ==========================================================

export const NuevaConsulta = () => {
    const { state } = useLocation();

    const patient = state?.patient;

    const hoy = obtenerHoy();

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

    const [formulario, setFormulario] = useState({
        appointment_type: "Consulta médica",
        modality: "presencial",
        scheduled_start: "",
        status: "scheduled",
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [consultaCreada, setConsultaCreada] =
        useState(null);

    // ======================================================
    // DÍAS DEL CALENDARIO
    // ======================================================

    const diasCalendario = generarDiasCalendario(
        mesActual,
        añoActual
    );

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

        // No permitir navegar a meses anteriores
        // al mes actual.
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

        const hoyActual = obtenerHoy();

        // No permitir días anteriores.
        if (fecha < hoyActual) {
            return;
        }

        // No permitir fines de semana.
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
        const { name, value } = event.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // ======================================================
    // ENVIAR
    // ======================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setConsultaCreada(null);

        if (!patient?.id) {
            setError(
                "No se ha seleccionado ningún paciente."
            );
            return;
        }

        if (!fechaSeleccionada) {
            setError(
                "Selecciona un día para la consulta."
            );
            return;
        }

        if (!horaSeleccionada) {
            setError(
                "Selecciona una hora para la consulta."
            );
            return;
        }

        // --------------------------------------------------
        // Comprobar fecha
        // --------------------------------------------------

        const hoyActual = obtenerHoy();

        const [year, month, day] =
            fechaSeleccionada
                .split("-")
                .map(Number);

        const fechaCita = crearFechaLocal(
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
        // Comprobar fin de semana
        // --------------------------------------------------

        if (esFinDeSemana(fechaCita)) {
            setError(
                "Las consultas no pueden programarse los fines de semana."
            );
            return;
        }

        // --------------------------------------------------
        // Comprobar hora
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

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/consultas`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formulario)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "No se pudo crear la consulta."
                );
            }

            const consulta = data.consulta;

            if (!consulta?.id) {
                throw new Error(
                    "La consulta se creó, pero el servidor no devolvió su identificador."
                );
            }

            setConsultaCreada(consulta);

            setSuccess(
                consulta.modality === "virtual"
                    ? "Consulta virtual creada correctamente."
                    : "Consulta creada correctamente."
            );

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
                submitError.message
            );
        } finally {
            setLoading(false);
        }
    };

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

                            <span className="text-info text-uppercase small fw-semibold">
                                Agenda
                            </span>

                            <h1 className="h2 fw-bold mb-1 mt-1">
                                Nueva consulta
                            </h1>

                            <p className="text-white-50 mb-0">
                                Programa una consulta para el paciente seleccionado.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    CONTENIDO PRINCIPAL
                ================================================== */}

                <div className="row justify-content-center">

                    <div className="col-12 col-xl-9">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 shadow-sm">

                            {/* ==================================================
                                PACIENTE
                            ================================================== */}

                            <div className="d-flex align-items-center gap-3 border-bottom border-secondary border-opacity-50 pb-3 mb-4">

                                <div
                                    className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center fs-4"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >
                                    +
                                </div>

                                <div>

                                    <span className="text-white-50 small">
                                        Paciente
                                    </span>

                                    <h2 className="h5 fw-bold mb-0">
                                        {patient
                                            ? `${patient.nombre} ${patient.apellidos || ""}`
                                            : "No seleccionado"}
                                    </h2>

                                    {patient && (
                                        <span className="text-white-50 small">
                                            Paciente #{patient.id}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {!patient && (
                                <div
                                    className="alert alert-warning"
                                    role="alert"
                                >
                                    Accede a esta página desde el botón Nueva consulta de un paciente.
                                </div>
                            )}

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
                                    <div>
                                        {success}
                                    </div>

                                    {consultaCreada?.modality === "virtual" && (
                                        <Link
                                            to={`/teleconsulta/${consultaCreada.id}`}
                                            className="btn btn-info rounded-pill mt-3"
                                        >
                                            <Icon name="Video" className="me-1" />Entrar a teleconsulta
                                        </Link>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="row g-4">

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
                                                        mesActual ===
                                                        hoy.getMonth() &&
                                                        añoActual ===
                                                        hoy.getFullYear()
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

                                            {/* ==================================================
                                                CABECERA DE LOS DÍAS
                                            ================================================== */}

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
                                                ].map((dia) => (
                                                    <div
                                                        key={dia}
                                                        style={{
                                                            minWidth: 0
                                                        }}
                                                    >
                                                        <div
                                                            className="text-center text-white-50 small fw-semibold"
                                                            style={{
                                                                height: "32px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            {dia}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>

                                            {/* ==================================================
                                                DÍAS DEL MES
                                            ================================================== */}

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(7, minmax(0, 1fr))",
                                                    gap: "0.5rem"
                                                }}
                                            >

                                                {diasCalendario.map(
                                                    (fecha, index) => {

                                                        // ------------------------------------------
                                                        // HUECO
                                                        // ------------------------------------------

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

                                                        // ------------------------------------------
                                                        // DATOS DEL DÍA
                                                        // ------------------------------------------

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
                                                                    className={`w-100 rounded-3 fw-semibold ${seleccionada
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
                                                                        deshabilitada
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

                                            {/* ==================================================
                                                LEYENDA
                                            ================================================== */}

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
                                                                        className={`btn w-100 rounded-pill ${seleccionada
                                                                                ? "btn-info text-dark fw-bold"
                                                                                : yaHaPasado
                                                                                    ? "btn-secondary text-white"
                                                                                    : "btn-outline-light"
                                                                            }`}
                                                                        disabled={
                                                                            yaHaPasado
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

                                                <div className="d-flex flex-wrap gap-3 mt-3 text-white-50 small">

                                                    <div>
                                                        Horario provisional:
                                                        {" "}
                                                        08:00 - 18:00
                                                        {" · "}
                                                        Lunes a viernes
                                                    </div>

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

                                                    <p className="mb-0 mt-1 text-white text-capitalize">
                                                        {formatearFechaBonita(
                                                            fechaSeleccionada
                                                        )}
                                                        {" · "}
                                                        {horaSeleccionada}
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
                                            !patient ||
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