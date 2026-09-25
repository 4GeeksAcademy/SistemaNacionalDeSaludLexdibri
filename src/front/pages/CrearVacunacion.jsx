import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const initialVaccination = {
    vaccine: "",
    dose: "",
    administrationDate: "",
    lot: "",
    manufacturer: "",
    nextDoseDate: "",
    observations: ""
};

export const CrearVacunacion = () => {
    const { state } = useLocation();
    const patient = state?.patient;

    const [vaccination, setVaccination] = useState(initialVaccination);
    const [creatingVaccination, setCreatingVaccination] = useState(false);
    const [vaccinationError, setVaccinationError] = useState("");
    const [vaccinationSuccess, setVaccinationSuccess] = useState("");

    const getToken = () => (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token")
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setVaccination((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addVaccination = async (event) => {
        event.preventDefault();

        setVaccinationError("");
        setVaccinationSuccess("");

        if (!patient?.id) {
            setVaccinationError(
                "Selecciona un paciente desde Mis pacientes."
            );
            return;
        }

        if (!vaccination.vaccine.trim()) {
            setVaccinationError(
                "Introduce el nombre de la vacuna."
            );
            return;
        }

        if (!vaccination.dose.trim()) {
            setVaccinationError(
                "Introduce la dosis."
            );
            return;
        }

        if (!vaccination.administrationDate) {
            setVaccinationError(
                "Introduce la fecha de administración."
            );
            return;
        }

        setCreatingVaccination(true);

        try {
            const token = getToken();

            if (!token) {
                setVaccinationError(
                    "No hay sesión iniciada."
                );
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/vacunaciones`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        patient_id: Number(patient.id),
                        vaccine: vaccination.vaccine.trim(),
                        dose: vaccination.dose.trim(),
                        administration_date:
                            vaccination.administrationDate,
                        lot:
                            vaccination.lot.trim() || null,
                        manufacturer:
                            vaccination.manufacturer.trim() || null,
                        next_dose_date:
                            vaccination.nextDoseDate || null,
                        observations:
                            vaccination.observations.trim() || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setVaccinationError(
                    data.error ||
                    "No se pudo crear el registro de vacunación."
                );
                return;
            }

            setVaccinationSuccess(
                "Registro de vacunación creado correctamente."
            );

            setVaccination(initialVaccination);

        } catch (error) {
            console.error(
                "Error creando registro de vacunación:",
                error
            );

            setVaccinationError(
                "Error de conexión con el servidor."
            );
        } finally {
            setCreatingVaccination(false);
        }
    };

    return (
        <div className="text-white py-4">
            <div className="container">

                {/* =====================================================
                    CABECERA
                ===================================================== */}

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

                            <h1 className="h3 fw-bold mb-0 mt-1 text-info">
                                Registrar vacunación
                            </h1>

                            <p className="text-white-50 mb-0">
                                Añade un nuevo registro de vacunación para
                                el paciente seleccionado.
                            </p>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    FORMULARIO
                ===================================================== */}

                <div className="row justify-content-center">

                    <div className="col-12 col-xl-8">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">

                            {vaccinationError && (
                                <div className="alert alert-danger">
                                    {vaccinationError}
                                </div>
                            )}

                            {vaccinationSuccess && (
                                <div className="alert alert-success">
                                    {vaccinationSuccess}
                                </div>
                            )}

                            {!patient ? (

                                <div className="alert alert-warning mb-0">
                                    Accede a esta página desde el botón
                                    "Registrar vacunación" de un paciente.
                                </div>

                            ) : (

                                <form onSubmit={addVaccination}>

                                    {/* =================================================
                                        PACIENTE
                                    ================================================= */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Paciente
                                        </label>

                                        <input
                                            className="form-control bg-dark text-white border-secondary"
                                            value={`${patient.nombre} ${
                                                patient.apellidos || ""
                                            }`}
                                            readOnly
                                        />

                                        <div className="form-text text-white-50">
                                            Paciente #{patient.id}
                                        </div>

                                    </div>

                                    <hr className="border-secondary opacity-25 mb-4" />

                                    {/* =================================================
                                        VACUNA
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Vacuna
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="vaccine"
                                            placeholder="Ej. COVID-19, gripe, hepatitis B..."
                                            value={vaccination.vaccine}
                                            onChange={handleChange}
                                        />

                                        <div className="form-text text-white-50">
                                            Introduce manualmente el nombre
                                            de la vacuna.
                                        </div>

                                    </div>

                                    {/* =================================================
                                        DOSIS
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Dosis
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="dose"
                                            placeholder="Ej. 1ª dosis, 2ª dosis, dosis de refuerzo..."
                                            value={vaccination.dose}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* =================================================
                                        FECHA ADMINISTRACIÓN
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Fecha de administración
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="administrationDate"
                                            value={
                                                vaccination.administrationDate
                                            }
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* =================================================
                                        LOTE
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Número de lote
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="lot"
                                            placeholder="Ej. ABC12345"
                                            value={vaccination.lot}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* =================================================
                                        FABRICANTE
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Fabricante
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="manufacturer"
                                            placeholder="Ej. Pfizer, Moderna, Sanofi..."
                                            value={
                                                vaccination.manufacturer
                                            }
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* =================================================
                                        PRÓXIMA DOSIS
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Próxima dosis
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control bg-dark text-white border-secondary"
                                            name="nextDoseDate"
                                            value={
                                                vaccination.nextDoseDate
                                            }
                                            onChange={handleChange}
                                        />

                                        <div className="form-text text-white-50">
                                            Déjalo vacío si no necesita
                                            una próxima dosis.
                                        </div>

                                    </div>

                                    {/* =================================================
                                        OBSERVACIONES
                                    ================================================= */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Observaciones
                                        </label>

                                        <textarea
                                            className="form-control bg-dark text-white border-secondary"
                                            rows="4"
                                            name="observations"
                                            placeholder="Observaciones relacionadas con la vacunación..."
                                            value={
                                                vaccination.observations
                                            }
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* =================================================
                                        BOTONES
                                    ================================================= */}

                                    <div className="d-flex justify-content-end gap-2">

                                        <Link
                                            to="/dashboard/medico"
                                            className="btn btn-danger rounded-pill"
                                        >
                                            Cancelar
                                        </Link>

                                        <button
                                            type="submit"
                                            className="btn btn-info rounded-pill fw-semibold"
                                            disabled={
                                                creatingVaccination
                                            }
                                        >
                                            {creatingVaccination
                                                ? "Registrando..."
                                                : "Registrar vacunación"}
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