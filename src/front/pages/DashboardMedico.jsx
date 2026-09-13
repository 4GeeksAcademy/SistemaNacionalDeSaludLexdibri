import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const DashboardMedico = () => {
    const { store } = useGlobalReducer();

    // =========================
    // MIS PACIENTES
    // =========================

    const [patients, setPatients] = useState([]);

    // =========================
    // BÚSQUEDA DE PACIENTES
    // =========================

    const [searchResults, setSearchResults] = useState([]);
    const [searchPatient, setSearchPatient] = useState("");
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingMyPatients, setLoadingMyPatients] = useState(false);
    const [addingPatientId, setAddingPatientId] = useState(null);
    const [patientError, setPatientError] = useState("");
    const [searchDone, setSearchDone] = useState(false);

    // =========================
    // RECETAS
    // =========================

    const [prescriptions, setPrescriptions] = useState([]);

    const [newPrescription, setNewPrescription] = useState({
        patientId: "",
        medication: "",
        dosage: "",
        instructions: ""
    });

    // =========================
    // MENSAJES
    // =========================

    const [messages] = useState([
        {
            id: 1,
            sender: "Ana Torres",
            message: "Buenos días doctor, quería consultar una duda.",
            time: "10:30"
        },
        {
            id: 2,
            sender: "Luis Gómez",
            message: "¿Podría revisar mi última analítica?",
            time: "09:45"
        }
    ]);

    // =========================
    // TOKEN
    // =========================

    const getToken = () => {
        return (
            localStorage.getItem("access_token") ||
            localStorage.getItem("token")
        );
    };

    // =========================
    // CARGAR MIS PACIENTES
    // =========================

    const loadMyPatients = async () => {
        setLoadingMyPatients(true);

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error ||
                    "No se pudieron cargar tus pacientes."
                );
                return;
            }

            setPatients(data.pacientes || []);

        } catch (error) {
            console.error(
                "Error cargando mis pacientes:",
                error
            );

            setPatientError(
                "Error de conexión con el servidor."
            );
        } finally {
            setLoadingMyPatients(false);
        }
    };

    // =========================
    // CARGAR PACIENTES AL ENTRAR
    // =========================

    useEffect(() => {
        loadMyPatients();
    }, []);

    // =========================
    // BUSCAR PACIENTES
    // =========================

    const searchPatients = async () => {
        if (!searchPatient.trim()) {
            setPatientError(
                "Introduce un nombre, DNI, CIP o email."
            );
            setSearchResults([]);
            setSearchDone(false);
            return;
        }

        setLoadingPatients(true);
        setPatientError("");
        setSearchDone(false);

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/buscar?q=${encodeURIComponent(
                    searchPatient.trim()
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error ||
                    "No se pudieron buscar los pacientes."
                );
                setSearchResults([]);
                return;
            }

            setSearchResults(data.pacientes || []);
            setSearchDone(true);

        } catch (error) {
            console.error(
                "Error buscando pacientes:",
                error
            );

            setPatientError(
                "Error de conexión con el servidor."
            );

            setSearchResults([]);

        } finally {
            setLoadingPatients(false);
        }
    };

    // =========================
    // COMPROBAR SI YA ES MI PACIENTE
    // =========================

    const isMyPatient = (patientId) => {
        return patients.some(
            (patient) => patient.id === patientId
        );
    };

    // =========================
    // AGREGAR PACIENTE
    // =========================

    const addPatient = async (patientId) => {
        setAddingPatientId(patientId);
        setPatientError("");

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patientId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error ||
                    "No se pudo agregar el paciente."
                );
                return;
            }

            // Volver a cargar desde la BD
            await loadMyPatients();

            // Actualizar también el buscador
            setSearchResults((prevResults) =>
                prevResults.map((patient) =>
                    patient.id === patientId
                        ? {
                            ...patient,
                            is_mine: true
                        }
                        : patient
                )
            );

        } catch (error) {
            console.error(
                "Error agregando paciente:",
                error
            );

            setPatientError(
                "Error de conexión con el servidor."
            );

        } finally {
            setAddingPatientId(null);
        }
    };

    // =========================
    // LIMPIAR BÚSQUEDA
    // =========================

    const clearPatients = () => {
        setSearchPatient("");
        setSearchResults([]);
        setPatientError("");
        setSearchDone(false);
    };

    // =========================
    // RECETAS
    // =========================

    const handlePrescriptionChange = (e) => {
        const { name, value } = e.target;

        setNewPrescription({
            ...newPrescription,
            [name]: value
        });
    };

    const addPrescription = (e) => {
        e.preventDefault();

        if (
            !newPrescription.patientId ||
            !newPrescription.medication ||
            !newPrescription.dosage
        ) {
            return;
        }

        const patient = patients.find(
            (p) =>
                String(p.id) ===
                String(newPrescription.patientId)
        );

        const prescription = {
            id: Date.now(),
            patientId: newPrescription.patientId,
            patientName: patient
                ? `${patient.nombre} ${patient.apellidos}`
                : "Paciente",
            medication: newPrescription.medication,
            dosage: newPrescription.dosage,
            instructions: newPrescription.instructions
        };

        setPrescriptions([
            ...prescriptions,
            prescription
        ]);

        setNewPrescription({
            patientId: "",
            medication: "",
            dosage: "",
            instructions: ""
        });
    };

    const removePrescription = (id) => {
        setPrescriptions(
            prescriptions.filter(
                (prescription) =>
                    prescription.id !== id
            )
        );
    };

    // =========================
    // DATOS DEL MÉDICO
    // =========================

    const doctorName =
        store?.user?.first_name || "Médico";

    const doctorLastName =
        store?.user?.last_name || "";

    return (
        <div className="container-fluid py-4">

            {/* ========================= */}
            {/* CABECERA */}
            {/* ========================= */}

            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <div className="d-flex align-items-center">

                                <img
                                    src={rigoImageUrl}
                                    alt="Perfil médico"
                                    className="rounded-circle me-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover"
                                    }}
                                />

                                <div>

                                    <h2 className="mb-1">
                                        Bienvenido, Dr.{" "}
                                        {doctorName}{" "}
                                        {doctorLastName}
                                    </h2>

                                    <p className="text-muted mb-0">
                                        Panel de gestión médica
                                    </p>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ========================= */}
            {/* RESUMEN */}
            {/* ========================= */}

            <div className="row mb-4">

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">

                            <h6 className="text-muted">
                                Mis pacientes
                            </h6>

                            <h2 className="mb-0">
                                {patients.length}
                            </h2>

                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">

                            <h6 className="text-muted">
                                Recetas creadas
                            </h6>

                            <h2 className="mb-0">
                                {prescriptions.length}
                            </h2>

                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">

                            <h6 className="text-muted">
                                Mensajes
                            </h6>

                            <h2 className="mb-0">
                                {messages.length}
                            </h2>

                        </div>
                    </div>
                </div>

            </div>

            {/* ========================= */}
            {/* BUSCADOR DE PACIENTES */}
            {/* ========================= */}

            <div className="row mb-4">
                <div className="col-12">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <h3 className="mb-3">
                                Buscar pacientes
                            </h3>

                            <div className="row g-2">

                                <div className="col-md-9">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre, apellidos, DNI, CIP o email..."
                                        value={searchPatient}
                                        onChange={(e) =>
                                            setSearchPatient(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {
                                                searchPatients();
                                            }
                                        }}
                                    />

                                </div>

                                <div className="col-md-3">

                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-primary w-100"
                                            onClick={
                                                searchPatients
                                            }
                                            disabled={
                                                loadingPatients
                                            }
                                        >
                                            {loadingPatients
                                                ? "Buscando..."
                                                : "Buscar"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={
                                                clearPatients
                                            }
                                        >
                                            Limpiar
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {patientError && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    {patientError}
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* ========================= */}
            {/* RESULTADOS DE BÚSQUEDA */}
            {/* ========================= */}

            {(searchDone ||
                loadingPatients) && (

                <div className="row mb-5">

                    <div className="col-12">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h3 className="mb-4">
                                    Resultados de búsqueda
                                </h3>

                                {loadingPatients && (
                                    <div className="text-center py-5">

                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Buscando...
                                            </span>
                                        </div>

                                        <p className="text-muted mt-2">
                                            Buscando pacientes...
                                        </p>

                                    </div>
                                )}

                                {!loadingPatients &&
                                    searchResults.length === 0 && (
                                        <div className="text-center text-muted py-5">

                                            <h5>
                                                No se encontraron pacientes
                                            </h5>

                                            <p className="mb-0">
                                                Prueba con otro nombre, DNI,
                                                CIP o email.
                                            </p>

                                        </div>
                                    )}

                                {!loadingPatients && (
                                    <div className="row">

                                        {searchResults.map(
                                            (patient) => {

                                                const alreadyMine =
                                                    isMyPatient(
                                                        patient.id
                                                    );

                                                const adding =
                                                    addingPatientId ===
                                                    patient.id;

                                                return (
                                                    <div
                                                        className="col-lg-6 mb-4"
                                                        key={
                                                            patient.id
                                                        }
                                                    >

                                                        <div className="card border h-100">

                                                            <div className="card-body">

                                                                <div className="d-flex justify-content-between align-items-start mb-3">

                                                                    <div>

                                                                        <h5 className="mb-1">
                                                                            {
                                                                                patient.nombre
                                                                            }{" "}
                                                                            {
                                                                                patient.apellidos
                                                                            }
                                                                        </h5>

                                                                        <small className="text-muted">
                                                                            Paciente #
                                                                            {
                                                                                patient.id
                                                                            }
                                                                        </small>

                                                                    </div>

                                                                    {alreadyMine ? (
                                                                        <span className="badge bg-success">
                                                                            Mi paciente
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-secondary">
                                                                            Disponible
                                                                        </span>
                                                                    )}

                                                                </div>

                                                                <hr />

                                                                <div className="row">

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            DNI
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.dni ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            CIP
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.cip ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            Email
                                                                        </strong>

                                                                        <div className="text-muted text-break">
                                                                            {patient.email ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            Teléfono
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.telefono ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            Fecha de nacimiento
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.fecha_nacimiento
                                                                                ? new Date(
                                                                                    patient.fecha_nacimiento
                                                                                ).toLocaleDateString(
                                                                                    "es-ES"
                                                                                )
                                                                                : "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            Sexo
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.sexo ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-md-6 mb-3">

                                                                        <strong>
                                                                            Grupo sanguíneo
                                                                        </strong>

                                                                        <div className="text-muted">
                                                                            {patient.grupo_sanguineo ||
                                                                                "No disponible"}
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                                <div className="mt-2">

                                                                    {alreadyMine ? (

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-success btn-sm"
                                                                            disabled
                                                                        >
                                                                            ✓ Ya es mi paciente
                                                                        </button>

                                                                    ) : (

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() =>
                                                                                addPatient(
                                                                                    patient.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                adding
                                                                            }
                                                                        >
                                                                            {adding
                                                                                ? "Agregando..."
                                                                                : "Agregar a mis pacientes"}
                                                                        </button>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ========================= */}
            {/* MIS PACIENTES */}
            {/* ========================= */}

            <div className="row mb-5">

                <div className="col-12">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h3 className="mb-0">
                                    Mis pacientes
                                </h3>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={loadMyPatients}
                                    disabled={
                                        loadingMyPatients
                                    }
                                >
                                    {loadingMyPatients
                                        ? "Actualizando..."
                                        : "Actualizar"}
                                </button>

                            </div>

                            {loadingMyPatients &&
                                patients.length === 0 && (
                                    <div className="text-center py-5">

                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>

                                        <p className="text-muted mt-2">
                                            Cargando tus pacientes...
                                        </p>

                                    </div>
                                )}

                            {!loadingMyPatients &&
                                patients.length === 0 && (
                                    <div className="text-center text-muted py-5">

                                        <h5>
                                            Todavía no tienes pacientes
                                        </h5>

                                        <p className="mb-0">
                                            Utiliza el buscador para encontrar
                                            un paciente y agregarlo a tu lista.
                                        </p>

                                    </div>
                                )}

                            <div className="row">

                                {patients.map(
                                    (patient) => (

                                        <div
                                            className="col-lg-6 mb-4"
                                            key={patient.id}
                                        >

                                            <div className="card border h-100">

                                                <div className="card-body">

                                                    <div className="d-flex justify-content-between align-items-start mb-3">

                                                        <div>

                                                            <h5 className="mb-1">
                                                                {
                                                                    patient.nombre
                                                                }{" "}
                                                                {
                                                                    patient.apellidos
                                                                }
                                                            </h5>

                                                            <small className="text-muted">
                                                                Paciente #
                                                                {
                                                                    patient.id
                                                                }
                                                            </small>

                                                        </div>

                                                        <span className="badge bg-success">
                                                            Mi paciente
                                                        </span>

                                                    </div>

                                                    <hr />

                                                    <div className="row">

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                DNI
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.dni ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                CIP
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.cip ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                Email
                                                            </strong>

                                                            <div className="text-muted text-break">
                                                                {patient.email ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                Teléfono
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.telefono ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                Fecha de nacimiento
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.fecha_nacimiento
                                                                    ? new Date(
                                                                        patient.fecha_nacimiento
                                                                    ).toLocaleDateString(
                                                                        "es-ES"
                                                                    )
                                                                    : "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                Sexo
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.sexo ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 mb-3">

                                                            <strong>
                                                                Grupo sanguíneo
                                                            </strong>

                                                            <div className="text-muted">
                                                                {patient.grupo_sanguineo ||
                                                                    "No disponible"}
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="d-flex gap-2 mt-2">

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm"
                                                        >
                                                            Ver historial
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success btn-sm"
                                                        >
                                                            Nueva consulta
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ========================= */}
            {/* RECETAS */}
            {/* ========================= */}

            <div className="row mb-5">

                <div className="col-lg-6 mb-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Crear receta
                            </h3>

                            <form onSubmit={addPrescription}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Paciente
                                    </label>

                                    <select
                                        className="form-select"
                                        name="patientId"
                                        value={
                                            newPrescription.patientId
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    >

                                        <option value="">
                                            Selecciona un paciente
                                        </option>

                                        {patients.map(
                                            (patient) => (

                                                <option
                                                    key={
                                                        patient.id
                                                    }
                                                    value={
                                                        patient.id
                                                    }
                                                >
                                                    {
                                                        patient.nombre
                                                    }{" "}
                                                    {
                                                        patient.apellidos
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                    {patients.length === 0 && (
                                        <small className="text-muted">
                                            Primero agrega un paciente a tu lista.
                                        </small>
                                    )}

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Medicamento
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="medication"
                                        placeholder="Ej. Paracetamol"
                                        value={
                                            newPrescription.medication
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Dosis
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="dosage"
                                        placeholder="Ej. 500 mg cada 8 horas"
                                        value={
                                            newPrescription.dosage
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Instrucciones
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="instructions"
                                        placeholder="Indicaciones para el paciente..."
                                        value={
                                            newPrescription.instructions
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={
                                        patients.length === 0
                                    }
                                >
                                    Crear receta
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

                {/* RECETAS CREADAS */}

                <div className="col-lg-6 mb-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Recetas
                            </h3>

                            {prescriptions.length === 0 ? (

                                <div className="text-center text-muted py-5">

                                    <p className="mb-0">
                                        Todavía no has creado ninguna receta.
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    {prescriptions.map(
                                        (prescription) => (

                                            <div
                                                key={
                                                    prescription.id
                                                }
                                                className="border rounded p-3 mb-3"
                                            >

                                                <div className="d-flex justify-content-between">

                                                    <div>

                                                        <h6 className="mb-1">
                                                            {
                                                                prescription.patientName
                                                            }
                                                        </h6>

                                                        <strong>
                                                            {
                                                                prescription.medication
                                                            }
                                                        </strong>

                                                        <div className="text-muted">
                                                            {
                                                                prescription.dosage
                                                            }
                                                        </div>

                                                        {prescription.instructions && (
                                                            <small className="text-muted">
                                                                {
                                                                    prescription.instructions
                                                                }
                                                            </small>
                                                        )}

                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            removePrescription(
                                                                prescription.id
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* ========================= */}
            {/* MENSAJES */}
            {/* ========================= */}

            <div className="row">

                <div className="col-12">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Mensajes recientes
                            </h3>

                            {messages.map(
                                (message) => (

                                    <div
                                        key={
                                            message.id
                                        }
                                        className="border-bottom py-3"
                                    >

                                        <div className="d-flex justify-content-between">

                                            <strong>
                                                {
                                                    message.sender
                                                }
                                            </strong>

                                            <small className="text-muted">
                                                {
                                                    message.time
                                                }
                                            </small>

                                        </div>

                                        <p className="mb-0 mt-1 text-muted">
                                            {
                                                message.message
                                            }
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};