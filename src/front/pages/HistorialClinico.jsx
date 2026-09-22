import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const HistorialClinico = () => {
    const { state } = useLocation();
    const patient = state?.patient;
    const [enfermedades, setEnfermedades] = useState([]);
    const [cargandoEnfermedades, setCargandoEnfermedades] = useState(false);
    const [errorEnfermedades, setErrorEnfermedades] = useState("");
    const [recetas, setRecetas] = useState([]);
    const [cargandoRecetas, setCargandoRecetas] = useState(false);
    const [errorRecetas, setErrorRecetas] = useState("");

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
                        data.error || "No se pudieron cargar las enfermedades."
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
                        data.error || "No se pudieron cargar las recetas."
                    );
                }

                setRecetas(
                    (data.prescriptions || []).filter(
                        (receta) => String(receta.patient_id) === String(patient.id)
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

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return "No disponible";

        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const noHaCumplido =
            hoy.getMonth() < nacimiento.getMonth() ||
            (hoy.getMonth() === nacimiento.getMonth() &&
                hoy.getDate() < nacimiento.getDate());

        if (noHaCumplido) edad -= 1;

        return edad;
    };

    const formatearNacimiento = (fechaNacimiento) => {
        if (!fechaNacimiento) return "No disponible";

        return new Date(fechaNacimiento).toLocaleDateString("es-ES");
    };

    const paciente = {
        nombre: patient
            ? `${patient.nombre} ${patient.apellidos}`
            : "Paciente no seleccionado",
        id: patient?.id || "No disponible",
        edad: calcularEdad(patient?.fecha_nacimiento),
        sexo: patient?.sexo || "No disponible",
        nacimiento: formatearNacimiento(patient?.fecha_nacimiento),
    };

    const [orden, setOrden] = useState("recientes");

    const antecedentesFiltrados = useMemo(() => {
        const resultado = [...enfermedades];

        // Ordenar por fecha
        resultado.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);

            return orden === "recientes"
                ? fechaB - fechaA
                : fechaA - fechaB;
        });

        return resultado;
    }, [enfermedades, orden]);

    // Formatear fechas
    const formatearFecha = (fecha) => {
        if (!fecha) return "No disponible";

        return new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatearEstadoReceta = (estado) => {
        const estados = {
            active: "Activa",
            cancelled: "Cancelada",
            expired: "Caducada"
        };

        return estados[estado] || estado || "Sin estado";
    };

    // Iniciales del paciente
    const iniciales = paciente.nombre
        .split(" ")
        .map((nombre) => nombre[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="container text-white py-4">
            {/* CABECERA */}
            <div className="row justify-content-center mb-4">
                <div className="col-12">
                    <div className="text-center">
                        <div className="d-flex justify-content-end mb-3">
                            <Link to="/dashboard/medico" className="btn btn-outline-light rounded-pill">
                                Volver al dashboard médico
                            </Link>
                        </div>
                        <h1 className="h2 fw-bold mb-1">Historial clínico</h1>
                        <p className="text-white-50 mb-0">
                            Consulta los antecedentes y tratamientos del paciente.
                        </p>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DEL PACIENTE */}
            <div className="card bg-white border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        {/* Avatar */}
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

                        {/* Datos principales */}
                        <div className="col">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <h3 className="fw-bold mb-0">
                                    {paciente.nombre}
                                </h3>

                                <span className="badge bg-light text-dark border">
                                    {paciente.id}
                                </span>
                            </div>

                            <div className="text-body-secondary mt-2">
                                {paciente.edad} años
                                <span className="mx-2">•</span>
                                {paciente.sexo}
                                <span className="mx-2">•</span>
                                Fecha de nacimiento: {paciente.nacimiento}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CABECERA DE ANTECEDENTES */}
            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                        <div>
                            <h2 className="h4 fw-bold mb-1">
                                Enfermedades del paciente
                            </h2>

                            <p className="text-white-50 mb-0">
                                Consulta las enfermedades registradas y
                                ordénalas por fecha.
                            </p>
                        </div>

                        {/* ORDEN */}
                        <div>
                            <label
                                htmlFor="orden"
                                className="form-label small fw-semibold mb-1"
                            >
                                Ordenar por
                            </label>

                            <select
                                id="orden"
                                className="form-select"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                            >
                                <option value="recientes">
                                    Más recientes
                                </option>

                                <option value="antiguos">
                                    Más antiguos
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* RESULTADOS */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-white-50 small">
                            Mostrando{" "}
                            <strong>{antecedentesFiltrados.length}</strong>{" "}
                            enfermedades
                        </span>
                    </div>

                    {/* LISTADO */}
                    {cargandoEnfermedades ? (
                        <p className="text-white mb-0">Cargando enfermedades...</p>
                    ) : errorEnfermedades ? (
                        <p className="text-warning mb-0">{errorEnfermedades}</p>
                    ) : antecedentesFiltrados.length > 0 ? (
                        <div>
                            {antecedentesFiltrados.map((antecedente) => (
                                <div
                                    key={antecedente.id}
                                    className="border border-secondary border-opacity-50 rounded-3 p-3 p-md-4 mb-3"
                                >
                                    <div className="row g-3">
                                        {/* FECHA */}
                                        <div className="col-md-3 col-lg-2">
                                            <div className="small">
                                                Fecha
                                            </div>

                                            <div className="fw-semibold mt-1">
                                                {formatearFecha(
                                                    antecedente.fecha
                                                )}
                                            </div>
                                        </div>

                                        {/* INFORMACIÓN */}
                                        <div className="col-md-9 col-lg-10">
                                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                                <span className="badge text-bg-danger">
                                                    Enfermedad
                                                </span>

                                                <span className="badge bg-light text-dark border">
                                                    {antecedente.estado}
                                                </span>
                                            </div>

                                            <h3 className="h5 fw-bold mb-2">
                                                {antecedente.nombre}
                                            </h3>

                                            <p className="text-white mb-2">
                                                {antecedente.descripcion}
                                            </p>

                                            <div className="small text-white">
                                                <strong>Detalle:</strong>{" "}
                                                {antecedente.detalle}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ESTADO SIN RESULTADOS */
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <span
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-secondary"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    —
                                </span>
                            </div>

                            <h3 className="h5 fw-bold">
                                No hay enfermedades registradas
                            </h3>

                            <p className="text-white mb-0">
                                Este paciente no tiene enfermedades registradas.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* HISTORIAL DE RECETAS */}
            <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-4">
                        <div>
                            <span className="text-info text-uppercase small fw-semibold">
                                Tratamientos
                            </span>
                            <h2 className="h4 fw-bold mb-1 mt-1">
                                Historial de recetas
                            </h2>
                            <p className="text-white-50 mb-0">
                                Recetas emitidas para este paciente.
                            </p>
                        </div>
                        <span className="badge bg-info bg-opacity-25 text-info border border-info align-self-start">
                            {recetas.length} {recetas.length === 1 ? "receta" : "recetas"}
                        </span>
                    </div>

                    {cargandoRecetas ? (
                        <div className="d-flex align-items-center gap-2 text-white-50">
                            <div className="spinner-border spinner-border-sm text-info" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            Cargando recetas...
                        </div>
                    ) : errorRecetas ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {errorRecetas}
                        </div>
                    ) : recetas.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="fs-2 mb-2">💊</div>
                            <h3 className="h6 fw-bold">No hay recetas registradas</h3>
                            <p className="text-white-50 mb-0">
                                Este paciente todavía no tiene tratamientos prescritos.
                            </p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {recetas.map((receta) => (
                                <div className="col-12 col-xl-6" key={receta.id}>
                                    <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 h-100">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <h3 className="h6 fw-bold mb-1">
                                                    Receta #{receta.id}
                                                </h3>
                                                <span className="text-white-50 small">
                                                    Emitida el {formatearFecha(receta.issued_at)}
                                                </span>
                                            </div>
                                            <span className={`badge ${receta.status === "active" ? "bg-success" : "bg-secondary"}`}>
                                                {formatearEstadoReceta(receta.status)}
                                            </span>
                                        </div>

                                        {receta.medications.map((medicamento) => (
                                            <div className="border-top border-secondary border-opacity-50 pt-3 mt-3" key={medicamento.id}>
                                                <h4 className="h6 fw-semibold mb-2">
                                                    {medicamento.name}
                                                </h4>
                                                <div className="row g-2 small text-white-50">
                                                    <div className="col-12 col-md-6">
                                                        <strong className="text-white">Dosis:</strong>{" "}
                                                        {medicamento.dosage || "No indicada"}
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <strong className="text-white">Frecuencia:</strong>{" "}
                                                        {medicamento.frequency || "No indicada"}
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <strong className="text-white">Duración:</strong>{" "}
                                                        {medicamento.duration || "No indicada"}
                                                    </div>
                                                    {medicamento.instructions && (
                                                        <div className="col-12">
                                                            <strong className="text-white">Instrucciones:</strong>{" "}
                                                            {medicamento.instructions}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};