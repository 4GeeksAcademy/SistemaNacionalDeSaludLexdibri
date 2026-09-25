import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const HistorialClinico = () => {
    const { state } = useLocation();
    const patient = state?.patient;

    // ==========================================================
    // ESTADOS
    // ==========================================================

    const [enfermedades, setEnfermedades] = useState([]);
    const [cargandoEnfermedades, setCargandoEnfermedades] = useState(false);
    const [errorEnfermedades, setErrorEnfermedades] = useState("");

    const [alergias, setAlergias] = useState([]);
    const [cargandoAlergias, setCargandoAlergias] = useState(false);
    const [errorAlergias, setErrorAlergias] = useState("");

    const [vacunas, setVacunas] = useState([]);
    const [cargandoVacunas, setCargandoVacunas] = useState(false);
    const [errorVacunas, setErrorVacunas] = useState("");

    const [cirugias, setCirugias] = useState([]);
    const [cargandoCirugias, setCargandoCirugias] = useState(false);
    const [errorCirugias, setErrorCirugias] = useState("");

    const [recetas, setRecetas] = useState([]);
    const [cargandoRecetas, setCargandoRecetas] = useState(false);
    const [errorRecetas, setErrorRecetas] = useState("");

    const [consultas, setConsultas] = useState([]);
    const [cargandoConsultas, setCargandoConsultas] = useState(false);
    const [errorConsultas, setErrorConsultas] = useState("");

    // ==========================================================
    // MOSTRAR MÁS / MENOS
    // ==========================================================

    const [mostrarTodasEnfermedades, setMostrarTodasEnfermedades] =
        useState(false);

    const [mostrarTodasAlergias, setMostrarTodasAlergias] =
        useState(false);

    const [mostrarTodasVacunas, setMostrarTodasVacunas] =
        useState(false);

    const [mostrarTodasCirugias, setMostrarTodasCirugias] =
        useState(false);

    const [mostrarTodasConsultas, setMostrarTodasConsultas] =
        useState(false);

    const [mostrarTodasRecetas, setMostrarTodasRecetas] =
        useState(false);

    // ==========================================================
    // CARGAR ENFERMEDADES
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarEnfermedades = async () => {
            setCargandoEnfermedades(true);
            setErrorEnfermedades("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/enfermedades`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las enfermedades."
                    );
                }

                setEnfermedades(data.enfermedades || []);

            } catch (error) {
                setErrorEnfermedades(error.message);
            } finally {
                setCargandoEnfermedades(false);
            }
        };

        cargarEnfermedades();
    }, [patient?.id]);

    // ==========================================================
    // CARGAR ALERGIAS
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarAlergias = async () => {
            setCargandoAlergias(true);
            setErrorAlergias("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/alergias`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las alergias."
                    );
                }

                setAlergias(data.alergias || []);

            } catch (error) {
                setErrorAlergias(error.message);
            } finally {
                setCargandoAlergias(false);
            }
        };

        cargarAlergias();
    }, [patient?.id]);

    // ==========================================================
    // CARGAR VACUNAS
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarVacunas = async () => {
            setCargandoVacunas(true);
            setErrorVacunas("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/vacunas`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las vacunas."
                    );
                }

                setVacunas(data.vacunas || []);

            } catch (error) {
                setErrorVacunas(error.message);
            } finally {
                setCargandoVacunas(false);
            }
        };

        cargarVacunas();
    }, [patient?.id]);

    // ==========================================================
    // CARGAR CIRUGÍAS
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarCirugias = async () => {
            setCargandoCirugias(true);
            setErrorCirugias("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/cirugias`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las cirugías."
                    );
                }

                setCirugias(data.cirugias || []);

            } catch (error) {
                setErrorCirugias(error.message);
            } finally {
                setCargandoCirugias(false);
            }
        };

        cargarCirugias();
    }, [patient?.id]);

    // ==========================================================
    // CARGAR CONSULTAS
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarConsultas = async () => {
            setCargandoConsultas(true);
            setErrorConsultas("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patient.id}/consultas`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las consultas."
                    );
                }

                setConsultas(data.consultas || []);

            } catch (error) {
                setErrorConsultas(error.message);
            } finally {
                setCargandoConsultas(false);
            }
        };

        cargarConsultas();
    }, [patient?.id]);

    // ==========================================================
    // CARGAR RECETAS
    // ==========================================================

    useEffect(() => {
        if (!patient?.id) return;

        const cargarRecetas = async () => {
            setCargandoRecetas(true);
            setErrorRecetas("");

            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medico/recetas`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las recetas."
                    );
                }

                setRecetas(
                    (data.prescriptions || []).filter(
                        (receta) =>
                            String(receta.patient_id) ===
                            String(patient.id)
                    )
                );

            } catch (error) {
                setErrorRecetas(error.message);
            } finally {
                setCargandoRecetas(false);
            }
        };

        cargarRecetas();
    }, [patient?.id]);

    // ==========================================================
    // DATOS DEL PACIENTE
    // ==========================================================

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) {
            return "No disponible";
        }

        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();

        let edad =
            hoy.getFullYear() -
            nacimiento.getFullYear();

        const noHaCumplido =
            hoy.getMonth() <
            nacimiento.getMonth() ||
            (
                hoy.getMonth() ===
                nacimiento.getMonth() &&
                hoy.getDate() <
                nacimiento.getDate()
            );

        if (noHaCumplido) {
            edad -= 1;
        }

        return edad;
    };

    const formatearNacimiento = (fechaNacimiento) => {
        if (!fechaNacimiento) {
            return "No disponible";
        }

        return new Date(
            fechaNacimiento
        ).toLocaleDateString("es-ES");
    };

    const paciente = {
        nombre: patient
            ? `${patient.nombre} ${patient.apellidos}`
            : "Paciente no seleccionado",

        id: patient?.id || "No disponible",

        edad: calcularEdad(
            patient?.fecha_nacimiento
        ),

        sexo: patient?.sexo || "No disponible",

        tipoSangre: patient?.grupo_sanguineo || "No disponible",

        nacimiento: formatearNacimiento(
            patient?.fecha_nacimiento
        ),
    };

    // ==========================================================
    // ORDEN ENFERMEDADES
    // ==========================================================

    const [orden, setOrden] = useState("recientes");

    const antecedentesFiltrados = useMemo(() => {
        const resultado = [...enfermedades];

        resultado.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);

            return orden === "recientes"
                ? fechaB - fechaA
                : fechaA - fechaB;
        });

        return resultado;
    }, [enfermedades, orden]);

    // ==========================================================
    // ORDEN ALERGIAS
    // ==========================================================

    const alergiasOrdenadas = useMemo(() => {
        const resultado = [...alergias];

        resultado.sort((a, b) => {
            const fechaA = new Date(a.created_at);
            const fechaB = new Date(b.created_at);

            return fechaB - fechaA;
        });

        return resultado;
    }, [alergias]);

    // ==========================================================
    // ELEMENTOS VISIBLES
    // ==========================================================

    const enfermedadesVisibles =
        mostrarTodasEnfermedades
            ? antecedentesFiltrados
            : antecedentesFiltrados.slice(0, 4);

    const alergiasVisibles =
        mostrarTodasAlergias
            ? alergiasOrdenadas
            : alergiasOrdenadas.slice(0, 4);

    const vacunasVisibles =
        mostrarTodasVacunas
            ? vacunas
            : vacunas.slice(0, 4);

    const cirugiasVisibles =
        mostrarTodasCirugias
            ? cirugias
            : cirugias.slice(0, 4);

    const consultasVisibles =
        mostrarTodasConsultas
            ? consultas
            : consultas.slice(0, 4);

    const recetasVisibles =
        mostrarTodasRecetas
            ? recetas
            : recetas.slice(0, 4);

    // ==========================================================
    // FORMATEAR FECHA
    // ==========================================================

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "No disponible";
        }

        return new Date(fecha).toLocaleDateString(
            "es-ES",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    // ==========================================================
    // ESTADO RECETA
    // ==========================================================

    const formatearEstadoReceta = (estado) => {
        const estados = {
            active: "Activa",
            cancelled: "Cancelada",
            expired: "Caducada"
        };

        return (
            estados[estado] ||
            estado ||
            "Sin estado"
        );
    };

    // ==========================================================
    // ESTADO CONSULTA
    // ==========================================================

    const formatearEstadoConsulta = (estado) => {
        const estados = {
            scheduled: "Programada",
            confirmed: "Confirmada",
            cancelled: "Cancelada",
            completed: "Completada"
        };

        return (
            estados[estado] ||
            estado ||
            "Sin estado"
        );
    };

    // ==========================================================
    // INICIALES
    // ==========================================================

    const iniciales = paciente.nombre
        .split(" ")
        .map((nombre) => nombre[0])
        .slice(0, 2)
        .join("");

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div className="container text-white py-4">

            {/* ==================================================
                CABECERA
            ================================================== */}

            <div className="row justify-content-center mb-4">

                <div className="col-12">

                    <div className="text-center">

                        <div className="d-flex justify-content-end mb-3">

                            <Link
                                to="/dashboard/medico"
                                className="btn btn-outline-light rounded-pill"
                            >
                                Volver al dashboard médico
                            </Link>

                        </div>

                        <h1 className="h2 text-info fw-bold mb-1">
                            Historial clínico
                        </h1>

                        <p className="text-white mb-0">
                            Consulta los antecedentes y tratamientos del paciente.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                INFORMACIÓN DEL PACIENTE
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="row align-items-center">

                        <div className="col-auto">

                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    fontSize: "1.3rem",
                                }}
                            >
                                {iniciales}
                            </div>

                        </div>

                        <div className="col">

                            <div className="d-flex flex-wrap align-items-center gap-2">

                                <h3 className="text-info fw-bold mb-0">
                                    {paciente.nombre}
                                </h3>

                                <span className="badge bg-info bg-opacity-25 text-info border border-info">
                                    {paciente.id}
                                </span>

                                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger">
                                    Tipo de sangre: {paciente.tipoSangre}
                                </span>

                            </div>

                            <div className="text-white-50 mt-2">

                                {paciente.edad} años

                                <span className="mx-2">
                                    •
                                </span>

                                {paciente.sexo}

                                <span className="mx-2">
                                    •
                                </span>

                                Fecha de nacimiento:
                                {" "}
                                {paciente.nacimiento}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                ENFERMEDADES
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Enfermedades del paciente
                            </h2>

                            <p className="text-white mb-0">
                               Enfermedades registradas al paciente.
                            </p>

                        </div>

                        <div>

                            <label
                                htmlFor="orden"
                                className="border rounded  bg-info bg-opacity-10 text-info border-info"
                            >
                                Ordenar por :
                            </label>

                            <select
                                id="orden"
                                className="form-select bg-info bg-opacity-10 text-info border-info"
                                value={orden}
                                onChange={(e) => {
                                    setOrden(e.target.value);
                                    setMostrarTodasEnfermedades(false);
                                }}
                            >

                                <option value="recientes" className=" bg-info bg-opacity-10">
                                    Más recientes
                                </option>

                                <option value="antiguos" className=" bg-info bg-opacity-10">
                                    Más antiguos
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <span className="text-white-50 small">

                            Mostrando{" "}

                            <strong>
                                {enfermedadesVisibles.length}
                            </strong>

                            {" "}de{" "}

                            <strong>
                                {antecedentesFiltrados.length}
                            </strong>

                            {" "}
                            enfermedades

                        </span>

                    </div>

                    {cargandoEnfermedades ? (

                        <p className="text-white mb-0">
                            Cargando enfermedades...
                        </p>

                    ) : errorEnfermedades ? (

                        <p className="text-warning mb-0">
                            {errorEnfermedades}
                        </p>

                    ) : antecedentesFiltrados.length > 0 ? (

                        <div>

                            {enfermedadesVisibles.map(
                                (antecedente) => (

                                    <div
                                        key={antecedente.id}
                                        className="border border-secondary border-opacity-50 rounded-3 p-3 p-md-4 mb-3"
                                    >

                                        <div className="row g-3">

                                            <div className="col-md-3 col-lg-2">

                                                <div className="small text-white">
                                                    Detectada
                                                </div>

                                                <div className="fw-semibold text-white mt-1">
                                                    {formatearFecha(
                                                        antecedente.fecha
                                                    )}
                                                </div>

                                            </div>

                                            <div className="col-md-9 col-lg-10">

                                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">

                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor: "#9945ff",
                                                            color: "#ffffff",
                                                        }}
                                                    >
                                                        Enfermedad
                                                    </span>

                                                    <span className="badge bg-danger text-light ">
                                                        {antecedente.estado}
                                                    </span>

                                                </div>

                                                <h3 className="h5 text-info fw-bold mb-2">
                                                    {antecedente.nombre}
                                                </h3>

                                                <div className="small text-white">

                                                    <strong>
                                                        Descripción:
                                                    </strong>

                                                    {" "}

                                                    {antecedente.detalle}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                            {antecedentesFiltrados.length > 4 && (

                                <div className="d-flex justify-content-center mt-3">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasEnfermedades(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasEnfermedades
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <div className="text-center py-5">

                            <div className="mb-3">

                                <span
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-50 text-white"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    —
                                </span>

                            </div>

                            <h3 className="h5 text-info fw-bold">
                                No hay enfermedades registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente no tiene enfermedades registradas.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* ==================================================
                ALERGIAS
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Alergias del paciente
                            </h2>

                            <p className="text-white mb-0">
                                Alergias registradas y la fecha en la que fueron detectadas al paciente.
                            </p>

                        </div>

                        <span className="badge bg-info bg-opacity-25 text-info border border-info align-self-start">

                            {alergias.length}

                            {" "}

                            {alergias.length === 1
                                ? "alergia"
                                : "alergias"}

                        </span>

                    </div>

                    {cargandoAlergias ? (

                        <div className="d-flex align-items-center gap-2 text-white-50">

                            <div
                                className="spinner-border spinner-border-sm text-info"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            Cargando alergias...

                        </div>

                    ) : errorAlergias ? (

                        <div
                            className="alert alert-warning mb-0"
                            role="alert"
                        >
                            {errorAlergias}
                        </div>

                    ) : alergiasOrdenadas.length > 0 ? (

                        <div>

                            {alergiasVisibles.map(
                                (alergia) => (

                                    <div
                                        key={alergia.id}
                                        className="border border-secondary border-opacity-50 rounded-3 p-3 p-md-4 mb-3"
                                    >

                                        <div className="row g-3">

                                            {/* FECHA */}
                                            <div className="col-md-3 col-lg-2">

                                                <div className="small text-white">
                                                    Detectada
                                                </div>

                                                <div className="fw-semibold text-white mt-1">
                                                    {formatearFecha(
                                                        alergia.created_at
                                                    )}
                                                </div>

                                            </div>

                                            {/* INFORMACIÓN */}
                                            <div className="col-md-9 col-lg-10">

                                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">

                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor: "#dc3545",
                                                            color: "#ffffff",
                                                        }}
                                                    >
                                                        Alergia
                                                    </span>

                                                    {alergia.severity && (
                                                        <span
                                                            className={`badge ${alergia.severity === "Grave"
                                                                ? "bg-danger"
                                                                : alergia.severity === "Moderada"
                                                                    ? "bg-warning text-dark"
                                                                    : "bg-success"
                                                                }`}
                                                        >
                                                            {alergia.severity}
                                                        </span>
                                                    )}

                                                </div>

                                                <h3 className="h5 text-info fw-bold mb-2">
                                                    {alergia.allergen}
                                                </h3>

                                                {alergia.reaction && (

                                                    <div className="small text-white mb-2">

                                                        <strong>
                                                            Reacción:
                                                        </strong>

                                                        {" "}

                                                        {alergia.reaction}

                                                    </div>

                                                )}

                                                {alergia.notes && (

                                                    <div className="small text-white">

                                                        <strong>
                                                            Observaciones:
                                                        </strong>

                                                        {" "}

                                                        {alergia.notes}

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                            {alergias.length > 4 && (

                                <div className="d-flex justify-content-center mt-3">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasAlergias(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasAlergias
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <div className="text-center py-5">

                            <div className="mb-3">

                                <span
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-50 text-white"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    —
                                </span>

                            </div>

                            <h3 className="h5 text-info fw-bold">
                                No hay alergias registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente no tiene alergias registradas.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* ==================================================
    VACUNAS
================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Vacunas
                            </h2>

                            <p className="text-white mb-0">
                                Historial de vacunas administradas al paciente.
                            </p>

                        </div>

                        <span className="badge bg-info bg-opacity-25 text-info border border-info">

                            {vacunas.length}

                            {" "}

                            {vacunas.length === 1
                                ? "vacuna"
                                : "vacunas"}

                        </span>

                    </div>

                    {cargandoVacunas ? (

                        <div className="d-flex align-items-center gap-2 text-white-50">

                            <div
                                className="spinner-border spinner-border-sm text-info"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            Cargando vacunas...

                        </div>

                    ) : errorVacunas ? (

                        <div
                            className="alert alert-warning mb-0"
                            role="alert"
                        >
                            {errorVacunas}
                        </div>

                    ) : vacunas.length === 0 ? (

                        <div className="text-center py-5">

                            <div className="mb-3">

                                <span
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-50 text-white"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    —
                                </span>

                            </div>

                            <h3 className="h5 text-info fw-bold">
                                No hay vacunas registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente no tiene vacunas registradas.
                            </p>

                        </div>

                    ) : (

                        <div>

                            {vacunasVisibles.map(
                                (vacuna) => (

                                    <div
                                        key={vacuna.id}
                                        className="border border-secondary border-opacity-50 rounded-3 p-3 p-md-4 mb-3"
                                    >

                                        <div className="row g-3">

                                            <div className="col-md-3 col-lg-2">

                                                <div className="small text-white">
                                                    Administrada
                                                </div>

                                                <div className="fw-semibold text-white mt-1">
                                                    {formatearFecha(
                                                        vacuna.fecha ||
                                                        vacuna.date ||
                                                        vacuna.administered_at ||
                                                        vacuna.vaccination_date
                                                    )}
                                                </div>

                                            </div>

                                            <div className="col-md-9 col-lg-10">

                                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">

                                                    <span className="badge bg-warning">
                                                        Vacuna
                                                    </span>

                                                    {(vacuna.dosis || vacuna.dose) && (

                                                        <span className="badge bg-info bg-opacity-25 text-info border border-info">
                                                            {vacuna.dosis || vacuna.dose}
                                                        </span>

                                                    )}

                                                </div>

                                                <h3 className="h5 text-info fw-bold mb-2">
                                                    {vacuna.nombre ||
                                                        vacuna.name ||
                                                        vacuna.vaccine_name ||
                                                        "Vacuna"}
                                                </h3>

                                                {vacuna.manufacturer && (

                                                    <div className="small text-white mb-2">

                                                        <strong>
                                                            Fabricante:
                                                        </strong>

                                                        {" "}

                                                        {vacuna.manufacturer}

                                                    </div>

                                                )}

                                                {(vacuna.lote || vacuna.batch) && (

                                                    <div className="small text-white mb-1">

                                                        <strong>
                                                            Lote:
                                                        </strong>

                                                        {" "}

                                                        {vacuna.lote || vacuna.batch}

                                                    </div>

                                                )}

                                                {(vacuna.next_dose_date || vacuna.proxima_dosis) && (

                                                    <div className="small text-white mb-1">

                                                        <strong>
                                                            Próxima dosis:
                                                        </strong>

                                                        {" "}

                                                        {formatearFecha(
                                                            vacuna.next_dose_date || vacuna.proxima_dosis
                                                        )}

                                                    </div>

                                                )}

                                                {(vacuna.notes || vacuna.observaciones) && (

                                                    <div className="small text-white">

                                                        <strong>
                                                            Observaciones:
                                                        </strong>

                                                        {" "}

                                                        {vacuna.notes || vacuna.observaciones}

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                            {vacunas.length > 4 && (

                                <div className="d-flex justify-content-center mt-3">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasVacunas(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasVacunas
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* ==================================================
                CIRUGÍAS
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Cirugías
                            </h2>

                            <p className="text-white mb-0">
                                Intervenciones quirúrgicas registradas al paciente.
                            </p>

                        </div>

                        <span className="badge bg-info bg-opacity-25 text-info border border-info">

                            {cirugias.length}

                            {" "}

                            {cirugias.length === 1
                                ? "cirugía"
                                : "cirugías"}

                        </span>

                    </div>

                    {cargandoCirugias ? (

                        <div className="d-flex align-items-center gap-2 text-white-50">

                            <div
                                className="spinner-border spinner-border-sm text-info"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            Cargando cirugías...

                        </div>

                    ) : errorCirugias ? (

                        <div
                            className="alert alert-warning mb-0"
                            role="alert"
                        >
                            {errorCirugias}
                        </div>

                    ) : cirugias.length === 0 ? (

                        <div className="text-center py-4">

                            <div className="fs-2 mb-2">
                                🏥
                            </div>

                            <h3 className="h6 text-info fw-bold">
                                No hay cirugías registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente no tiene cirugías registradas.
                            </p>

                        </div>

                    ) : (

                        <div>

                            <div className="row g-3">

                                {cirugiasVisibles.map(
                                    (cirugia) => (

                                        <div
                                            className="col-12 col-xl-6"
                                            key={cirugia.id}
                                        >

                                            <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 h-100">

                                                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                                                    <h3 className="h6 text-info fw-bold mb-0">

                                                        {cirugia.nombre ||
                                                            cirugia.name ||
                                                            cirugia.procedimiento ||
                                                            cirugia.procedure ||
                                                            "Cirugía"}

                                                    </h3>

                                                    <span className="badge bg-warning text-dark">
                                                        Cirugía
                                                    </span>

                                                </div>

                                                {(cirugia.fecha ||
                                                    cirugia.date ||
                                                    cirugia.surgery_date) && (

                                                        <p className="text-white small mb-2">

                                                            <strong>
                                                                Fecha:
                                                            </strong>

                                                            {" "}

                                                            {formatearFecha(
                                                                cirugia.fecha ||
                                                                cirugia.date ||
                                                                cirugia.surgery_date
                                                            )}

                                                        </p>

                                                    )}

                                                {(cirugia.hospital ||
                                                    cirugia.hospital_name) && (

                                                        <p className="text-white small mb-2">

                                                            <strong>
                                                                Hospital:
                                                            </strong>

                                                            {" "}

                                                            {cirugia.hospital ||
                                                                cirugia.hospital_name}

                                                        </p>

                                                    )}

                                                {(cirugia.cirujano ||
                                                    cirugia.surgeon) && (

                                                        <p className="text-white small mb-2">

                                                            <strong>
                                                                Cirujano:
                                                            </strong>

                                                            {" "}

                                                            {cirugia.cirujano ||
                                                                cirugia.surgeon}

                                                        </p>

                                                    )}

                                                {(cirugia.detalle ||
                                                    cirugia.description ||
                                                    cirugia.descripcion) && (

                                                        <p className="text-white small mb-0">

                                                            <strong>
                                                                Descripción:
                                                            </strong>

                                                            {" "}

                                                            {cirugia.detalle ||
                                                                cirugia.description ||
                                                                cirugia.descripcion}

                                                        </p>

                                                    )}

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                            {cirugias.length > 4 && (

                                <div className="d-flex justify-content-center mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasCirugias(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasCirugias
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* ==================================================
                HISTORIAL DE CONSULTAS
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Historial de consultas
                            </h2>

                            <p className="text-white mb-0">
                                Consultas programadas y realizadas al paciente.
                            </p>

                        </div>

                        <span className="badge bg-info bg-opacity-25 text-info border border-info">

                            {consultas.length}

                            {" "}

                            {consultas.length === 1
                                ? "consulta"
                                : "consultas"}

                        </span>

                    </div>

                    {cargandoConsultas ? (

                        <div className="d-flex align-items-center gap-2 text-white-50">

                            <div
                                className="spinner-border spinner-border-sm text-info"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            Cargando consultas...

                        </div>

                    ) : errorConsultas ? (

                        <div
                            className="alert alert-warning mb-0"
                            role="alert"
                        >
                            {errorConsultas}
                        </div>

                    ) : consultas.length === 0 ? (

                        <p className="text-white mb-0">
                            No hay consultas registradas.
                        </p>

                    ) : (

                        <div>

                            <div className="row g-3">

                                {consultasVisibles.map(
                                    (consulta) => (

                                        <div
                                            className="col-12 col-xl-6"
                                            key={consulta.id}
                                        >

                                            <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 h-100">

                                                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">

                                                    <h3 className="h6 text-info fw-bold mb-0">

                                                        {consulta.appointment_type ||
                                                            "Consulta médica"}

                                                    </h3>

                                                    <span
                                                        className={`badge ${consulta.status ===
                                                            "completed"
                                                            ? "bg-success"
                                                            : consulta.status ===
                                                                "cancelled"
                                                                ? "bg-danger"
                                                                : "bg-warning text-dark"
                                                            }`}
                                                    >
                                                        {formatearEstadoConsulta(
                                                            consulta.status
                                                        )}
                                                    </span>

                                                </div>

                                                <p className="text-white small mb-2">

                                                    {consulta.scheduled_start
                                                        ? new Date(
                                                            consulta.scheduled_start
                                                        ).toLocaleString(
                                                            "es-ES",
                                                            {
                                                                dateStyle:
                                                                    "medium",
                                                                timeStyle:
                                                                    "short"
                                                            }
                                                        )
                                                        : "Fecha no disponible"}

                                                </p>

                                                <p className="text-white small mb-0">

                                                    Modalidad:
                                                    {" "}

                                                    {consulta.modality ===
                                                        "virtual"
                                                        ? "Virtual"
                                                        : "Presencial"}

                                                </p>

                                                {consulta.reason && (

                                                    <p className="text-white small mt-2 mb-0">
                                                        {consulta.reason}
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                            {consultas.length > 4 && (

                                <div className="d-flex justify-content-center mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasConsultas(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasConsultas
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* ==================================================
                HISTORIAL DE RECETAS
            ================================================== */}

            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm">

                <div className="card-body p-4">

                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-4">

                        <div>

                            <h2 className="h4 text-info fw-bold mb-1">
                                Historial de recetas
                            </h2>

                            <p className="text-white mb-0">
                                Recetas emitidas al paciente.
                            </p>

                        </div>

                        <span className="badge bg-info bg-opacity-25 text-info border border-info align-self-start">

                            {recetas.length}

                            {" "}

                            {recetas.length === 1
                                ? "receta"
                                : "recetas"}

                        </span>

                    </div>

                    {cargandoRecetas ? (

                        <div className="d-flex align-items-center gap-2 text-white-50">

                            <div
                                className="spinner-border spinner-border-sm text-info"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            Cargando recetas...

                        </div>

                    ) : errorRecetas ? (

                        <div
                            className="alert alert-warning mb-0"
                            role="alert"
                        >
                            {errorRecetas}
                        </div>

                    ) : recetas.length === 0 ? (

                        <div className="text-center py-4">

                            <div className="fs-2 mb-2">
                                💊
                            </div>

                            <h3 className="h6 text-info fw-bold">
                                No hay recetas registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente todavía no tiene tratamientos prescritos.
                            </p>

                        </div>

                    ) : (

                        <div>

                            <div className="row g-3">

                                {recetasVisibles.map(
                                    (receta) => (

                                        <div
                                            className="col-12 col-xl-6"
                                            key={receta.id}
                                        >

                                            <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 h-100">

                                                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">

                                                    <div>

                                                        <h3 className="h6 text-info fw-bold mb-1">
                                                            Receta #{receta.id}
                                                        </h3>

                                                        <span className="text-white-50 small">
                                                            Emitida el{" "}
                                                            {formatearFecha(
                                                                receta.issued_at
                                                            )}
                                                        </span>

                                                    </div>

                                                    <span
                                                        className={`badge ${receta.status ===
                                                            "active"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                            }`}
                                                    >
                                                        {formatearEstadoReceta(
                                                            receta.status
                                                        )}
                                                    </span>

                                                </div>

                                                {receta.medications?.map(
                                                    (medicamento) => (

                                                        <div
                                                            className="border-top border-secondary border-opacity-50 pt-3 mt-3"
                                                            key={
                                                                medicamento.id
                                                            }
                                                        >

                                                            <h4 className="h6 text-info fw-semibold mb-2">
                                                                {
                                                                    medicamento.name
                                                                }
                                                            </h4>

                                                            <div className="row g-2 small text-white-50">

                                                                <div className="col-12 col-md-6">

                                                                    <strong className="text-white">
                                                                        Dosis:
                                                                    </strong>

                                                                    {" "}

                                                                    {medicamento.dosage ||
                                                                        "No indicada"}

                                                                </div>

                                                                <div className="col-12 col-md-6">

                                                                    <strong className="text-white">
                                                                        Frecuencia:
                                                                    </strong>

                                                                    {" "}

                                                                    {medicamento.frequency ||
                                                                        "No indicada"}

                                                                </div>

                                                                <div className="col-12 col-md-6">

                                                                    <strong className="text-white">
                                                                        Duración:
                                                                    </strong>

                                                                    {" "}

                                                                    {medicamento.duration ||
                                                                        "No indicada"}

                                                                </div>

                                                                {medicamento.instructions && (

                                                                    <div className="col-12">

                                                                        <strong className="text-white">
                                                                            Instrucciones:
                                                                        </strong>

                                                                        {" "}

                                                                        {
                                                                            medicamento.instructions
                                                                        }

                                                                    </div>

                                                                )}

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                            {recetas.length > 4 && (

                                <div className="d-flex justify-content-center mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-outline-info rounded-pill px-4"
                                        onClick={() =>
                                            setMostrarTodasRecetas(
                                                (actual) => !actual
                                            )
                                        }
                                    >
                                        {mostrarTodasRecetas
                                            ? "Ver menos"
                                            : "Ver más"}
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};