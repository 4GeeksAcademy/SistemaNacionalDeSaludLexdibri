
import React, { useState } from "react";
import JitsiCall from "../components/JitsiCall";

const Teleconsulta = () => {
    const [medicamentos, setMedicamentos] = useState([
        {
            medicamento: "",
            dosis: "",
            frecuencia: "",
            duracion: ""
        }
    ]);

    const agregarMedicamento = () => {
        setMedicamentos([
            ...medicamentos,
            {
                medicamento: "",
                dosis: "",
                frecuencia: "",
                duracion: ""
            }
        ]);
    };

    const eliminarMedicamento = (index) => {
        if (medicamentos.length === 1) return;

        setMedicamentos(
            medicamentos.filter((_, medicamentoIndex) => medicamentoIndex !== index)
        );
    };

    const actualizarMedicamento = (index, campo, valor) => {
        const nuevosMedicamentos = [...medicamentos];

        nuevosMedicamentos[index][campo] = valor;

        setMedicamentos(nuevosMedicamentos);
    };

    return (
        <div
            className="container-fluid min-vh-100 py-4"
            style={{
                backgroundColor: "#B2C9D1",
                color: "#1E5A9C"
            }}
        >

            {/* ================= CABECERA ================= */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <div
                        className="small fw-semibold mb-1"
                        style={{ color: "#1d5ed8" }}
                    >
                        ATENCIÓN MÉDICA · TELECONSULTA
                    </div>

                    <h2
                        className="fw-bold mb-1"
                        style={{
                            color: "#1E5A9C",
                            fontSize: "28px"
                        }}
                    >
                        Teleconsulta médica
                    </h2>

                    <p
                        className="mb-0"
                        style={{ color: "#3E8FD6" }}
                    >
                        Consulta médica online
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <div className="text-end d-none d-md-block">
                        <small
                            className="d-block"
                            style={{ color: "#3E8FD6" }}
                        >
                            Duración
                        </small>

                        <span
                            className="fw-bold"
                            style={{
                                color: "#1E5A9C",
                                fontSize: "17px"
                            }}
                        >
                            00:24:18
                        </span>
                    </div>

                    <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                            backgroundColor: "#BFE3FA",
                            color: "#1E5A9C",
                            border: "1px solid #7FC4F2",
                            fontWeight: "600"
                        }}
                    >
                        <span className="me-1">●</span>
                        Consulta en curso
                    </span>

                </div>
            </div>


            {/* ================= CONTENIDO PRINCIPAL ================= */}
            <div className="row g-4">



                {/* ================= VIDEOLLAMADA ================= */}
                <div className="col-12 col-lg-8">

                    <div
                        className="card h-100 shadow-sm"
                        style={{
                            backgroundColor: "#EAF6FF",
                            border: "1px solid #7FC4F2",
                            borderRadius: "14px",
                            overflow: "hidden"
                        }}
                    >

                        {/* HEADER VIDEOLLAMADA */}
                        <div
                            className="px-4 py-3 d-flex justify-content-between align-items-center"
                            style={{
                                backgroundColor: "#BFE3FA",
                                borderBottom: "1px solid #7FC4F2"
                            }}
                        >

                            <div>
                                <h6
                                    className="fw-bold mb-1"
                                    style={{ color: "#1E5A9C" }}
                                >
                                    Videoconsulta
                                </h6>

                                <small style={{ color: "#3E8FD6" }}>
                                    Conexión segura con el paciente
                                </small>
                            </div>

                            <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                    backgroundColor: "#EAF6FF",
                                    color: "#1E5A9C",
                                    border: "1px solid #7FC4F2"
                                }}
                            >
                                ● Conectado
                            </span>

                        </div>


                        {/* JITSI */}
                        <div
                            style={{
                                height: "650px",
                                padding: "8px",
                                backgroundColor: "#EAF6FF"
                            }}
                        >

                            <div
                                style={{
                                    height: "100%",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    backgroundColor: "#EAF6FF",
                                    border: "1px solid #7FC4F2"
                                }}
                            >
                                <JitsiCall />
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= PANEL CLÍNICO ================= */}
                <div className="col-12 col-lg-4">

                    <div
                        className="card shadow-sm"
                        style={{
                            backgroundColor: "#EAF6FF",
                            border: "1px solid #7FC4F2",
                            borderRadius: "14px",
                            overflow: "hidden"
                        }}
                    >

                        {/* HEADER PANEL */}
                        <div
                            className="px-4 py-3"
                            style={{
                                backgroundColor: "#BFE3FA",
                                color: "#1E5A9C",
                                borderBottom: "1px solid #7FC4F2"
                            }}
                        >

                            <h6 className="fw-bold mb-1">
                                Panel clínico
                            </h6>

                            <small style={{ color: "#3E8FD6" }}>
                                Información y registro de la consulta
                            </small>

                        </div>


                        <div
                            className="card-body p-4"
                            style={{
                                backgroundColor: "#EAF6FF"
                            }}
                        >


                            {/* ================= PACIENTE ================= */}
                            <div
                                className="p-3 mb-4"
                                style={{
                                    backgroundColor: "#BFE3FA",
                                    borderRadius: "10px",
                                    border: "1px solid #7FC4F2"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>
                                        <small
                                            className="d-block text-uppercase fw-semibold mb-1"
                                            style={{
                                                color: "#3E8FD6",
                                                fontSize: "11px"
                                            }}
                                        >
                                            Paciente
                                        </small>

                                        <div
                                            className="fw-bold"
                                            style={{
                                                color: "#1E5A9C",
                                                fontSize: "16px"
                                            }}
                                        >
                                            Nombre del paciente
                                        </div>
                                    </div>

                                    <span
                                        className="badge rounded-pill"
                                        style={{
                                            backgroundColor: "#EAF6FF",
                                            color: "#1E5A9C",
                                            border: "1px solid #7FC4F2"
                                        }}
                                    >
                                        Activo
                                    </span>

                                </div>

                                <div
                                    className="mt-2 small"
                                    style={{ color: "#3E8FD6" }}
                                >
                                    34 años · ID: PAC-00124
                                </div>

                            </div>


                            {/* ================= INFORMACIÓN CLÍNICA ================= */}
                            <div className="mb-4">

                                <div className="mb-3">

                                    <h6
                                        className="fw-bold mb-1"
                                        style={{ color: "#1E5A9C" }}
                                    >
                                        Información clínica
                                    </h6>

                                    <small style={{ color: "#3E8FD6" }}>
                                        Datos relevantes del paciente
                                    </small>

                                </div>


                                <div className="row g-2">

                                    <div className="col-6">
                                        <div
                                            className="p-2"
                                            style={{
                                                backgroundColor: "#BFE3FA",
                                                border: "1px solid #7FC4F2",
                                                borderRadius: "8px"
                                            }}
                                        >
                                            <small
                                                className="d-block"
                                                style={{ color: "#3E8FD6" }}
                                            >
                                                Motivo
                                            </small>

                                            <span
                                                className="small fw-semibold"
                                                style={{ color: "#1E5A9C" }}
                                            >
                                                Consulta general
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div
                                            className="p-2"
                                            style={{
                                                backgroundColor: "#BFE3FA",
                                                border: "1px solid #7FC4F2",
                                                borderRadius: "8px"
                                            }}
                                        >
                                            <small
                                                className="d-block"
                                                style={{ color: "#3E8FD6" }}
                                            >
                                                Alergias
                                            </small>

                                            <span
                                                className="small fw-semibold"
                                                style={{ color: "#1E5A9C" }}
                                            >
                                                No registradas
                                            </span>
                                        </div>
                                    </div>

                                </div>

                            </div>


                            {/* ================= NOTAS CLÍNICAS ================= */}
                            <div className="mb-4">

                                <div className="mb-3">

                                    <h6
                                        className="fw-bold mb-1"
                                        style={{ color: "#1E5A9C" }}
                                    >
                                        Notas clínicas
                                    </h6>

                                    <small style={{ color: "#3E8FD6" }}>
                                        Registra la evolución de la consulta
                                    </small>

                                </div>


                                <div className="mb-3">

                                    <label
                                        className="form-label small fw-semibold mb-1"
                                        style={{ color: "#1E5A9C" }}
                                    >
                                        Evolución
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Describe síntomas, exploración, evolución y observaciones..."
                                        style={{
                                            backgroundColor: "#EAF6FF",
                                            color: "#1E5A9C",
                                            borderRadius: "9px",
                                            border: "1px solid #7FC4F2",
                                            resize: "none"
                                        }}
                                    />

                                </div>


                                <div className="mb-3">

                                    <label
                                        className="form-label small fw-semibold mb-1"
                                        style={{ color: "#1E5A9C" }}
                                    >
                                        Diagnóstico
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Indica el diagnóstico"
                                        style={{
                                            backgroundColor: "#EAF6FF",
                                            color: "#163f6b",
                                            borderRadius: "9px",
                                            border: "1px solid #7FC4F2"
                                        }}
                                    />

                                </div>


                                <button
                                    className="btn w-100 fw-semibold"
                                    style={{
                                        backgroundColor: "#3E8FD6",
                                        color: "#EAF6FF",
                                        border: "1px solid #1E5A9C",
                                        borderRadius: "9px",
                                        padding: "10px"
                                    }}
                                >
                                    Guardar evolución
                                </button>

                            </div>


                            {/* SEPARADOR */}
                            <hr
                                style={{
                                    borderColor: "#7FC4F2",
                                    opacity: 1,
                                    margin: "24px 0"
                                }}
                            />


                            {/* ================= RECETA ================= */}
                            <div>

                                <div className="mb-3">

                                    <h6
                                        className="fw-bold mb-1"
                                        style={{ color: "#1E5A9C" }}
                                    >
                                        Receta médica
                                    </h6>

                                    <small style={{ color: "#3E8FD6" }}>
                                        Añade el tratamiento indicado
                                    </small>

                                </div>


                                {/* MEDICAMENTOS */}
                                {medicamentos.map((medicamento, index) => (

                                    <div
                                        key={index}
                                        className="p-3 mb-3"
                                        style={{
                                            backgroundColor: "#BFE3FA",
                                            border: "1px solid #7FC4F2",
                                            borderRadius: "10px"
                                        }}
                                    >

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <span
                                                className="small fw-bold"
                                                style={{ color: "#1E5A9C" }}
                                            >
                                                Medicamento {index + 1}
                                            </span>

                                            {medicamentos.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm"
                                                    onClick={() => eliminarMedicamento(index)}
                                                    style={{
                                                        backgroundColor: "#EAF6FF",
                                                        color: "#1E5A9C",
                                                        border: "1px solid #7FC4F2",
                                                        borderRadius: "7px"
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            )}

                                        </div>


                                        {/* MEDICAMENTO */}
                                        <div className="mb-3">

                                            <label
                                                className="form-label small fw-semibold"
                                                style={{ color: "#1E5A9C" }}
                                            >
                                                Medicamento
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={medicamento.medicamento}
                                                onChange={(e) =>
                                                    actualizarMedicamento(
                                                        index,
                                                        "medicamento",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nombre del medicamento"
                                                style={{
                                                    backgroundColor: "#EAF6FF",
                                                    color: "#1E5A9C",
                                                    borderRadius: "9px",
                                                    border: "1px solid #7FC4F2"
                                                }}
                                            />

                                        </div>


                                        {/* DOSIS + FRECUENCIA */}
                                        <div className="row">

                                            <div className="col-6 mb-3">

                                                <label
                                                    className="form-label small fw-semibold"
                                                    style={{ color: "#1E5A9C" }}
                                                >
                                                    Dosis
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={medicamento.dosis}
                                                    onChange={(e) =>
                                                        actualizarMedicamento(
                                                            index,
                                                            "dosis",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="500 mg"
                                                    style={{
                                                        backgroundColor: "#EAF6FF",
                                                        color: "#1E5A9C",
                                                        borderRadius: "9px",
                                                        border: "1px solid #7FC4F2"
                                                    }}
                                                />

                                            </div>


                                            <div className="col-6 mb-3">

                                                <label
                                                    className="form-label small fw-semibold"
                                                    style={{ color: "#1E5A9C" }}
                                                >
                                                    Frecuencia
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={medicamento.frecuencia}
                                                    onChange={(e) =>
                                                        actualizarMedicamento(
                                                            index,
                                                            "frecuencia",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Cada 8 h"
                                                    style={{
                                                        backgroundColor: "#EAF6FF",
                                                        color: "#1E5A9C",
                                                        borderRadius: "9px",
                                                        border: "1px solid #7FC4F2"
                                                    }}
                                                />

                                            </div>

                                        </div>


                                        {/* DURACIÓN */}
                                        <div>

                                            <label
                                                className="form-label small fw-semibold"
                                                style={{ color: "#1E5A9C" }}
                                            >
                                                Duración
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={medicamento.duracion}
                                                onChange={(e) =>
                                                    actualizarMedicamento(
                                                        index,
                                                        "duracion",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="7 días"
                                                style={{
                                                    backgroundColor: "#EAF6FF",
                                                    color: "#1E5A9C",
                                                    borderRadius: "9px",
                                                    border: "1px solid #7FC4F2"
                                                }}
                                            />

                                        </div>

                                    </div>

                                ))}


                                {/* AÑADIR MEDICAMENTO */}
                                <button
                                    type="button"
                                    className="btn w-100 mb-3 fw-semibold"
                                    onClick={agregarMedicamento}
                                    style={{
                                        backgroundColor: "#BFE3FA",
                                        color: "#1E5A9C",
                                        border: "1px solid #7FC4F2",
                                        borderRadius: "9px",
                                        padding: "10px"
                                    }}
                                >
                                    + Añadir medicamento
                                </button>


                                {/* ENVIAR RECETA */}
                                <button
                                    className="btn w-100 fw-semibold"
                                    style={{
                                        backgroundColor: "#3E8FD6",
                                        color: "#EAF6FF",
                                        border: "1px solid #1E5A9C",
                                        borderRadius: "9px",
                                        padding: "10px"
                                    }}
                                >
                                    Enviar receta
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= PIE DE CONSULTA ================= */}
            <div
                className="mt-4 p-3 d-flex justify-content-between align-items-center"
                style={{
                    backgroundColor: "#BFE3FA",
                    border: "1px solid #7FC4F2",
                    borderRadius: "12px"
                }}
            >

                <div>
                    <div
                        className="fw-bold"
                        style={{ color: "#1E5A9C" }}
                    >
                        Consulta en curso
                    </div>

                    <small style={{ color: "#3E8FD6" }}>
                        Comprueba que las notas y el tratamiento estén registrados antes de finalizar.
                    </small>
                </div>

                <button
                    className="btn fw-semibold"
                    style={{
                        backgroundColor: "#3E8FD6",
                        color: "#EAF6FF",
                        border: "1px solid #1E5A9C",
                        borderRadius: "9px",
                        padding: "10px 20px"
                    }}
                >
                    Finalizar consulta
                </button>

            </div>

        </div>
    );
};

export default Teleconsulta;

