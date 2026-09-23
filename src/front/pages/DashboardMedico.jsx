import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export const DashboardMedico = () => {
    const { store } = useGlobalReducer();

    // =====================================================
    // ESTADOS
    // =====================================================

    const [patients, setPatients] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const [searchPatient, setSearchPatient] = useState("");
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingMyPatients, setLoadingMyPatients] = useState(false);
    const [addingPatientId, setAddingPatientId] = useState(null);
    const [removingPatientId, setRemovingPatientId] = useState(null);
    const [patientError, setPatientError] = useState("");
    const [searchDone, setSearchDone] = useState(false);

    // =====================================================
    // ESPECIALISTAS
    // =====================================================

    const [specialists, setSpecialists] = useState([]);
    const [loadingSpecialists, setLoadingSpecialists] = useState(false);
    const [assigningSpecialistId, setAssigningSpecialistId] = useState(null);

    const [selectedSpecialistByPatient, setSelectedSpecialistByPatient] =
        useState({});

    const [specialistError, setSpecialistError] = useState("");

    const [patientSpecialists, setPatientSpecialists] = useState({});

    const [loadingPatientSpecialists, setLoadingPatientSpecialists] =
        useState({});

    const [removingSpecialist, setRemovingSpecialist] = useState(null);

    // =====================================================
    // CONSULTAS
    // =====================================================

    const [consultations, setConsultations] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(false);
    const [consultationError, setConsultationError] = useState("");
    const [completingConsultationId, setCompletingConsultationId] =
        useState(null);

    // =====================================================
    // MENSAJES
    // =====================================================

    const [messages] = useState([
        {
            id: 1,
            sender: "Ana Torres",
            message: "Buenos días doctor, quería consultar una duda.",
            time: "10:30",
        },
        {
            id: 2,
            sender: "Luis Gómez",
            message: "¿Podría revisar mi última analítica?",
            time: "09:45",
        },
    ]);

    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return (
            localStorage.getItem("access_token") ||
            localStorage.getItem("token")
        );
    };

    // =====================================================
    // URL BACKEND
    // =====================================================

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // =====================================================
    // DATOS DEL MÉDICO
    // =====================================================

    const doctorName = store?.user?.first_name || "Médico";
    const doctorLastName = store?.user?.last_name || "";

    const rawSpecialty =
        store?.user?.especialidad ||
        store?.user?.specialty ||
        "";

    const doctorSpecialty =
        typeof rawSpecialty === "string"
            ? rawSpecialty
            : rawSpecialty?.name ||
            rawSpecialty?.nombre ||
            "";

    const normalizedSpecialty = doctorSpecialty
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const isPrimaryCareDoctor = [
        "medicina de familia",
        "medicina familiar y comunitaria",
        "medicina general",
        "medicina familiar",
        "medico de familia",
        "medico de cabecera",
    ].includes(normalizedSpecialty);

    // =====================================================
    // CARGAR MIS PACIENTES
    // =====================================================

    const loadMyPatients = async () => {
        setLoadingMyPatients(true);
        setPatientError("");

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error || "No se pudieron cargar tus pacientes."
                );
                return;
            }

            setPatients(data.pacientes || []);
        } catch (error) {
            console.error("Error cargando mis pacientes:", error);

            setPatientError("Error de conexión con el servidor.");
        } finally {
            setLoadingMyPatients(false);
        }
    };

    // =====================================================
    // CARGAR ESPECIALISTAS DISPONIBLES
    // =====================================================

    const loadSpecialists = async () => {
        if (!isPrimaryCareDoctor) {
            setSpecialists([]);
            return;
        }

        setLoadingSpecialists(true);
        setSpecialistError("");

        try {
            const token = getToken();

            if (!token) {
                setSpecialistError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/especialistas`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setSpecialistError(
                    data.error || "No se pudieron cargar los especialistas."
                );
                return;
            }

            setSpecialists(data.especialistas || []);
        } catch (error) {
            console.error("Error cargando especialistas:", error);

            setSpecialistError("Error de conexión con el servidor.");
        } finally {
            setLoadingSpecialists(false);
        }
    };

    // =====================================================
    // CARGAR ESPECIALISTAS DE UN PACIENTE
    // =====================================================

    const loadPatientSpecialists = async (patientId) => {
        if (!isPrimaryCareDoctor) {
            return;
        }

        setLoadingPatientSpecialists((prev) => ({
            ...prev,
            [patientId]: true,
        }));

        setSpecialistError("");

        try {
            const token = getToken();

            if (!token) {
                setSpecialistError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes/${patientId}/especialistas`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setSpecialistError(
                    data.error ||
                    "No se pudieron cargar los especialistas del paciente."
                );
                return;
            }

            setPatientSpecialists((prev) => ({
                ...prev,
                [patientId]: data.especialistas || [],
            }));
        } catch (error) {
            console.error(
                "Error cargando especialistas del paciente:",
                error
            );

            setSpecialistError("Error de conexión con el servidor.");
        } finally {
            setLoadingPatientSpecialists((prev) => ({
                ...prev,
                [patientId]: false,
            }));
        }
    };

    // =====================================================
    // CARGAR ESPECIALISTAS DE TODOS MIS PACIENTES
    // =====================================================

    const loadAllPatientSpecialists = async (patientList) => {
        if (!isPrimaryCareDoctor || !patientList?.length) {
            return;
        }

        for (const patient of patientList) {
            await loadPatientSpecialists(patient.id);
        }
    };

    // =====================================================
    // ASIGNAR ESPECIALISTA
    // =====================================================

    const assignSpecialist = async (patientId) => {
        if (!isPrimaryCareDoctor) {
            return;
        }

        const specialistId =
            selectedSpecialistByPatient[patientId];

        if (!specialistId) {
            setSpecialistError(
                "Selecciona un especialista antes de asignarlo."
            );
            return;
        }

        setAssigningSpecialistId(patientId);
        setSpecialistError("");

        try {
            const token = getToken();

            if (!token) {
                setSpecialistError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes/${patientId}/especialista`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        specialist_id: Number(specialistId),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setSpecialistError(
                    data.error || "No se pudo asignar el especialista."
                );
                return;
            }

            setSelectedSpecialistByPatient((prev) => ({
                ...prev,
                [patientId]: "",
            }));

            await loadPatientSpecialists(patientId);
        } catch (error) {
            console.error("Error asignando especialista:", error);

            setSpecialistError("Error de conexión con el servidor.");
        } finally {
            setAssigningSpecialistId(null);
        }
    };

    // =====================================================
    // ELIMINAR ESPECIALISTA DE UN PACIENTE
    // =====================================================

    const removeSpecialist = async (patientId, specialistId) => {
        if (!isPrimaryCareDoctor) {
            return;
        }

        const confirmDelete = window.confirm(
            "¿Seguro que quieres quitar este especialista del paciente?"
        );

        if (!confirmDelete) {
            return;
        }

        setRemovingSpecialist(`${patientId}-${specialistId}`);
        setSpecialistError("");

        try {
            const token = getToken();

            if (!token) {
                setSpecialistError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes/${patientId}/especialista/${specialistId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setSpecialistError(
                    data.error ||
                    "No se pudo eliminar el especialista."
                );
                return;
            }

            await loadPatientSpecialists(patientId);
        } catch (error) {
            console.error("Error eliminando especialista:", error);

            setSpecialistError("Error de conexión con el servidor.");
        } finally {
            setRemovingSpecialist(null);
        }
    };

    // =====================================================
    // CARGAR CONSULTAS
    // =====================================================

    const loadConsultations = async () => {
        setLoadingConsultations(true);
        setConsultationError("");

        try {
            const token = getToken();

            if (!token) {
                setConsultationError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/consultas`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setConsultationError(
                    data.error || "No se pudieron cargar las consultas."
                );
                return;
            }

            setConsultations(data.consultas || []);
        } catch (error) {
            console.error("Error cargando consultas:", error);

            setConsultationError("Error de conexión con el servidor.");
        } finally {
            setLoadingConsultations(false);
        }
    };

    // =====================================================
    // COMPLETAR CONSULTA
    // =====================================================

    const completeConsultation = async (consultationId) => {
        setCompletingConsultationId(consultationId);
        setConsultationError("");

        try {
            const token = getToken();

            if (!token) {
                setConsultationError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/consultas/${consultationId}/completar`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setConsultationError(
                    data.error || "No se pudo completar la consulta."
                );
                return;
            }

            await loadConsultations();
        } catch (error) {
            console.error("Error completando consulta:", error);

            setConsultationError("Error de conexión con el servidor.");
        } finally {
            setCompletingConsultationId(null);
        }
    };

    // =====================================================
    // BUSCAR PACIENTES
    // =====================================================

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
                `${BACKEND_URL}/api/medico/pacientes/buscar?q=${encodeURIComponent(
                    searchPatient.trim()
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error || "No se pudieron buscar los pacientes."
                );

                setSearchResults([]);
                return;
            }

            setSearchResults(data.pacientes || []);
            setSearchDone(true);
        } catch (error) {
            console.error("Error buscando pacientes:", error);

            setPatientError("Error de conexión con el servidor.");
            setSearchResults([]);
        } finally {
            setLoadingPatients(false);
        }
    };

    // =====================================================
    // COMPROBAR SI ES MI PACIENTE
    // =====================================================

    const isMyPatient = (patientId) => {
        return patients.some(
            (patient) =>
                String(patient.id) === String(patientId)
        );
    };

    // =====================================================
    // AGREGAR PACIENTE
    // =====================================================

    const addPatient = async (patientId) => {
        if (!isPrimaryCareDoctor) {
            return;
        }

        setAddingPatientId(patientId);
        setPatientError("");

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes/${patientId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error || "No se pudo agregar el paciente."
                );
                return;
            }

            await loadMyPatients();

            setSearchResults((prevResults) =>
                prevResults.map((patient) =>
                    String(patient.id) === String(patientId)
                        ? {
                            ...patient,
                            is_mine: true,
                        }
                        : patient
                )
            );
        } catch (error) {
            console.error("Error agregando paciente:", error);

            setPatientError("Error de conexión con el servidor.");
        } finally {
            setAddingPatientId(null);
        }
    };

    // =====================================================
    // ELIMINAR PACIENTE
    // =====================================================

    const removePatient = async (patientId) => {
        if (!isPrimaryCareDoctor) {
            return;
        }

        setRemovingPatientId(patientId);
        setPatientError("");

        try {
            const token = getToken();

            if (!token) {
                setPatientError("No hay sesión iniciada.");
                return;
            }

            const response = await fetch(
                `${BACKEND_URL}/api/medico/pacientes/${patientId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPatientError(
                    data.error || "No se pudo eliminar el paciente."
                );
                return;
            }

            await loadMyPatients();

            setSearchResults((prevResults) =>
                prevResults.map((patient) =>
                    String(patient.id) === String(patientId)
                        ? {
                            ...patient,
                            is_mine: false,
                        }
                        : patient
                )
            );

            setPatientSpecialists((prev) => {
                const updated = { ...prev };
                delete updated[patientId];
                return updated;
            });
        } catch (error) {
            console.error("Error eliminando paciente:", error);

            setPatientError("Error de conexión con el servidor.");
        } finally {
            setRemovingPatientId(null);
        }
    };

    // =====================================================
    // LIMPIAR BÚSQUEDA
    // =====================================================

    const clearPatients = () => {
        setSearchPatient("");
        setSearchResults([]);
        setPatientError("");
        setSearchDone(false);
    };

    // =====================================================
    // CARGAR DATOS AL ENTRAR
    // =====================================================

    useEffect(() => {
        loadMyPatients();
        loadConsultations();
    }, []);

    useEffect(() => {
        if (isPrimaryCareDoctor) {
            loadSpecialists();
        } else {
            setSpecialists([]);
            setPatientSpecialists({});
        }
    }, [isPrimaryCareDoctor]);

    useEffect(() => {
        if (isPrimaryCareDoctor && patients.length > 0) {
            loadAllPatientSpecialists(patients);
        }
    }, [patients, isPrimaryCareDoctor]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="text-white py-4">
            <div className="container">

                {/* =====================================================
                    CABECERA
                ===================================================== */}

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

                            <p className="text-white-50 mb-1">
                                Gestiona tus pacientes desde un mismo lugar.
                            </p>

                            <span className="badge bg-info text-dark rounded-pill">
                                {doctorSpecialty ||
                                    "Especialidad no disponible"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    RESUMEN
                ===================================================== */}

                <div className="row g-4 mb-4">

                    <div className="col-12 col-md-4">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
                            <Icon name="Users" className="fs-2" size="1em" />

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
                            <Icon name="CalendarDays" className="fs-2" size="1em" />

                            <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                                Consultas pendientes
                            </p>

                            <h2 className="display-6 fw-bold mb-0">
                                {consultations.length}
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 h-100">
                            <Icon name="MessageCircle" className="fs-2" size="1em" />

                            <p className="text-info text-uppercase small fw-semibold mt-3 mb-1">
                                Mensajes
                            </p>

                            <h2 className="display-6 fw-bold mb-0">
                                {messages.length}
                            </h2>
                        </div>
                    </div>

                </div>

                {/* =====================================================
                    AVISO MÉDICO
                ===================================================== */}

                {isPrimaryCareDoctor ? (
                    <div className="alert alert-info bg-info bg-opacity-10 border-info text-white mb-4">
                        <strong>Médico de cabecera</strong>

                        <div className="small mt-1 text-white-50">
                            Puedes buscar pacientes, agregarlos a tu lista,
                            asignarles especialistas y gestionar sus
                            especialistas asignados.
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-secondary bg-white bg-opacity-10 border-secondary text-white mb-4">
                        <strong>Médico especialista</strong>

                        <div className="small mt-1 text-white-50">
                            Puedes buscar pacientes y consultar y atender a
                            los que tienes asignados. Solo el médico de
                            cabecera puede asignar pacientes.
                        </div>
                    </div>
                )}

                {/* =====================================================
                    BUSCADOR DE PACIENTES
                ===================================================== */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">

                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Icon name="Search" className="fs-4" size="1em" />

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
                                    setSearchPatient(e.target.value)
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

                {/* =====================================================
                    RESULTADOS DE BÚSQUEDA
                ===================================================== */}

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

                                    <Icon name="SearchX" className="fs-1 mb-3" size="1em" />

                                    <h3 className="h5 fw-bold">
                                        No se encontraron pacientes
                                    </h3>

                                    <p className="text-white-50 mb-0">
                                        Prueba con otro nombre, DNI, CIP o
                                        email.
                                    </p>

                                </div>
                            )}

                        {!loadingPatients &&
                            searchResults.length > 0 && (
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
                                                                Paciente #
                                                                {patient.id}
                                                            </span>
                                                        </div>

                                                        <span
                                                            className={`badge rounded-pill ${alreadyMine
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
                                                                Fecha de
                                                                nacimiento
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

                                                    <div className="mt-4 d-flex flex-wrap gap-2">

                                                        <Link
                                                            to="/historial/clinico"
                                                            state={{ patient }}
                                                            className="btn btn-outline-info rounded-pill btn-sm"
                                                        >
                                                            Ver historial
                                                        </Link>

                                                        {alreadyMine ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-success rounded-pill btn-sm"
                                                                disabled
                                                            >
                                                                <Icon name="Check" className="me-1" />Ya es mi paciente
                                                            </button>
                                                        ) : isPrimaryCareDoctor ? (
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
                                                        ) : (
                                                            <span className="text-white-50 small fst-italic align-self-center">
                                                                Solo el médico
                                                                de cabecera puede
                                                                asignar pacientes.
                                                            </span>
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

                {/* =====================================================
                    MIS PACIENTES
                ===================================================== */}

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

                    {specialistError && (
                        <div className="alert alert-danger">
                            {specialistError}
                        </div>
                    )}

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

                                <Icon name="Users" className="fs-1 mb-3" size="1em" />

                                <h3 className="h5 fw-bold">
                                    Todavía no tienes pacientes
                                </h3>

                                <p className="text-white-50 mb-0">
                                    {isPrimaryCareDoctor
                                        ? "Utiliza el buscador para encontrar un paciente y agregarlo a tu lista."
                                        : "No tienes pacientes asignados actualmente."}
                                </p>

                            </div>
                        )}

                    <div className="row g-4">

                        {patients.map((patient) => {

                            const assignedSpecialists =
                                patientSpecialists[patient.id] || [];

                            const loadingAssignedSpecialists =
                                loadingPatientSpecialists[patient.id];

                            return (
                                <div
                                    className="col-12 col-xl-6"
                                    key={patient.id}
                                >

                                    <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-4 p-4 h-100">

                                        {/* CABECERA PACIENTE */}

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

                                        {/* DATOS PACIENTE */}

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

                                        {/* ACCIONES CLÍNICAS */}

                                        <div className="d-flex flex-wrap gap-2 mt-4">

                                            <Link
                                                to="/historial/clinico"
                                                state={{ patient }}
                                                className="btn btn-outline-info rounded-pill btn-sm"
                                            >
                                                Ver historial
                                            </Link>

                                            <Link
                                                to="/nueva-consulta"
                                                state={{ patient }}
                                                className="btn btn-outline-info rounded-pill btn-sm"
                                            >
                                                Nueva consulta
                                            </Link>

                                            <Link
                                                to="/crear-receta"
                                                state={{ patient }}
                                                className="btn btn-outline-info rounded-pill btn-sm"
                                            >
                                                Crear receta
                                            </Link>

                                            <Link
                                                to="/nuevo-diagnostico"
                                                state={{ patient }}
                                                className="btn btn-outline-info rounded-pill btn-sm"
                                            >
                                                Crear diagnóstico
                                            </Link>

                                        </div>

                                        {/* =================================================
                                            ESPECIALISTAS ASIGNADOS
                                        ================================================= */}

                                        {isPrimaryCareDoctor && (
                                            <div className="w-100 mt-4 pt-3 border-top border-secondary border-opacity-25">

                                                <div className="d-flex justify-content-between align-items-center gap-2 mb-3">

                                                    <div className="d-flex align-items-center gap-2">
                                                        <Icon name="UserRound" />

                                                        <div>
                                                            <strong className="text-info d-block">
                                                                Especialistas asignados
                                                            </strong>

                                                            <span className="text-white-50 small">
                                                                {assignedSpecialists.length === 0
                                                                    ? "Este paciente no tiene especialistas asignados"
                                                                    : `${assignedSpecialists.length} especialista${assignedSpecialists.length !== 1
                                                                        ? "s"
                                                                        : ""
                                                                    } asignado${assignedSpecialists.length !== 1
                                                                        ? "s"
                                                                        : ""
                                                                    }`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-info rounded-pill btn-sm"
                                                        onClick={() =>
                                                            loadPatientSpecialists(
                                                                patient.id
                                                            )
                                                        }
                                                        disabled={
                                                            loadingAssignedSpecialists
                                                        }
                                                    >
                                                        {loadingAssignedSpecialists
                                                            ? "Actualizando..."
                                                            : "Actualizar"}
                                                    </button>

                                                </div>

                                                {loadingAssignedSpecialists &&
                                                    assignedSpecialists.length === 0 && (
                                                        <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 text-center">
                                                            <div
                                                                className="spinner-border spinner-border-sm text-info"
                                                                role="status"
                                                            >
                                                                <span className="visually-hidden">
                                                                    Cargando...
                                                                </span>
                                                            </div>

                                                            <span className="text-white-50 small ms-2">
                                                                Cargando especialistas...
                                                            </span>
                                                        </div>
                                                    )}

                                                {!loadingAssignedSpecialists &&
                                                    assignedSpecialists.length === 0 && (
                                                        <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Icon name="Info" className="fs-5" size="1em" />

                                                                <span className="text-white-50 small">
                                                                    No hay especialistas asignados actualmente.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                {assignedSpecialists.length > 0 && (
                                                    <div className="d-flex flex-column gap-2">

                                                        {assignedSpecialists.map(
                                                            (specialist) => {

                                                                const removing =
                                                                    removingSpecialist ===
                                                                    `${patient.id}-${specialist.id}`;

                                                                return (
                                                                    <div
                                                                        key={specialist.id}
                                                                        className="bg-dark bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3"
                                                                    >

                                                                        <div className="d-flex justify-content-between align-items-center gap-3">

                                                                            <div className="d-flex align-items-center gap-3">

                                                                                <div
                                                                                    className="rounded-circle bg-info bg-opacity-25 d-flex align-items-center justify-content-center flex-shrink-0"
                                                                                    style={{
                                                                                        width: "42px",
                                                                                        height: "42px",
                                                                                    }}
                                                                                >
                                                                                    <Icon name="Stethoscope" />
                                                                                </div>

                                                                                <div>
                                                                                    <strong className="d-block text-white">
                                                                                        {
                                                                                            specialist.nombre
                                                                                        }{" "}
                                                                                        {
                                                                                            specialist.apellidos
                                                                                        }
                                                                                    </strong>

                                                                                    <span className="text-info small">
                                                                                        {
                                                                                            specialist.especialidad
                                                                                        }
                                                                                    </span>
                                                                                </div>

                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-outline-danger rounded-pill btn-sm text-nowrap"
                                                                                onClick={() =>
                                                                                    removeSpecialist(
                                                                                        patient.id,
                                                                                        specialist.id
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    removing
                                                                                }
                                                                            >
                                                                                {removing
                                                                                    ? "Quitando..."
                                                                                    : "Quitar"}
                                                                            </button>

                                                                        </div>

                                                                    </div>
                                                                );
                                                            }
                                                        )}

                                                    </div>
                                                )}

                                            </div>
                                        )}

                                        {/* =================================================
                                            ASIGNAR ESPECIALISTA
                                        ================================================= */}

                                        {isPrimaryCareDoctor && (
                                            <div className="w-100 mt-3 pt-3 border-top border-secondary border-opacity-25">

                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <Icon name="Plus" />

                                                    <div>
                                                        <strong className="text-info d-block">
                                                            Asignar especialista
                                                        </strong>

                                                        <span className="text-white-50 small">
                                                            Añade un nuevo especialista a este paciente.
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-column flex-md-row gap-2">

                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        value={
                                                            selectedSpecialistByPatient[
                                                            patient.id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            setSelectedSpecialistByPatient(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [patient.id]:
                                                                        e.target.value,
                                                                })
                                                            )
                                                        }
                                                        disabled={
                                                            loadingSpecialists ||
                                                            assigningSpecialistId ===
                                                            patient.id
                                                        }
                                                    >
                                                        <option value="">
                                                            {loadingSpecialists
                                                                ? "Cargando especialistas..."
                                                                : "Seleccionar especialista"}
                                                        </option>

                                                        {specialists.map(
                                                            (specialist) => {

                                                                const specialtyName =
                                                                    typeof specialist.especialidad ===
                                                                        "string"
                                                                        ? specialist.especialidad
                                                                        : specialist
                                                                            .especialidad
                                                                            ?.nombre ||
                                                                        "Especialidad no disponible";

                                                                return (
                                                                    <option
                                                                        key={
                                                                            specialist.id
                                                                        }
                                                                        value={
                                                                            specialist.id
                                                                        }
                                                                    >
                                                                        {
                                                                            specialist.nombre
                                                                        }{" "}
                                                                        {
                                                                            specialist.apellidos
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            specialtyName
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        className="btn btn-info rounded-pill btn-sm fw-semibold text-nowrap"
                                                        onClick={() =>
                                                            assignSpecialist(
                                                                patient.id
                                                            )
                                                        }
                                                        disabled={
                                                            !selectedSpecialistByPatient[
                                                            patient.id
                                                            ] ||
                                                            assigningSpecialistId ===
                                                            patient.id ||
                                                            loadingSpecialists
                                                        }
                                                    >
                                                        {assigningSpecialistId ===
                                                            patient.id
                                                            ? "Asignando..."
                                                            : "Asignar"}
                                                    </button>

                                                </div>

                                            </div>
                                        )}

                                        {/* =================================================
                                            ELIMINAR PACIENTE
                                        ================================================= */}

                                        {isPrimaryCareDoctor && (
                                            <div className="mt-3">

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
                                                        : "Eliminar paciente"}
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

                {/* =====================================================
                    CONSULTAS PENDIENTES
                ===================================================== */}

                <div className="row g-4 mb-5">

                    <div className="col-12">

                        <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                                <div>
                                    <span className="text-warning text-uppercase small fw-semibold">
                                        Agenda médica
                                    </span>

                                    <h2 className="h4 fw-bold mb-0 mt-1">
                                        Consultas pendientes
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-warning rounded-pill btn-sm"
                                    onClick={loadConsultations}
                                    disabled={loadingConsultations}
                                >
                                    {loadingConsultations
                                        ? "Actualizando..."
                                        : "Actualizar"}
                                </button>

                            </div>

                            {consultationError && (
                                <div className="alert alert-danger">
                                    {consultationError}
                                </div>
                            )}

                            {loadingConsultations &&
                                consultations.length === 0 && (
                                    <div className="text-center py-4">

                                        <div
                                            className="spinner-border text-warning"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>

                                    </div>
                                )}

                            {!loadingConsultations &&
                                !consultationError &&
                                consultations.length === 0 && (
                                    <p className="text-white-50 mb-0">
                                        No tienes consultas pendientes.
                                    </p>
                                )}

                            {consultations.length > 0 && (
                                <div className="row g-3">

                                    {consultations.map(
                                        (consultation) => (
                                            <div
                                                className="col-12 col-md-6 col-xl-4"
                                                key={consultation.id}
                                            >

                                                <div className="border border-secondary border-opacity-50 rounded-3 p-3 h-100">

                                                    <div className="d-flex justify-content-between gap-2 mb-2">

                                                        <h3 className="h6 mb-0">
                                                            {
                                                                consultation.patient_name
                                                            }
                                                        </h3>

                                                        <span className="badge text-bg-warning">
                                                            {consultation.status ===
                                                                "confirmed"
                                                                ? "Confirmada"
                                                                : "Programada"}
                                                        </span>

                                                    </div>

                                                    <p className="text-white-50 small mb-2">
                                                        {
                                                            consultation.appointment_type
                                                        }{" "}
                                                        ·{" "}
                                                        {consultation.modality ===
                                                            "virtual"
                                                            ? "Virtual"
                                                            : "Presencial"}
                                                    </p>

                                                    <p className="text-white mb-2">
                                                        {consultation.scheduled_start
                                                            ? new Date(
                                                                consultation.scheduled_start
                                                            ).toLocaleString(
                                                                "es-ES",
                                                                {
                                                                    dateStyle:
                                                                        "medium",
                                                                    timeStyle:
                                                                        "short",
                                                                }
                                                            )
                                                            : "Fecha no disponible"}
                                                    </p>

                                                    {consultation.reason && (
                                                        <p className="text-white-50 small mb-0">
                                                            {
                                                                consultation.reason
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="d-flex flex-wrap gap-2 mt-3">

                                                        {consultation.modality ===
                                                            "virtual" && (
                                                                <Link
                                                                    to={`/teleconsulta/${consultation.id}`}
                                                                    className="btn btn-info rounded-pill btn-sm"
                                                                >
                                                                    Entrar en
                                                                    teleconsulta
                                                                </Link>
                                                            )}

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success rounded-pill btn-sm"
                                                            onClick={() =>
                                                                completeConsultation(
                                                                    consultation.id
                                                                )
                                                            }
                                                            disabled={
                                                                completingConsultationId ===
                                                                consultation.id
                                                            }
                                                        >
                                                            {completingConsultationId ===
                                                                consultation.id
                                                                ? "Completando..."
                                                                : "Marcar como completada"}
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    MENSAJES
                ===================================================== */}

                <div className="bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 mb-4">

                    <div className="d-flex align-items-center gap-2 mb-4">

                        <Icon name="MessageCircle" className="fs-4" size="1em" />

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

                {/* =====================================================
                    SEGURIDAD
                ===================================================== */}

                <div className="text-center border-top border-secondary border-opacity-25 mt-5 pt-4 pb-3">

                    <span className="text-white-50 small">
                        <Icon name="LockKeyhole" className="me-1" />Conexión cifrada SSL · Información sanitaria protegida
                    </span>

                </div>

            </div>
        </div>
    );
};