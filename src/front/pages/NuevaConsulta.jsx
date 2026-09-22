import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const NuevaConsulta = () => {
    const { state } = useLocation();
    const patient = state?.patient;

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
    const [consultaCreada, setConsultaCreada] = useState(null);

    const actualizarCampo = (event) => {
        const { name, value } = event.target;
        setFormulario((actual) => ({ ...actual, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setConsultaCreada(null);

        if (!patient?.id) {
            setError("No se ha seleccionado ningún paciente.");
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
                throw new Error(data.error || "No se pudo crear la consulta.");
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
            setFormulario((actual) => ({
                ...actual,
                scheduled_start: "",
                reason: ""
            }));
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white py-4">
            <div className="container">
                <div className="row justify-content-center mb-4">
                    <div className="col-12 col-xl-9">
                        <div className="text-center">
                            <div className="d-flex justify-content-end mb-3">
                                <Link to="/dashboard/medico" className="btn btn-outline-light rounded-pill">
                                    Volver al dashboard médico
                                </Link>
                            </div>
                            <h1 className="h2 fw-bold mb-1">Nueva consulta</h1>
                            <p className="text-white-50 mb-0">
                                Programa una consulta para el paciente seleccionado.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-xl-9">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 shadow-sm">
                            <div className="d-flex align-items-center gap-3 border-bottom border-secondary border-opacity-50 pb-3 mb-4">
                                <div className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center fs-4" style={{ width: "48px", height: "48px" }}>
                                    +
                                </div>
                                <div>
                                    <span className="text-white-50 small">Paciente</span>
                                    <h2 className="h5 fw-bold mb-0">
                                        {patient
                                            ? `${patient.nombre} ${patient.apellidos || ""}`
                                            : "No seleccionado"}
                                    </h2>
                                    {patient && (
                                        <span className="text-white-50 small">Paciente #{patient.id}</span>
                                    )}
                                </div>
                            </div>

                            {!patient && (
                                <div className="alert alert-warning" role="alert">
                                    Accede a esta página desde el botón Nueva consulta de un paciente.
                                </div>
                            )}

                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    <div>{success}</div>
                                    {consultaCreada?.modality === "virtual" && (
                                        <Link
                                            to={`/teleconsulta/${consultaCreada.id}`}
                                            className="btn btn-info rounded-pill mt-3"
                                        >
                                            🎥 Entrar a teleconsulta
                                        </Link>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="appointment_type" className="form-label fw-semibold">
                                            Tipo de consulta
                                        </label>
                                        <input
                                            id="appointment_type"
                                            name="appointment_type"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={formulario.appointment_type}
                                            onChange={actualizarCampo}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="modality" className="form-label fw-semibold">
                                            Modalidad
                                        </label>
                                        <select
                                            id="modality"
                                            name="modality"
                                            className="form-select bg-dark text-white border-secondary"
                                            value={formulario.modality}
                                            onChange={actualizarCampo}
                                            required
                                        >
                                            <option value="presencial">Presencial</option>
                                            <option value="virtual">Virtual</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="status" className="form-label fw-semibold">
                                            Estado
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select bg-dark text-white border-secondary"
                                            value={formulario.status}
                                            onChange={actualizarCampo}
                                        >
                                            <option value="scheduled">Programada</option>
                                            <option value="confirmed">Confirmada</option>
                                            <option value="cancelled">Cancelada</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="scheduled_start" className="form-label fw-semibold">
                                            Fecha y hora de inicio
                                        </label>
                                        <input
                                            id="scheduled_start"
                                            name="scheduled_start"
                                            type="datetime-local"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={formulario.scheduled_start}
                                            onChange={actualizarCampo}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="reason" className="form-label fw-semibold">
                                            Motivo de la consulta
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            className="form-control bg-dark text-white border-secondary"
                                            rows="4"
                                            value={formulario.reason}
                                            onChange={actualizarCampo}
                                            placeholder="Describe el motivo de la consulta"
                                        />
                                    </div>
                                </div>

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
                                        disabled={loading || !patient}
                                    >
                                        {loading ? "Guardando..." : "Guardar consulta"}
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
