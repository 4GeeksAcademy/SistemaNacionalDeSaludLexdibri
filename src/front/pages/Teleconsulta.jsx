import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JitsiCall from "../components/JitsiCall";

const Teleconsulta = () => {
    const { citaId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadConsultation = async () => {
            setLoading(true);
            setError("");

            try {
                const storedUser = localStorage.getItem("user");
                const token =
                    localStorage.getItem("access_token") ||
                    localStorage.getItem("token");

                if (!citaId) {
                    throw new Error("No se ha indicado una consulta válida.");
                }

                if (!storedUser || !token) {
                    throw new Error("Debes iniciar sesión para acceder a la teleconsulta.");
                }

                const currentUser = JSON.parse(storedUser);
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/consultas/${citaId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "No se pudo validar la consulta.");
                }

                if (!cancelled) {
                    setUser(currentUser);
                    setConsultation(data.consulta);
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

        loadConsultation();

        return () => {
            cancelled = true;
        };
    }, [citaId]);

    if (loading) {
        return (
            <div className="text-white py-5 min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center gap-2 text-white-50">
                    <div className="spinner-border spinner-border-sm text-info" role="status">
                        <span className="visually-hidden">Validando...</span>
                    </div>
                    Validando consulta...
                </div>
            </div>
        );
    }

    if (error || !consultation) {
        return (
            <div className="text-white py-5 min-vh-100 d-flex align-items-center justify-content-center p-4">
                <div className="alert alert-danger mb-0" role="alert">
                    <strong>No se puede iniciar la teleconsulta.</strong>
                    <div>{error || "No se pudo validar la consulta."}</div>
                </div>
            </div>
        );
    }

    const esDoctor = user.role === "doctor";
    const nombreCompleto = `${user.first_name} ${user.last_name}`;

    // Misma fórmula para ambos roles: así coinciden en la misma sala
    const roomName = `teleconsulta-clinicaXYZ-${citaId}`;

    return (
        <div className="text-white py-4 min-vh-100">
            <div className="container-fluid">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                    <div>
                        <span className="text-info text-uppercase small fw-semibold">
                            Teleconsulta
                        </span>
                        <h1 className="h2 fw-bold mb-1 mt-1">
                            {esDoctor ? "Teleconsulta médica" : "Tu consulta médica"}
                        </h1>
                        <p className="text-white-50 mb-0">
                            {esDoctor ? "Conexión con el paciente" : "Conexión con tu médico"}
                        </p>
                    </div>
                </div>

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 shadow-sm overflow-hidden">
                    <div className="p-3 px-md-4 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-50">
                        <div>
                            <h2 className="h5 fw-bold mb-1">Videoconsulta</h2>
                            <small className="text-white-50">Conexión segura</small>
                        </div>
                        <span className="badge bg-info bg-opacity-25 text-info border border-info rounded-pill px-3 py-2">
                            ● Conectado
                        </span>
                    </div>

                    <div className="p-2 bg-dark bg-opacity-50">
                        <div className="rounded-3 overflow-hidden border border-secondary border-opacity-50" style={{ height: "650px" }}>
                            <JitsiCall
                                roomName={roomName}
                                displayName={nombreCompleto}
                                onConferenceLeft={() => navigate("/dashboard/medico")}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-3 mt-4">
                    <div className="fw-bold">Consulta en curso</div>
                    <small className="text-white-50">
                        {esDoctor
                            ? "La consulta se cerrará automáticamente al finalizar."
                            : "Espera aquí, la consulta comenzará en breve."}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Teleconsulta;