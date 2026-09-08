import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

// NOTA: Todo el estado (pacientes, recetas, mensajes) vive en memoria con useState.
// No hay llamadas a backend todavía; cuando lo conectes, sustituye los setState
// por tus fetch/axios y carga los datos iniciales desde la API.

export const DashboardMedico = () => {
    const { store } = useGlobalReducer();
    const user = store.user;
    const profileImage = user?.profile_image || rigoImageUrl;

    // ---------------- PACIENTES ----------------
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: "Ana Torres",
            weight: "68",
            pressure: "118/76",
            height: "165",
            illness: "Asma",
        },
        {
            id: 2,
            name: "Luis Gómez",
            weight: "82",
            pressure: "130/85",
            height: "178",
            illness: "Hipertensión",
        },
    ]);

    const [newPatient, setNewPatient] = useState({
        name: "",
        weight: "",
        pressure: "",
        height: "",
        illness: "",
    });

    const handleNewPatientChange = (field, value) => {
        setNewPatient((prev) => ({ ...prev, [field]: value }));
    };

    const addPatient = () => {
        if (!newPatient.name.trim()) return;
        setPatients((prev) => [...prev, { id: Date.now(), ...newPatient }]);
        setNewPatient({ name: "", weight: "", pressure: "", height: "", illness: "" });
    };

    const removePatient = (id) => {
        setPatients((prev) => prev.filter((p) => p.id !== id));
    };

    const updatePatientField = (id, field, value) => {
        setPatients((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    // ---------------- RECETAS ----------------
    const [prescriptions, setPrescriptions] = useState([]);
    const [newPrescription, setNewPrescription] = useState({
        patientId: "",
        medication: "",
        dosage: "",
        instructions: "",
    });

    const handleNewPrescriptionChange = (field, value) => {
        setNewPrescription((prev) => ({ ...prev, [field]: value }));
    };

    const addPrescription = () => {
        if (!newPrescription.patientId || !newPrescription.medication.trim()) return;
        setPrescriptions((prev) => [...prev, { id: Date.now(), ...newPrescription }]);
        setNewPrescription({ patientId: "", medication: "", dosage: "", instructions: "" });
    };

    const removePrescription = (id) => {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    };

    const getPatientName = (id) => {
        const found = patients.find((p) => String(p.id) === String(id));
        return found ? found.name : "Paciente eliminado";
    };

    // ---------------- MENSAJES ----------------
    const [messageTab, setMessageTab] = useState("todos");

    const messages = [
        { id: 1, from: "Ana Torres", type: "paciente", text: "¿Puedo tomar el ibuprofeno con el desayuno?" },
        { id: 2, from: "Dra. Martínez", type: "colega", text: "¿Revisamos juntos el caso de Luis Gómez?" },
        { id: 3, from: "Luis Gómez", type: "paciente", text: "Ya agendé la cita de control, gracias." },
        { id: 4, from: "Dr. Salinas", type: "colega", text: "Te paso el resultado de la interconsulta." },
    ];

    const filteredMessages = messages.filter((m) => {
        if (messageTab === "todos") return true;
        if (messageTab === "pacientes") return m.type === "paciente";
        return m.type === "colega";
    });

    return (
        <div className="dashboard-medico-page">

            {/* ESTILOS */}
            <style>{`
        .dashboard-paciente-profile-image {
          width: 64px;
          height: 64px;
          min-width: 64px;
          min-height: 64px;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          display: block;
        }

        .dashboard-paciente-main-row {
          align-items: stretch;
        }

        .col-12.col-lg-8 {
          display: flex;
        }

        .dashboard-paciente-cards-row {
          width: 100%;
          align-content: space-between;
        }

        .dashboard-medico-card {
          padding: 1.5rem;
        }

        .dashboard-medico-patient-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1rem 0;
        }

        .dashboard-medico-patient-row {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
        }

        .dashboard-medico-patient-name {
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }

        .dashboard-medico-patient-name span {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .dashboard-medico-patient-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          flex: 1;
        }

        .dashboard-medico-patient-fields label {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          gap: 0.25rem;
        }

        .dashboard-medico-patient-fields input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: #fff;
          width: 100px;
          font-size: 0.85rem;
        }

        .dashboard-medico-remove-button {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.4);
          border-radius: 8px;
          padding: 0.4rem 0.9rem;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .dashboard-medico-remove-button:hover {
          background: rgba(244, 63, 94, 0.3);
        }

        .dashboard-medico-add-form {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        .dashboard-medico-add-form h4 {
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .dashboard-medico-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .dashboard-medico-form-grid input,
        .dashboard-medico-form-grid select {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          color: #fff;
          font-size: 0.85rem;
        }

        .dashboard-medico-form-grid select option {
          color: #000;
        }

        .dashboard-medico-prescription-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .dashboard-medico-prescription-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .dashboard-medico-prescription-item p {
          margin: 0.25rem 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .dashboard-medico-instructions {
          font-style: italic;
        }

        .dashboard-medico-empty {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }

        .dashboard-medico-message-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .dashboard-medico-message-tabs button {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          padding: 0.3rem 0.8rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .dashboard-medico-message-tabs button.active {
          background: #22d3ee;
          color: #04202a;
          border-color: #22d3ee;
          font-weight: 600;
        }

        .dashboard-medico-message-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
          max-height: 220px;
          overflow-y: auto;
        }
      `}</style>

            {/* DASHBOARD */}
            <section className="dashboard-paciente-section">
                <div className="container">

                    {/* BIENVENIDA */}
                    <div className="dashboard-paciente-welcome glass-card">

                        <div className="dashboard-paciente-user">

                            <img
                                src={profileImage}
                                alt="Foto de perfil"
                                className="dashboard-paciente-profile-image"
                            />

                            <div>
                                <span className="dashboard-paciente-eyebrow">
                                    Área médica
                                </span>

                                <h2>
                                    Hola, Dr(a). {user?.first_name || "Doctor"} 👋
                                </h2>

                                <p>
                                    Gestiona tus pacientes, recetas y mensajes desde un solo lugar.
                                </p>
                            </div>

                        </div>

                        <div className="dashboard-paciente-status">
                            <span></span>
                            Cuenta activa
                        </div>

                    </div>

                    <div className="row g-4 dashboard-paciente-main-row">

                        {/* COLUMNA PRINCIPAL */}
                        <div className="col-12 col-lg-8">

                            <div className="row g-4 dashboard-paciente-cards-row">

                                {/* MIS PACIENTES */}
                                <div className="col-12">
                                    <div className="dashboard-medico-card glass-card">

                                        <div className="dashboard-paciente-card-header">
                                            <div className="dashboard-paciente-card-icon">
                                                🩺
                                            </div>
                                            <span className="dashboard-paciente-card-label">
                                                Gestión
                                            </span>
                                        </div>

                                        <h3>Mis pacientes</h3>

                                        <div className="dashboard-medico-patient-list">

                                            {patients.length === 0 && (
                                                <p className="dashboard-medico-empty">
                                                    Aún no tienes pacientes asignados.
                                                </p>
                                            )}

                                            {patients.map((p) => (
                                                <div className="dashboard-medico-patient-row" key={p.id}>

                                                    <div className="dashboard-medico-patient-name">
                                                        <strong>{p.name}</strong>
                                                        <span>{p.illness || "Sin diagnóstico"}</span>
                                                    </div>

                                                    <div className="dashboard-medico-patient-fields">
                                                        <label>
                                                            Peso (kg)
                                                            <input
                                                                type="text"
                                                                value={p.weight}
                                                                onChange={(e) => updatePatientField(p.id, "weight", e.target.value)}
                                                            />
                                                        </label>

                                                        <label>
                                                            Presión
                                                            <input
                                                                type="text"
                                                                value={p.pressure}
                                                                onChange={(e) => updatePatientField(p.id, "pressure", e.target.value)}
                                                            />
                                                        </label>

                                                        <label>
                                                            Estatura (cm)
                                                            <input
                                                                type="text"
                                                                value={p.height}
                                                                onChange={(e) => updatePatientField(p.id, "height", e.target.value)}
                                                            />
                                                        </label>

                                                        <label>
                                                            Enfermedad
                                                            <input
                                                                type="text"
                                                                value={p.illness}
                                                                onChange={(e) => updatePatientField(p.id, "illness", e.target.value)}
                                                            />
                                                        </label>
                                                    </div>

                                                    <button
                                                        className="dashboard-medico-remove-button"
                                                        onClick={() => removePatient(p.id)}
                                                    >
                                                        Quitar
                                                    </button>

                                                </div>
                                            ))}

                                        </div>

                                        {/* AGREGAR PACIENTE */}
                                        <div className="dashboard-medico-add-form">
                                            <h4>Agregar paciente</h4>

                                            <div className="dashboard-medico-form-grid">
                                                <input
                                                    placeholder="Nombre"
                                                    value={newPatient.name}
                                                    onChange={(e) => handleNewPatientChange("name", e.target.value)}
                                                />
                                                <input
                                                    placeholder="Peso (kg)"
                                                    value={newPatient.weight}
                                                    onChange={(e) => handleNewPatientChange("weight", e.target.value)}
                                                />
                                                <input
                                                    placeholder="Presión arterial"
                                                    value={newPatient.pressure}
                                                    onChange={(e) => handleNewPatientChange("pressure", e.target.value)}
                                                />
                                                <input
                                                    placeholder="Estatura (cm)"
                                                    value={newPatient.height}
                                                    onChange={(e) => handleNewPatientChange("height", e.target.value)}
                                                />
                                                <input
                                                    placeholder="Enfermedad"
                                                    value={newPatient.illness}
                                                    onChange={(e) => handleNewPatientChange("illness", e.target.value)}
                                                />
                                            </div>

                                            <button className="dashboard-paciente-button" onClick={addPatient}>
                                                Agregar paciente
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                {/* CREAR RECETA */}
                                <div className="col-12 col-md-6">
                                    <div className="dashboard-medico-card glass-card">

                                        <div className="dashboard-paciente-card-header">
                                            <div className="dashboard-paciente-card-icon">
                                                📝
                                            </div>
                                            <span className="dashboard-paciente-card-label">
                                                Tratamiento
                                            </span>
                                        </div>

                                        <h3>Crear receta</h3>

                                        <div className="dashboard-medico-form-grid">
                                            <select
                                                value={newPrescription.patientId}
                                                onChange={(e) => handleNewPrescriptionChange("patientId", e.target.value)}
                                            >
                                                <option value="">Selecciona paciente</option>
                                                {patients.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>

                                            <input
                                                placeholder="Medicamento"
                                                value={newPrescription.medication}
                                                onChange={(e) => handleNewPrescriptionChange("medication", e.target.value)}
                                            />
                                            <input
                                                placeholder="Dosis"
                                                value={newPrescription.dosage}
                                                onChange={(e) => handleNewPrescriptionChange("dosage", e.target.value)}
                                            />
                                            <input
                                                placeholder="Indicaciones"
                                                value={newPrescription.instructions}
                                                onChange={(e) => handleNewPrescriptionChange("instructions", e.target.value)}
                                            />
                                        </div>

                                        <button className="dashboard-paciente-button" onClick={addPrescription}>
                                            Crear receta
                                        </button>

                                    </div>
                                </div>

                                {/* RECETAS EMITIDAS */}
                                <div className="col-12 col-md-6">
                                    <div className="dashboard-medico-card glass-card">

                                        <div className="dashboard-paciente-card-header">
                                            <div className="dashboard-paciente-card-icon">
                                                📋
                                            </div>
                                            <span className="dashboard-paciente-card-label">
                                                Historial
                                            </span>
                                        </div>

                                        <h3>Recetas emitidas</h3>

                                        <div className="dashboard-medico-prescription-list">

                                            {prescriptions.length === 0 && (
                                                <p className="dashboard-medico-empty">
                                                    Todavía no has creado recetas.
                                                </p>
                                            )}

                                            {prescriptions.map((rx) => (
                                                <div className="dashboard-medico-prescription-item" key={rx.id}>
                                                    <div>
                                                        <strong>{rx.medication}</strong>
                                                        <span> · {getPatientName(rx.patientId)}</span>
                                                        {rx.dosage && <p>{rx.dosage}</p>}
                                                        {rx.instructions && (
                                                            <p className="dashboard-medico-instructions">{rx.instructions}</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        className="dashboard-medico-remove-button"
                                                        onClick={() => removePrescription(rx.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}

                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* COLUMNA LATERAL */}
                        <div className="col-12 col-lg-4">

                            <div className="dashboard-paciente-sidebar">

                                {/* RESUMEN */}
                                <div className="dashboard-paciente-widget glass-card">

                                    <div className="dashboard-paciente-widget-header">
                                        <h3>Resumen</h3>
                                        <span>📊</span>
                                    </div>

                                    <div className="dashboard-paciente-health-list">

                                        <div>
                                            <span>Pacientes activos</span>
                                            <strong>{patients.length}</strong>
                                        </div>

                                        <div>
                                            <span>Recetas emitidas</span>
                                            <strong>{prescriptions.length}</strong>
                                        </div>

                                        <div>
                                            <span>Citas de hoy</span>
                                            <strong>3</strong>
                                        </div>

                                    </div>

                                </div>

                                {/* NOTIFICACIONES */}
                                <div className="dashboard-paciente-widget glass-card">

                                    <div className="dashboard-paciente-widget-header">
                                        <h3>Notificaciones</h3>
                                        <span>🔔</span>
                                    </div>

                                    <div className="dashboard-paciente-notifications">

                                        <div>
                                            <span>📅</span>
                                            <p>
                                                Cita con Ana Torres en 30 min
                                            </p>
                                        </div>

                                        <div>
                                            <span>🧪</span>
                                            <p>
                                                Resultado de laboratorio disponible
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* MENSAJES (pacientes + colegas médicos) */}
                                <div className="dashboard-paciente-widget glass-card">

                                    <div className="dashboard-paciente-widget-header">
                                        <h3>Mensajes</h3>
                                        <span>💬</span>
                                    </div>

                                    <div className="dashboard-medico-message-tabs">
                                        <button
                                            className={messageTab === "todos" ? "active" : ""}
                                            onClick={() => setMessageTab("todos")}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            className={messageTab === "pacientes" ? "active" : ""}
                                            onClick={() => setMessageTab("pacientes")}
                                        >
                                            Pacientes
                                        </button>
                                        <button
                                            className={messageTab === "colegas" ? "active" : ""}
                                            onClick={() => setMessageTab("colegas")}
                                        >
                                            Colegas
                                        </button>
                                    </div>

                                    <div className="dashboard-medico-message-list">
                                        {filteredMessages.map((m) => (
                                            <div className="dashboard-paciente-message" key={m.id}>
                                                <div className="dashboard-paciente-message-icon">
                                                    {m.type === "paciente" ? "🧑" : "👨‍⚕️"}
                                                </div>
                                                <div>
                                                    <strong>{m.from}</strong>
                                                    <p>"{m.text}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="dashboard-paciente-button">
                                        Ver mensajes
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* SEGURIDAD */}
                    <div className="dashboard-paciente-security">
                        <span>🔒</span>
                        Conexión cifrada SSL · Información sanitaria protegida
                    </div>

                </div>
            </section>

        </div>
    );
};