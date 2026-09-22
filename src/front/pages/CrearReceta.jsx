import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const initialPrescription = {
    medication: "",
    medicationExternalId: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: ""
};

export const CrearReceta = () => {
    const { state } = useLocation();
    const patient = state?.patient;
    const [prescription, setPrescription] = useState(initialPrescription);
    const [medicationResults, setMedicationResults] = useState([]);
    const [searchingMedications, setSearchingMedications] = useState(false);
    const [medicationSearchDone, setMedicationSearchDone] = useState(false);
    const [creatingPrescription, setCreatingPrescription] = useState(false);
    const [prescriptionError, setPrescriptionError] = useState("");
    const [prescriptionSuccess, setPrescriptionSuccess] = useState("");
    const medicationSelectionRef = useRef(false);

    const getToken = () => (
        localStorage.getItem("access_token") || localStorage.getItem("token")
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPrescription((previous) => ({
            ...previous,
            [name]: value,
            ...(name === "medication" ? { medicationExternalId: "" } : {})
        }));
    };

    useEffect(() => {
        const query = prescription.medication.trim();

        if (medicationSelectionRef.current) {
            medicationSelectionRef.current = false;
            return undefined;
        }

        if (query.length < 2) {
            setMedicationResults([]);
            setMedicationSearchDone(false);
            setSearchingMedications(false);
            return undefined;
        }

        let cancelled = false;
        const timeoutId = setTimeout(async () => {
            setSearchingMedications(true);
            setMedicationSearchDone(false);

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medicamentos?q=${encodeURIComponent(query)}`
                );
                const data = await response.json();

                if (!cancelled) {
                    setMedicationResults(response.ok ? data.resultados || [] : []);
                    setMedicationSearchDone(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error buscando medicamentos:", error);
                    setMedicationResults([]);
                    setMedicationSearchDone(false);
                }
            } finally {
                if (!cancelled) setSearchingMedications(false);
            }
        }, 400);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [prescription.medication]);

    const addPrescription = async (event) => {
        event.preventDefault();
        setPrescriptionError("");
        setPrescriptionSuccess("");

        if (!patient?.id) {
            setPrescriptionError("Selecciona un paciente desde Mis pacientes.");
            return;
        }
        if (!prescription.medication.trim()) {
            setPrescriptionError("Introduce un medicamento.");
            return;
        }
        if (!prescription.dosage.trim()) {
            setPrescriptionError("Introduce la dosis.");
            return;
        }

        setCreatingPrescription(true);
        try {
            const token = getToken();
            if (!token) {
                setPrescriptionError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/recetas`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        patient_id: Number(patient.id),
                        medication_external_id: prescription.medicationExternalId || null,
                        medication_name: prescription.medication.trim(),
                        dosage: prescription.dosage.trim(),
                        frequency: prescription.frequency.trim() || null,
                        duration: prescription.duration.trim() || null,
                        instructions: prescription.instructions.trim() || null
                    })
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setPrescriptionError(data.error || "No se pudo crear la receta.");
                return;
            }

            setPrescriptionSuccess("Receta creada correctamente.");
            setPrescription(initialPrescription);
            setMedicationResults([]);
            setMedicationSearchDone(false);
        } catch (error) {
            console.error("Error creando receta:", error);
            setPrescriptionError("Error de conexión con el servidor.");
        } finally {
            setCreatingPrescription(false);
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
                            <span className="text-info text-uppercase small fw-semibold">Tratamiento</span>
                            <h1 className="h3 fw-bold mb-0 mt-1">Crear receta</h1>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-xl-8">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">
                            {prescriptionError && <div className="alert alert-danger">{prescriptionError}</div>}
                            {prescriptionSuccess && <div className="alert alert-success">{prescriptionSuccess}</div>}

                            {!patient ? (
                                <div className="alert alert-warning mb-0">
                                    Accede a esta página desde el botón Crear receta de un paciente.
                                </div>
                            ) : (
                                <form onSubmit={addPrescription}>
                                    <div className="mb-3">
                                        <label className="form-label">Paciente</label>
                                        <input
                                            className="form-control bg-dark text-white border-secondary"
                                            value={`${patient.nombre} ${patient.apellidos || ""}`}
                                            readOnly
                                        />
                                        <div className="form-text text-white-50">Paciente #{patient.id}</div>
                                    </div>

                                    <div className="mb-3 position-relative">
                                        <label className="form-label">Medicamento</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="medication"
                                            placeholder="Ej. Paracetamol"
                                            value={prescription.medication}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                        {searchingMedications && <div className="text-white-50 small mt-2">Buscando medicamentos...</div>}
                                        {!searchingMedications && medicationSearchDone && medicationResults.length === 0 && (
                                            <div className="text-white-50 small mt-2">No se encontraron medicamentos. Puedes introducirlo manualmente.</div>
                                        )}
                                        {medicationResults.length > 0 && (
                                            <div className="list-group position-absolute w-100 shadow" style={{ top: "100%", zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                                                {medicationResults.map((medication) => (
                                                    <button
                                                        type="button"
                                                        key={medication.registro}
                                                        className="list-group-item list-group-item-action"
                                                        onClick={() => {
                                                            medicationSelectionRef.current = true;
                                                            setPrescription((previous) => ({
                                                                ...previous,
                                                                medication: medication.nombre,
                                                                medicationExternalId: medication.registro || "",
                                                                dosage: medication.dosis || ""
                                                            }));
                                                            setMedicationResults([]);
                                                            setMedicationSearchDone(false);
                                                        }}
                                                    >
                                                        <div className="fw-bold">{medication.nombre}</div>
                                                        <small className="text-muted">
                                                            {medication.principio_activo || ""}
                                                            {medication.dosis && ` · ${medication.dosis}`}
                                                            {medication.forma_farmaceutica && ` · ${medication.forma_farmaceutica}`}
                                                        </small>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Dosis</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="dosage" placeholder="Ej. 500 mg" value={prescription.dosage} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Frecuencia</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="frequency" placeholder="Ej. Cada 8 horas" value={prescription.frequency} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Duración</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" name="duration" placeholder="Ej. 7 días" value={prescription.duration} onChange={handleChange} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Instrucciones</label>
                                        <textarea className="form-control bg-dark text-white border-secondary" rows="3" name="instructions" placeholder="Indicaciones para el paciente..." value={prescription.instructions} onChange={handleChange} />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <Link
                                            to="/dashboard/medico"
                                            className="btn btn-danger rounded-pill"
                                        >
                                            Cancelar
                                        </Link>
                                        <button type="submit" className="btn btn-info rounded-pill fw-semibold" disabled={creatingPrescription}>
                                            {creatingPrescription ? "Creando receta..." : "Crear receta"}
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
