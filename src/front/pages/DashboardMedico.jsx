import React, { useEffect, useRef, useState } from "react";
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
    const [removingPatientId, setRemovingPatientId] = useState(null);
    const [patientError, setPatientError] = useState("");
    const [searchDone, setSearchDone] = useState(false);

    // =========================
    // RECETAS
    // =========================

    const [prescriptions, setPrescriptions] = useState([]);

    const [newPrescription, setNewPrescription] = useState({
        patientId: "",
        medication: "",
        medicationExternalId: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    });

    const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
    const [creatingPrescription, setCreatingPrescription] = useState(false);
    const [removingPrescriptionId, setRemovingPrescriptionId] = useState(null);
    const [prescriptionError, setPrescriptionError] = useState("");
    const [prescriptionSuccess, setPrescriptionSuccess] = useState("");

    // =========================
    // BÚSQUEDA DE MEDICAMENTOS
    // =========================

    const [medicationResults, setMedicationResults] = useState([]);
    const [searchingMedications, setSearchingMedications] = useState(false);
    const [medicationSearchDone, setMedicationSearchDone] = useState(false);

    const medicationSelectionRef = useRef(false);

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
    // CARGAR MIS RECETAS
    // =========================

    const loadPrescriptions = async () => {
        setLoadingPrescriptions(true);
        setPrescriptionError("");

        try {
            const token = getToken();

            if (!token) {
                setPrescriptionError(
                    "No hay sesión iniciada."
                );
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/recetas`,
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
                setPrescriptionError(
                    data.error ||
                    "No se pudieron cargar las recetas."
                );
                return;
            }

            const formattedPrescriptions = (
                data.prescriptions || []
            ).map((prescription) => {
                const medication =
                    prescription.medications?.[0];

                const patient = patients.find(
                    (p) =>
                        String(p.id) ===
                        String(prescription.patient_id)
                );

                return {
                    id: prescription.id,

                    patientId:
                        prescription.patient_id,

                    patientName: patient
                        ? `${patient.nombre} ${patient.apellidos}`
                        : `Paciente #${prescription.patient_id}`,

                    medication:
                        medication?.name || "Medicamento",

                    medicationExternalId:
                        medication?.external_id || "",

                    dosage:
                        medication?.dosage || "",

                    frequency:
                        medication?.frequency || "",

                    duration:
                        medication?.duration || "",

                    instructions:
                        medication?.instructions || "",

                    status:
                        prescription.status,

                    issuedAt:
                        prescription.issued_at
                };
            });

            setPrescriptions(
                formattedPrescriptions
            );

        } catch (error) {
            console.error(
                "Error cargando recetas:",
                error
            );

            setPrescriptionError(
                "Error de conexión con el servidor."
            );

        } finally {
            setLoadingPrescriptions(false);
        }
    };

    // =========================
    // CARGAR DATOS AL ENTRAR
    // =========================

    useEffect(() => {
        loadMyPatients();
        loadPrescriptions();
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

            setSearchResults(
                data.pacientes || []
            );

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
            (patient) =>
                String(patient.id) ===
                String(patientId)
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
                setPatientError(
                    "No hay sesión iniciada."
                );
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

            await loadMyPatients();

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
    // ELIMINAR PACIENTE
    // =========================

    const removePatient = async (patientId) => {
        setRemovingPatientId(patientId);
        setPatientError("");

        try {
            const token = getToken();

            if (!token) {
                setPatientError(
                    "No hay sesión iniciada."
                );
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/pacientes/${patientId}`,
                {
                    method: "DELETE",
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
                    "No se pudo eliminar el paciente."
                );
                return;
            }

            await loadMyPatients();

            setSearchResults((prevResults) =>
                prevResults.map((patient) =>
                    patient.id === patientId
                        ? {
                            ...patient,
                            is_mine: false
                        }
                        : patient
                )
            );

        } catch (error) {
            console.error(
                "Error eliminando paciente:",
                error
            );

            setPatientError(
                "Error de conexión con el servidor."
            );

        } finally {
            setRemovingPatientId(null);
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
    // CAMBIOS EN RECETA
    // =========================

    const handlePrescriptionChange = (e) => {
        const { name, value } = e.target;

        setNewPrescription((prev) => {
            if (name === "medication") {
                return {
                    ...prev,
                    medication: value,
                    medicationExternalId: ""
                };
            }

            return {
                ...prev,
                [name]: value
            };
        });
    };

    // =========================
    // CREAR RECETA
    // =========================

    const addPrescription = async (e) => {
        e.preventDefault();

        setPrescriptionError("");
        setPrescriptionSuccess("");

        if (!newPrescription.patientId) {
            setPrescriptionError(
                "Selecciona un paciente."
            );
            return;
        }

        if (!newPrescription.medication.trim()) {
            setPrescriptionError(
                "Introduce un medicamento."
            );
            return;
        }

        if (!newPrescription.dosage.trim()) {
            setPrescriptionError(
                "Introduce la dosis."
            );
            return;
        }

        setCreatingPrescription(true);

        try {
            const token = getToken();

            if (!token) {
                setPrescriptionError(
                    "No hay sesión iniciada."
                );
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
                        patient_id:
                            Number(
                                newPrescription.patientId
                            ),

                        medication_external_id:
                            newPrescription.medicationExternalId ||
                            null,

                        medication_name:
                            newPrescription.medication.trim(),

                        dosage:
                            newPrescription.dosage.trim(),

                        frequency:
                            newPrescription.frequency.trim() ||
                            null,

                        duration:
                            newPrescription.duration.trim() ||
                            null,

                        instructions:
                            newPrescription.instructions.trim() ||
                            null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPrescriptionError(
                    data.error ||
                    "No se pudo crear la receta."
                );
                return;
            }

            setPrescriptionSuccess(
                "Receta creada correctamente."
            );

            setNewPrescription({
                patientId: "",
                medication: "",
                medicationExternalId: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: ""
            });

            setMedicationResults([]);
            setMedicationSearchDone(false);
            setSearchingMedications(false);

            await loadPrescriptions();

        } catch (error) {
            console.error(
                "Error creando receta:",
                error
            );

            setPrescriptionError(
                "Error de conexión con el servidor."
            );

        } finally {
            setCreatingPrescription(false);
        }
    };

    // =========================
    // CANCELAR RECETA
    // =========================

    const removePrescription = async (id) => {
        setRemovingPrescriptionId(id);
        setPrescriptionError("");
        setPrescriptionSuccess("");

        try {
            const token = getToken();

            if (!token) {
                setPrescriptionError(
                    "No hay sesión iniciada."
                );
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/medico/recetas/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPrescriptionError(
                    data.error ||
                    "No se pudo cancelar la receta."
                );
                return;
            }

            setPrescriptionSuccess(
                "Receta cancelada correctamente."
            );

            await loadPrescriptions();

        } catch (error) {
            console.error(
                "Error cancelando receta:",
                error
            );

            setPrescriptionError(
                "Error de conexión con el servidor."
            );

        } finally {
            setRemovingPrescriptionId(null);
        }
    };

    // =========================
    // BÚSQUEDA DE MEDICAMENTOS
    // =========================

    useEffect(() => {
        const query =
            newPrescription.medication.trim();

        if (medicationSelectionRef.current) {
            medicationSelectionRef.current = false;
            return;
        }

        if (!query) {
            setMedicationResults([]);
            setMedicationSearchDone(false);
            setSearchingMedications(false);
            return;
        }

        if (query.length < 2) {
            setMedicationResults([]);
            setMedicationSearchDone(false);
            setSearchingMedications(false);
            return;
        }

        let cancelled = false;

        const timeoutId = setTimeout(async () => {
            setSearchingMedications(true);
            setMedicationSearchDone(false);

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/medicamentos?q=${encodeURIComponent(
                        query
                    )}`
                );

                const data = await response.json();

                if (cancelled) {
                    return;
                }

                if (!response.ok) {
                    console.error(
                        "Error buscando medicamentos:",
                        data.error
                    );

                    setMedicationResults([]);
                    setMedicationSearchDone(true);
                    return;
                }

                setMedicationResults(
                    data.resultados || []
                );

                setMedicationSearchDone(true);

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Error buscando medicamentos:",
                    error
                );

                setMedicationResults([]);
                setMedicationSearchDone(false);

            } finally {
                if (!cancelled) {
                    setSearchingMedications(false);
                }
            }

        }, 400);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };

    }, [newPrescription.medication]);

    // =========================
    // DATOS DEL MÉDICO
    // =========================

    const doctorName =
        store?.user?.first_name || "Médico";

    const doctorLastName =
        store?.user?.last_name || "";

    return (
        <div className="text-white py-4">
            <div className="container">

                {/* CABECERA */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-3">

                        <img
                            src={rigoImageUrl}
                            alt="Perfil médico"
                            className="rounded-circle object-fit-cover flex-shrink-0"
                            width="70"
                            height="70"
                        />

                        <div>
                            <span className="text-info text-uppercase small fw-semibold">
                                Panel médico
                            </span>

                            <h1 className="h3 fw-bold mb-1 mt-1">
                                Bienvenido, Dr. {doctorName}{" "}
                                {doctorLastName}
                            </h1>

                            <p className="text-white-50 mb-0">
                                Gestiona tus pacientes y recetas desde un mismo lugar.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RESUMEN */}

                <div className="row g-4 mb-4">

                    <div className="col-12 col-md-4">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
                            <span className="fs-2">👥</span>

                            <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                                Mis pacientes
                            </p>

                            <h2 className="display-6 fw-bold mb-0">
                                {patients.length}
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
                            <span className="fs-2">💊</span>

                            <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                                Recetas creadas
                            </p>

                            <h2 className="display-6 fw-bold mb-0">
                                {
                                    prescriptions.filter(
                                        (prescription) =>
                                            prescription.status !==
                                            "cancelled"
                                    ).length
                                }
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
                            <span className="fs-2">💬</span>

                            <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                                Mensajes
                            </p>

                            <h2 className="display-6 fw-bold mb-0">
                                {messages.length}
                            </h2>
                        </div>
                    </div>

                </div>

                {/* BUSCADOR DE PACIENTES */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">

                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="fs-4">🔎</span>

                        <h2 className="h4 fw-bold mb-0">
                            Buscar pacientes
                        </h2>
                    </div>

                    <div className="row g-3">

                        <div className="col-12 col-lg-9">
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Buscar por nombre, apellidos, DNI, CIP o email..."
                                value={searchPatient}
                                onChange={(e) =>
                                    setSearchPatient(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        searchPatients();
                                    }
                                }}
                            />
                        </div>

                        <div className="col-12 col-lg-3">
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-info rounded-pill fw-semibold flex-grow-1"
                                    onClick={searchPatients}
                                    disabled={loadingPatients}
                                >
                                    {loadingPatients
                                        ? "Buscando..."
                                        : "Buscar"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-light rounded-pill"
                                    onClick={clearPatients}
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

                {/* RESULTADOS DE BÚSQUEDA */}

                {(searchDone || loadingPatients) && (
                    <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-5">

                        <h2 className="h4 fw-bold mb-4">
                            Resultados de búsqueda
                        </h2>

                        {loadingPatients && (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border text-info"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Buscando...
                                    </span>
                                </div>

                                <p className="text-white-50 mt-3 mb-0">
                                    Buscando pacientes...
                                </p>
                            </div>
                        )}

                        {!loadingPatients &&
                            searchResults.length === 0 && (
                                <div className="text-center py-5">
                                    <div className="fs-1 mb-3">
                                        🔎
                                    </div>

                                    <h3 className="h5 fw-bold">
                                        No se encontraron pacientes
                                    </h3>

                                    <p className="text-white-50 mb-0">
                                        Prueba con otro nombre, DNI,
                                        CIP o email.
                                    </p>
                                </div>
                            )}

                        {!loadingPatients && (
                            <div className="row g-4">

                                {searchResults.map((patient) => {
                                    const alreadyMine =
                                        isMyPatient(patient.id);

                                    const adding =
                                        addingPatientId === patient.id;

                                    return (
                                        <div
                                            className="col-12 col-xl-6"
                                            key={patient.id}
                                        >
                                            <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                                                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">

                                                    <div>
                                                        <h3 className="h5 fw-bold mb-1">
                                                            {patient.nombre}{" "}
                                                            {patient.apellidos}
                                                        </h3>

                                                        <span className="text-white-50 small">
                                                            Paciente #{patient.id}
                                                        </span>
                                                    </div>

                                                    <span
                                                        className={`badge rounded-pill ${
                                                            alreadyMine
                                                                ? "bg-success"
                                                                : "bg-secondary"
                                                        }`}
                                                    >
                                                        {alreadyMine
                                                            ? "Mi paciente"
                                                            : "Disponible"}
                                                    </span>

                                                </div>

                                                <hr className="border-secondary opacity-25" />

                                                <div className="row g-3">

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            DNI
                                                        </span>

                                                        <span className="text-white-50 text-break">
                                                            {patient.dni ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            CIP
                                                        </span>

                                                        <span className="text-white-50 text-break">
                                                            {patient.cip ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            Email
                                                        </span>

                                                        <span className="text-white-50 text-break">
                                                            {patient.email ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            Teléfono
                                                        </span>

                                                        <span className="text-white-50">
                                                            {patient.telefono ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            Fecha de nacimiento
                                                        </span>

                                                        <span className="text-white-50">
                                                            {patient.fecha_nacimiento
                                                                ? new Date(
                                                                    patient.fecha_nacimiento
                                                                ).toLocaleDateString(
                                                                    "es-ES"
                                                                )
                                                                : "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            Sexo
                                                        </span>

                                                        <span className="text-white-50">
                                                            {patient.sexo ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <span className="text-info small d-block">
                                                            Grupo sanguíneo
                                                        </span>

                                                        <span className="text-white-50">
                                                            {patient.grupo_sanguineo ||
                                                                "No disponible"}
                                                        </span>
                                                    </div>

                                                </div>

                                                <div className="mt-4">

                                                    {alreadyMine ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-success rounded-pill btn-sm"
                                                            disabled
                                                        >
                                                            ✓ Ya es mi paciente
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-info rounded-pill btn-sm fw-semibold"
                                                            onClick={() =>
                                                                addPatient(
                                                                    patient.id
                                                                )
                                                            }
                                                            disabled={adding}
                                                        >
                                                            {adding
                                                                ? "Agregando..."
                                                                : "Agregar a mis pacientes"}
                                                        </button>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>
                )}

                {/* MIS PACIENTES */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-5">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                        <div>
                            <span className="text-info text-uppercase small fw-semibold">
                                Gestión
                            </span>

                            <h2 className="h4 fw-bold mb-0 mt-1">
                                Mis pacientes
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-info rounded-pill btn-sm"
                            onClick={loadMyPatients}
                            disabled={loadingMyPatients}
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
                                    className="spinner-border text-info"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Cargando...
                                    </span>
                                </div>

                                <p className="text-white-50 mt-3 mb-0">
                                    Cargando tus pacientes...
                                </p>
                            </div>
                        )}

                    {!loadingMyPatients &&
                        patients.length === 0 && (
                            <div className="text-center py-5">
                                <div className="fs-1 mb-3">
                                    👥
                                </div>

                                <h3 className="h5 fw-bold">
                                    Todavía no tienes pacientes
                                </h3>

                                <p className="text-white-50 mb-0">
                                    Utiliza el buscador para encontrar
                                    un paciente y agregarlo a tu lista.
                                </p>
                            </div>
                        )}

                    <div className="row g-4">

                        {patients.map((patient) => (
                            <div
                                className="col-12 col-xl-6"
                                key={patient.id}
                            >
                                <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">

                                        <div>
                                            <h3 className="h5 fw-bold mb-1">
                                                {patient.nombre}{" "}
                                                {patient.apellidos}
                                            </h3>

                                            <span className="text-white-50 small">
                                                Paciente #{patient.id}
                                            </span>
                                        </div>

                                        <span className="badge bg-success rounded-pill">
                                            Mi paciente
                                        </span>

                                    </div>

                                    <hr className="border-secondary opacity-25" />

                                    <div className="row g-3">

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                DNI
                                            </span>

                                            <span className="text-white-50">
                                                {patient.dni ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                CIP
                                            </span>

                                            <span className="text-white-50">
                                                {patient.cip ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                Email
                                            </span>

                                            <span className="text-white-50 text-break">
                                                {patient.email ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                Teléfono
                                            </span>

                                            <span className="text-white-50">
                                                {patient.telefono ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                Fecha de nacimiento
                                            </span>

                                            <span className="text-white-50">
                                                {patient.fecha_nacimiento
                                                    ? new Date(
                                                        patient.fecha_nacimiento
                                                    ).toLocaleDateString(
                                                        "es-ES"
                                                    )
                                                    : "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                Sexo
                                            </span>

                                            <span className="text-white-50">
                                                {patient.sexo ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <span className="text-info small d-block">
                                                Grupo sanguíneo
                                            </span>

                                            <span className="text-white-50">
                                                {patient.grupo_sanguineo ||
                                                    "No disponible"}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="d-flex flex-wrap gap-2 mt-4">

                                        <button
                                            type="button"
                                            className="btn btn-outline-info rounded-pill btn-sm"
                                        >
                                            Ver historial
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-success rounded-pill btn-sm"
                                        >
                                            Nueva consulta
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger rounded-pill btn-sm"
                                            onClick={() =>
                                                removePatient(
                                                    patient.id
                                                )
                                            }
                                            disabled={
                                                removingPatientId ===
                                                patient.id
                                            }
                                        >
                                            {removingPatientId ===
                                            patient.id
                                                ? "Eliminando..."
                                                : "Eliminar"}
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                </div>

                {/* RECETAS */}

                <div className="row g-4 mb-5">

                    {/* CREAR RECETA */}

                    <div className="col-12 col-xl-6">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                            <div className="mb-4">
                                <span className="text-info text-uppercase small fw-semibold">
                                    Tratamiento
                                </span>

                                <h2 className="h4 fw-bold mb-0 mt-1">
                                    Crear receta
                                </h2>
                            </div>

                            {prescriptionError && (
                                <div className="alert alert-danger">
                                    {prescriptionError}
                                </div>
                            )}

                            {prescriptionSuccess && (
                                <div className="alert alert-success">
                                    {prescriptionSuccess}
                                </div>
                            )}

                            <form onSubmit={addPrescription}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Paciente
                                    </label>

                                    <select
                                        className="form-select bg-dark text-white border-secondary"
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

                                        {patients.map((patient) => (
                                            <option
                                                key={patient.id}
                                                value={patient.id}
                                            >
                                                {patient.nombre}{" "}
                                                {patient.apellidos}
                                            </option>
                                        ))}
                                    </select>

                                    {patients.length === 0 && (
                                        <div className="form-text text-white-50">
                                            Primero agrega un paciente a tu lista.
                                        </div>
                                    )}
                                </div>

                                {/* MEDICAMENTO */}

                                <div className="mb-3 position-relative">

                                    <label className="form-label">
                                        Medicamento
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        name="medication"
                                        placeholder="Ej. Paracetamol"
                                        value={
                                            newPrescription.medication
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                        autoComplete="off"
                                    />

                                    {searchingMedications && (
                                        <div className="text-white-50 small mt-2">
                                            Buscando medicamentos...
                                        </div>
                                    )}

                                    {!searchingMedications &&
                                        medicationSearchDone &&
                                        medicationResults.length === 0 && (
                                            <div className="text-white-50 small mt-2">
                                                No se encontraron medicamentos.
                                                Puedes introducir un medicamento manualmente.
                                            </div>
                                        )}

                                    {medicationResults.length > 0 && (
                                        <div
                                            className="list-group position-absolute w-100 shadow"
                                            style={{
                                                top: "100%",
                                                zIndex: 1000,
                                                maxHeight: "300px",
                                                overflowY: "auto"
                                            }}
                                        >
                                            {medicationResults.map(
                                                (medication) => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            medication.registro
                                                        }
                                                        className="list-group-item list-group-item-action"
                                                        onClick={() => {
                                                            medicationSelectionRef.current =
                                                                true;

                                                            setNewPrescription({
                                                                ...newPrescription,
                                                                medication:
                                                                    medication.nombre,
                                                                medicationExternalId:
                                                                    medication.registro ||
                                                                    "",
                                                                dosage:
                                                                    medication.dosis ||
                                                                    ""
                                                            });

                                                            setMedicationResults(
                                                                []
                                                            );

                                                            setMedicationSearchDone(
                                                                false
                                                            );

                                                            setSearchingMedications(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <div className="fw-bold">
                                                            {
                                                                medication.nombre
                                                            }
                                                        </div>

                                                        <small className="text-muted">
                                                            {medication.principio_activo &&
                                                                medication.principio_activo}

                                                            {medication.dosis &&
                                                                ` · ${medication.dosis}`}

                                                            {medication.forma_farmaceutica &&
                                                                ` · ${medication.forma_farmaceutica}`}
                                                        </small>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Dosis
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        name="dosage"
                                        placeholder="Ej. 500 mg"
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
                                        Frecuencia
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        name="frequency"
                                        placeholder="Ej. Cada 8 horas"
                                        value={
                                            newPrescription.frequency
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Duración
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        name="duration"
                                        placeholder="Ej. 7 días"
                                        value={
                                            newPrescription.duration
                                        }
                                        onChange={
                                            handlePrescriptionChange
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Instrucciones
                                    </label>

                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
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
                                    className="btn btn-info rounded-pill fw-semibold"
                                    disabled={
                                        patients.length === 0 ||
                                        creatingPrescription
                                    }
                                >
                                    {creatingPrescription
                                        ? "Creando receta..."
                                        : "Crear receta"}
                                </button>

                            </form>

                        </div>
                    </div>

                    {/* RECETAS CREADAS */}

                    <div className="col-12 col-xl-6">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                                <div>
                                    <span className="text-info text-uppercase small fw-semibold">
                                        Historial
                                    </span>

                                    <h2 className="h4 fw-bold mb-0 mt-1">
                                        Recetas
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-info rounded-pill btn-sm"
                                    onClick={loadPrescriptions}
                                    disabled={
                                        loadingPrescriptions
                                    }
                                >
                                    {loadingPrescriptions
                                        ? "Actualizando..."
                                        : "Actualizar"}
                                </button>

                            </div>

                            {loadingPrescriptions &&
                                prescriptions.length === 0 && (
                                    <div className="text-center py-5">
                                        <div
                                            className="spinner-border text-info"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>

                                        <p className="text-white-50 mt-3">
                                            Cargando recetas...
                                        </p>
                                    </div>
                                )}

                            {!loadingPrescriptions &&
                                prescriptions.length === 0 && (
                                    <div className="text-center py-5">
                                        <div className="fs-1 mb-3">
                                            💊
                                        </div>

                                        <p className="text-white-50 mb-0">
                                            Todavía no has creado ninguna receta.
                                        </p>
                                    </div>
                                )}

                            {prescriptions.length > 0 && (
                                <div>
                                    {prescriptions.map(
                                        (prescription) => (
                                            <div
                                                key={
                                                    prescription.id
                                                }
                                                className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-4 p-3 mb-3"
                                            >

                                                <div className="d-flex justify-content-between align-items-start gap-3">

                                                    <div className="flex-grow-1">

                                                        <div className="d-flex align-items-center flex-wrap gap-2 mb-2">

                                                            <h3 className="h6 fw-bold mb-0">
                                                                {
                                                                    prescription.patientName
                                                                }
                                                            </h3>

                                                            {prescription.status ===
                                                                "cancelled" && (
                                                                    <span className="badge bg-danger rounded-pill">
                                                                        Cancelada
                                                                    </span>
                                                                )}

                                                        </div>

                                                        <strong className="d-block mb-1">
                                                            {
                                                                prescription.medication
                                                            }
                                                        </strong>

                                                        <span className="text-white-50 small d-block">
                                                            {
                                                                prescription.dosage
                                                            }
                                                        </span>

                                                        {prescription.frequency && (
                                                            <span className="text-white-50 small d-block mt-1">
                                                                <strong>
                                                                    Frecuencia:
                                                                </strong>{" "}
                                                                {
                                                                    prescription.frequency
                                                                }
                                                            </span>
                                                        )}

                                                        {prescription.duration && (
                                                            <span className="text-white-50 small d-block mt-1">
                                                                <strong>
                                                                    Duración:
                                                                </strong>{" "}
                                                                {
                                                                    prescription.duration
                                                                }
                                                            </span>
                                                        )}

                                                        {prescription.instructions && (
                                                            <span className="text-white-50 small d-block mt-2">
                                                                {
                                                                    prescription.instructions
                                                                }
                                                            </span>
                                                        )}

                                                        {prescription.issuedAt && (
                                                            <span className="text-white-50 small d-block mt-2">
                                                                Creada:{" "}
                                                                {new Date(
                                                                    prescription.issuedAt
                                                                ).toLocaleString(
                                                                    "es-ES"
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                    {prescription.status ===
                                                        "active" && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm rounded-pill flex-shrink-0"
                                                                onClick={() =>
                                                                    removePrescription(
                                                                        prescription.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    removingPrescriptionId ===
                                                                    prescription.id
                                                                }
                                                            >
                                                                {removingPrescriptionId ===
                                                                prescription.id
                                                                    ? "Cancelando..."
                                                                    : "Cancelar"}
                                                            </button>
                                                        )}

                                                </div>

                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* MENSAJES */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <span className="fs-4">💬</span>

                        <h2 className="h4 fw-bold mb-0">
                            Mensajes recientes
                        </h2>
                    </div>

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="d-flex justify-content-between align-items-start gap-3 py-3 border-bottom border-secondary border-opacity-25"
                        >
                            <div>
                                <strong className="d-block">
                                    {message.sender}
                                </strong>

                                <span className="text-white-50 small">
                                    {message.message}
                                </span>
                            </div>

                            <span className="text-white-50 small flex-shrink-0">
                                {message.time}
                            </span>
                        </div>
                    ))}

                </div>

                {/* SEGURIDAD */}

                <div className="text-center border-top border-secondary border-opacity-25 mt-5 pt-4 pb-3">
                    <span className="text-white-50 small">
                        🔒 Conexión cifrada SSL · Información sanitaria protegida
                    </span>
                </div>

            </div>
        </div>
    );
};