import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const NuevoDiagnostico = () => {
    const { state } = useLocation();
    const patient = state?.patient;

    const [tipoRegistro, setTipoRegistro] = useState("");

    // Enfermedad
    const [enfermedades, setEnfermedades] = useState([]);
    const [diseaseId, setDiseaseId] = useState("");
    const [status, setStatus] = useState("Activo");

    // Alergia
    const [allergen, setAllergen] = useState("");
    const [reaction, setReaction] = useState("");
    const [severity, setSeverity] = useState("");

    // Común
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingDiseases, setLoadingDiseases] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const cargarEnfermedades = async () => {
            try {
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/doctor/enfermedades`,
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
            } catch (loadError) {
                setError(loadError.message);
            } finally {
                setLoadingDiseases(false);
            }
        };

        cargarEnfermedades();
    }, []);

    const getToken = () =>
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

    const limpiarFormulario = () => {
        setDiseaseId("");
        setStatus("Activo");

        setAllergen("");
        setReaction("");
        setSeverity("");

        setNotes("");
    };

    const handleTipoRegistroChange = (event) => {
        const nuevoTipo = event.target.value;

        setTipoRegistro(nuevoTipo);
        setError("");
        setSuccess("");

        limpiarFormulario();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!patient?.id) {
            setError("No se ha seleccionado ningún paciente.");
            return;
        }

        if (!tipoRegistro) {
            setError("Selecciona si quieres registrar una enfermedad o una alergia.");
            return;
        }

        if (tipoRegistro === "enfermedad" && !diseaseId) {
            setError("Selecciona una enfermedad.");
            return;
        }

        if (tipoRegistro === "alergia" && !allergen.trim()) {
            setError("Indica el alérgeno.");
            return;
        }

        setLoading(true);

        try {
            let url = "";
            let body = {};
            let mensajeExito = "";

            if (tipoRegistro === "enfermedad") {
                url =
                    `${import.meta.env.VITE_BACKEND_URL}` +
                    `/api/medico/pacientes/${patient.id}/diagnosticos`;

                body = {
                    disease_id: diseaseId,
                    status,
                    notes
                };

                mensajeExito = "Diagnóstico creado correctamente.";
            }

            if (tipoRegistro === "alergia") {
                url =
                    `${import.meta.env.VITE_BACKEND_URL}` +
                    `/api/medico/pacientes/${patient.id}/alergias`;

                body = {
                    allergen,
                    reaction,
                    severity,
                    notes
                };

                mensajeExito = "Alergia registrada correctamente.";
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "No se pudo guardar el registro."
                );
            }

            setSuccess(mensajeExito);

            limpiarFormulario();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white py-4">
            <div className="container">

                {/* CABECERA */}
                <div className="row justify-content-center mb-4">
                    <div className="col-12 col-xl-8">

                        <div className="text-center">

                            <div className="d-flex justify-content-end mb-3">
                                <Link
                                    to="/dashboard/medico"
                                    className="btn btn-outline-light rounded-pill"
                                >
                                    Volver al dashboard médico
                                </Link>
                            </div>

                            <h1 className="h2 fw-bold mb-1 text-info">
                                Nuevo registro clínico
                            </h1>

                            <p className="text-white-50 mb-0">
                                Añade una enfermedad o una alergia al paciente seleccionado.
                            </p>

                        </div>

                    </div>
                </div>

                {/* CONTENIDO */}
                <div className="row justify-content-center">

                    <div className="col-12 col-xl-8">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 shadow-sm">

                            {/* PACIENTE */}
                            <div className="d-flex align-items-center gap-3 border-bottom border-secondary border-opacity-50 pb-3 mb-4">

                                <div
                                    className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center fs-4"
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

                            {/* PACIENTE NO SELECCIONADO */}
                            {!patient && (
                                <div
                                    className="alert alert-warning"
                                    role="alert"
                                >
                                    Accede a esta página desde el botón
                                    Crear diagnóstico de un paciente.
                                </div>
                            )}

                            {/* MENSAJES */}
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
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* TIPO DE REGISTRO */}
                                <div className="mb-4">

                                    <label
                                        htmlFor="tipoRegistro"
                                        className="form-label fw-semibold"
                                    >
                                        ¿Qué quieres registrar?
                                    </label>

                                    <select
                                        id="tipoRegistro"
                                        className="form-select bg-dark text-white border-secondary"
                                        value={tipoRegistro}
                                        onChange={handleTipoRegistroChange}
                                        disabled={!patient || loading}
                                    >
                                        <option value="">
                                            Selecciona una opción
                                        </option>

                                        <option value="enfermedad">
                                            Enfermedad
                                        </option>

                                        <option value="alergia">
                                            Alergia detectada
                                        </option>

                                    </select>

                                </div>

                                {/* ========================= */}
                                {/* ENFERMEDAD */}
                                {/* ========================= */}

                                {tipoRegistro === "enfermedad" && (
                                    <>
                                        <div className="mb-3">

                                            <label
                                                htmlFor="disease"
                                                className="form-label fw-semibold"
                                            >
                                                Enfermedad
                                            </label>

                                            <select
                                                id="disease"
                                                className="form-select bg-dark text-white border-secondary"
                                                value={diseaseId}
                                                onChange={(event) =>
                                                    setDiseaseId(event.target.value)
                                                }
                                                required
                                                disabled={
                                                    loadingDiseases ||
                                                    !patient ||
                                                    loading
                                                }
                                            >
                                                <option value="">
                                                    {loadingDiseases
                                                        ? "Cargando enfermedades..."
                                                        : "Selecciona una enfermedad"}
                                                </option>

                                                {enfermedades.map(
                                                    (enfermedad) => (
                                                        <option
                                                            key={enfermedad.id}
                                                            value={enfermedad.id}
                                                        >
                                                            {enfermedad.name}
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="status"
                                                className="form-label fw-semibold"
                                            >
                                                Estado
                                            </label>

                                            <select
                                                id="status"
                                                className="form-select bg-dark text-white border-secondary"
                                                value={status}
                                                onChange={(event) =>
                                                    setStatus(event.target.value)
                                                }
                                                disabled={loading}
                                            >
                                                <option value="Activo">
                                                    Activo
                                                </option>

                                                <option value="Controlado">
                                                    Controlado
                                                </option>

                                                <option value="Resuelto">
                                                    Resuelto
                                                </option>

                                            </select>

                                        </div>

                                        <div className="mb-4">

                                            <label
                                                htmlFor="notes"
                                                className="form-label fw-semibold"
                                            >
                                                Observaciones
                                            </label>

                                            <textarea
                                                id="notes"
                                                className="form-control bg-dark text-white border-secondary"
                                                rows="4"
                                                value={notes}
                                                onChange={(event) =>
                                                    setNotes(event.target.value)
                                                }
                                                placeholder="Añade observaciones del diagnóstico"
                                                disabled={loading}
                                            />

                                        </div>
                                    </>
                                )}

                                {/* ========================= */}
                                {/* ALERGIA */}
                                {/* ========================= */}

                                {tipoRegistro === "alergia" && (
                                    <>
                                        <div className="mb-3">

                                            <label
                                                htmlFor="allergen"
                                                className="form-label fw-semibold"
                                            >
                                                Alérgeno
                                            </label>

                                            <input
                                                type="text"
                                                id="allergen"
                                                className="form-control bg-dark text-white border-secondary"
                                                value={allergen}
                                                onChange={(event) =>
                                                    setAllergen(event.target.value)
                                                }
                                                placeholder="Ej. Penicilina, frutos secos, látex..."
                                                required
                                                disabled={loading}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="reaction"
                                                className="form-label fw-semibold"
                                            >
                                                Reacción
                                            </label>

                                            <input
                                                type="text"
                                                id="reaction"
                                                className="form-control bg-dark text-white border-secondary"
                                                value={reaction}
                                                onChange={(event) =>
                                                    setReaction(event.target.value)
                                                }
                                                placeholder="Ej. Erupción cutánea, dificultad respiratoria..."
                                                disabled={loading}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="severity"
                                                className="form-label fw-semibold"
                                            >
                                                Gravedad
                                            </label>

                                            <select
                                                id="severity"
                                                className="form-select bg-dark text-white border-secondary"
                                                value={severity}
                                                onChange={(event) =>
                                                    setSeverity(event.target.value)
                                                }
                                                disabled={loading}
                                            >
                                                <option value="">
                                                    Selecciona una gravedad
                                                </option>

                                                <option value="Leve">
                                                    Leve
                                                </option>

                                                <option value="Moderada">
                                                    Moderada
                                                </option>

                                                <option value="Grave">
                                                    Grave
                                                </option>

                                            </select>

                                        </div>

                                        <div className="mb-4">

                                            <label
                                                htmlFor="notes"
                                                className="form-label fw-semibold"
                                            >
                                                Observaciones
                                            </label>

                                            <textarea
                                                id="notes"
                                                className="form-control bg-dark text-white border-secondary"
                                                rows="4"
                                                value={notes}
                                                onChange={(event) =>
                                                    setNotes(event.target.value)
                                                }
                                                placeholder="Añade observaciones sobre la alergia"
                                                disabled={loading}
                                            />

                                        </div>
                                    </>
                                )}

                                {/* BOTONES */}
                                <div className="d-flex justify-content-end gap-2">

                                    <Link
                                        to="/dashboard/medico"
                                        className="btn btn-danger rounded-pill"
                                    >
                                        Cancelar
                                    </Link>

                                    <button
                                        type="submit"
                                        className="btn btn-warning rounded-pill fw-semibold"
                                        disabled={
                                            loading ||
                                            !patient ||
                                            !tipoRegistro ||
                                            (
                                                tipoRegistro === "enfermedad" &&
                                                loadingDiseases
                                            )
                                        }
                                    >
                                        {loading
                                            ? "Guardando..."
                                            : tipoRegistro === "alergia"
                                                ? "Guardar alergia"
                                                : "Guardar diagnóstico"}
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