import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const getToken = () => (
    localStorage.getItem("access_token") || localStorage.getItem("token")
);

export const SolicitarConsulta = () => {
    const navigate = useNavigate();
    const [formulario, setFormulario] = useState({
        appointment_type: "Consulta médica",
        modality: "presencial",
        scheduled_start: "",
        reason: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const actualizarCampo = (event) => {
        const { name, value } = event.target;
        setFormulario((actual) => ({ ...actual, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/paciente/consultas`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formulario)
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo crear la consulta.");
            }

            setSuccess("Consulta creada correctamente.");
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
                                <Link to="/dashboard/paciente" className="btn btn-outline-light rounded-pill">
                                    Volver al dashboard
                                </Link>
                            </div>
                            <span className="text-info text-uppercase small fw-semibold">Agenda</span>
                            <h1 className="h2 fw-bold mb-1 mt-1">Pedir consulta</h1>
                            <p className="text-white-50 mb-0">
                                Solicita una consulta con tu médico asignado.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-xl-9">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 shadow-sm">
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {success && <div className="alert alert-success" role="alert">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="patient-appointment-type" className="form-label fw-semibold">
                                            Tipo de consulta
                                        </label>
                                        <input
                                            id="patient-appointment-type"
                                            name="appointment_type"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={formulario.appointment_type}
                                            onChange={actualizarCampo}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="patient-modality" className="form-label fw-semibold">
                                            Modalidad
                                        </label>
                                        <select
                                            id="patient-modality"
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
                                    <div className="col-12">
                                        <label htmlFor="patient-scheduled-start" className="form-label fw-semibold">
                                            Fecha y hora
                                        </label>
                                        <input
                                            id="patient-scheduled-start"
                                            type="datetime-local"
                                            name="scheduled_start"
                                            className="form-control bg-dark text-white border-secondary"
                                            style={{ colorScheme: "dark" }}
                                            value={formulario.scheduled_start}
                                            onChange={actualizarCampo}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="patient-reason" className="form-label fw-semibold">
                                            Motivo
                                        </label>
                                        <textarea
                                            id="patient-reason"
                                            name="reason"
                                            rows="4"
                                            className="form-control bg-dark text-white border-secondary"
                                            value={formulario.reason}
                                            onChange={actualizarCampo}
                                            placeholder="Describe el motivo de la consulta"
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Link to="/dashboard/paciente" className="btn btn-danger rounded-pill">
                                        Cancelar
                                    </Link>
                                    <button type="submit" className="btn btn-info rounded-pill fw-semibold" disabled={loading}>
                                        {loading ? "Creando..." : "Crear consulta"}
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
