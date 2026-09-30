import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const initialSurgery = {
    name: "",
    surgeryDate: "",
    hospital: "",
    surgeon: "",
    description: ""
};

export const CrearCirugia = () => {
    const { state } = useLocation();
    const patient = state?.patient;
    const [surgery, setSurgery] = useState(initialSurgery);
    const [creatingSurgery, setCreatingSurgery] = useState(false);
    const [surgeryError, setSurgeryError] = useState("");
    const [surgerySuccess, setSurgerySuccess] = useState("");

    const getToken = () => (
        localStorage.getItem("access_token") || localStorage.getItem("token")
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSurgery((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addSurgery = async (event) => {
        event.preventDefault();
        setSurgeryError("");
        setSurgerySuccess("");

        if (!patient?.id) {
            setSurgeryError("Selecciona un paciente desde Mis pacientes.");
            return;
        }
        if (!surgery.name.trim()) {
            setSurgeryError("Introduce el nombre de la cirugía.");
            return;
        }
        if (!surgery.surgeryDate) {
            setSurgeryError("Introduce la fecha de la cirugía.");
            return;
        }

        setCreatingSurgery(true);
        try {
            const token = getToken();
            if (!token) {
                setSurgeryError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/cirugias`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        patient_id: Number(patient.id),
                        name: surgery.name.trim(),
                        surgery_date: surgery.surgeryDate,
                        hospital: surgery.hospital.trim() || null,
                        surgeon: surgery.surgeon.trim() || null,
                        notes: surgery.description.trim() || null
                    })
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setSurgeryError(data.error || "No se pudo crear el registro de cirugía.");
                return;
            }

            setSurgerySuccess("Registro de cirugía creado correctamente.");
            setSurgery(initialSurgery);
        } catch (error) {
            console.error("Error creando registro de cirugía:", error);
            setSurgeryError("Error de conexión con el servidor.");
        } finally {
            setCreatingSurgery(false);
        }
    };

    return (
        <div className="text-white py-4">
            <div className="container">
                <div className="row justify-content-center mb-4">
                    <div className="col-12 col-xl-8">
                        <div className="text-center">
                            <div className="d-flex justify-content-end mb-3">
                                <Link to="/dashboard/medico" className="btn btn-outline-light rounded-pill">
                                    Volver al dashboard médico
                                </Link>
                            </div>

                            <h1 className="h3 fw-bold mb-0 mt-1 text-info">Registrar cirugía</h1>
                            <p className="text-white-50 mb-0">
                                Añade un nuevo registro de cirugía para el paciente seleccionado.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-xl-8">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">
                            {surgeryError && <div className="alert alert-danger">{surgeryError}</div>}
                            {surgerySuccess && <div className="alert alert-success">{surgerySuccess}</div>}

                            {!patient ? (
                                <div className="alert alert-warning mb-0">
                                    Accede a esta página desde el botón Registrar cirugía de un paciente.
                                </div>
                            ) : (
                                <form onSubmit={addSurgery}>
                                    <div className="mb-3">
                                        <label className="form-label">Paciente</label>
                                        <input
                                            className="form-control bg-dark text-white border-secondary"
                                            value={`${patient.nombre} ${patient.apellidos || ""}`}
                                            readOnly
                                        />
                                        <div className="form-text text-white-50">Paciente #{patient.id}</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nombre / procedimiento</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="name" placeholder="Ej. Apendicectomía, bypass gástrico..." value={surgery.name} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha de la cirugía</label>
                                        <input type="date" className="form-control bg-dark text-white border-secondary" name="surgeryDate" value={surgery.surgeryDate} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hospital</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="hospital" placeholder="Ej. Hospital La Paz" value={surgery.hospital} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Cirujano</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="surgeon" placeholder="Ej. Dr. García" value={surgery.surgeon} onChange={handleChange} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Descripción</label>
                                        <textarea className="form-control bg-dark text-white border-secondary" rows="3" name="description" placeholder="Detalles relevantes de la intervención..." value={surgery.description} onChange={handleChange} />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <Link
                                            to="/dashboard/medico"
                                            className="btn btn-danger rounded-pill"
                                        >
                                            Cancelar
                                        </Link>
                                        <button type="submit" className="btn btn-info rounded-pill fw-semibold" disabled={creatingSurgery}>
                                            {creatingSurgery ? "Registrando..." : "Registrar cirugía"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};