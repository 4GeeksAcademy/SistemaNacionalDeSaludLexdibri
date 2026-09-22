import { useMemo, useState } from "react";

export const HistorialClinico = () => {
    // Datos de ejemplo del paciente
    // Más adelante se pueden sustituir por datos del backend.
    const paciente = {
        nombre: "María García López",
        id: "PAC-00124",
        edad: 42,
        sexo: "Mujer",
        nacimiento: "12/05/1984",
    };

    // Antecedentes médicos de ejemplo
    const antecedentes = [
        {
            id: 1,
            categoria: "Enfermedades",
            titulo: "Hipertensión arterial",
            descripcion: "Diagnóstico confirmado. Actualmente en seguimiento médico.",
            fecha: "2024-03-15",
            estado: "Activo",
            detalle: "Control periódico de la presión arterial.",
        },
        {
            id: 2,
            categoria: "Vacunas",
            titulo: "COVID-19",
            descripcion: "Dosis de refuerzo administrada.",
            fecha: "2022-11-08",
            estado: "Completada",
            detalle: "Vacuna Pfizer-BioNTech.",
        },
        {
            id: 3,
            categoria: "Cirugías",
            titulo: "Apendicectomía",
            descripcion: "Intervención quirúrgica por apendicitis aguda.",
            fecha: "2019-06-21",
            estado: "Completada",
            detalle: "Sin complicaciones postoperatorias.",
        },
        {
            id: 4,
            categoria: "Enfermedades",
            titulo: "Asma bronquial",
            descripcion: "Antecedente de asma diagnosticado durante la adolescencia.",
            fecha: "2017-02-10",
            estado: "Controlada",
            detalle: "Sin crisis recientes registradas.",
        },
        {
            id: 5,
            categoria: "Vacunas",
            titulo: "Gripe",
            descripcion: "Vacunación anual contra la gripe.",
            fecha: "2023-10-02",
            estado: "Completada",
            detalle: "Campaña de vacunación 2023.",
        },
        {
            id: 6,
            categoria: "Cirugías",
            titulo: "Extracción de muela del juicio",
            descripcion: "Extracción quirúrgica de tercer molar.",
            fecha: "2015-09-17",
            estado: "Completada",
            detalle: "Sin incidencias.",
        },
    ];

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
    const [orden, setOrden] = useState("recientes");

    // Filtrado + ordenación
    const antecedentesFiltrados = useMemo(() => {
        let resultado = [...antecedentes];

        // Filtrar por categoría
        if (categoriaSeleccionada !== "Todas") {
            resultado = resultado.filter(
                (antecedente) =>
                    antecedente.categoria === categoriaSeleccionada
            );
        }

        // Ordenar por fecha
        resultado.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);

            return orden === "recientes"
                ? fechaB - fechaA
                : fechaA - fechaB;
        });

        return resultado;
    }, [categoriaSeleccionada, orden]);

    // Formatear fechas
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Clase visual según categoría
    const obtenerColorCategoria = (categoria) => {
        switch (categoria) {
            case "Enfermedades":
                return "danger";

            case "Vacunas":
                return "success";

            case "Cirugías":
                return "primary";

            default:
                return "secondary";
        }
    };

    // Iniciales del paciente
    const iniciales = paciente.nombre
        .split(" ")
        .map((nombre) => nombre[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="container py-4 py-lg-5" style={{ backgroundColor: "#1E4B69" }}>
            {/* CABECERA */}
            <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="text-white">Área médica</span>
                    <span className="text-white">/</span>
                    <span className="fw-semibold">Historial clínico</span>
                </div>

                <h1 className="fw-bold mb-1">
                    Historial clínico
                </h1>

                <p className="text-white mb-0">
                    Consulta y gestión de los antecedentes médicos del paciente.
                </p>
            </div>

            {/* INFORMACIÓN DEL PACIENTE */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        {/* Avatar */}
                        <div className="col-auto">
                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    fontSize: "1.3rem",
                                }}
                            >
                                {iniciales}
                            </div>
                        </div>

                        {/* Datos principales */}
                        <div className="col">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <h3 className="fw-bold mb-0">
                                    {paciente.nombre}
                                </h3>

                                <span className="badge bg-light text-dark border">
                                    {paciente.id}
                                </span>
                            </div>

                            <div className="text-secondary mt-2">
                                {paciente.edad} años
                                <span className="mx-2">•</span>
                                {paciente.sexo}
                                <span className="mx-2">•</span>
                                Fecha de nacimiento: {paciente.nacimiento}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CABECERA DE ANTECEDENTES */}
            <div className="card border-0 shadow-sm" style={{ backgroundColor: "#51758b54", color: "#ffffff" }}>
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4" style={{ color: "#ffffff" }}>
                        <div>
                            <h2 className="h4 fw-bold mb-1">
                                Antecedentes clínicos
                            </h2>

                            <p className="text-light">
                                Filtra los antecedentes por categoría y
                                ordénalos por fecha.
                            </p>
                        </div>

                        {/* ORDEN */}
                        <div>
                            <label
                                htmlFor="orden"
                                className="form-label small fw-semibold mb-1"
                            >
                                Ordenar por
                            </label>

                            <select
                                id="orden"
                                className="form-select"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                            >
                                <option value="recientes">
                                    Más recientes
                                </option>

                                <option value="antiguos">
                                    Más antiguos
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* FILTROS */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {[
                            "Todas",
                            "Enfermedades",
                            "Vacunas",
                            "Cirugías",
                        ].map((categoria) => (
                            <button
                                key={categoria}
                                type="button"
                                className={`btn ${categoriaSeleccionada === categoria
                                        ? "btn-primary"
                                        : "btn-outline-secondary"
                                    }`}
                                onClick={() =>
                                    setCategoriaSeleccionada(categoria)
                                }
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>

                    {/* RESULTADOS */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-white small">
                            Mostrando{" "}
                            <strong>{antecedentesFiltrados.length}</strong>{" "}
                            antecedentes
                        </span>

                        {categoriaSeleccionada !== "Todas" && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none"
                                onClick={() =>
                                    setCategoriaSeleccionada("Todas")
                                }
                            >
                                Limpiar filtro
                            </button>
                        )}
                    </div>

                    {/* LISTADO */}
                    {antecedentesFiltrados.length > 0 ? (
                        <div >
                            {antecedentesFiltrados.map((antecedente) => (
                                <div style={{ color: "#ffffff" }}
                                    key={antecedente.id}
                                    className="border rounded-3 p-3 p-md-4 mb-3"
                                >
                                    <div className="row g-3">
                                        {/* FECHA */}
                                        <div className="col-md-3 col-lg-2">
                                            <div className="small">
                                                Fecha
                                            </div>

                                            <div className="fw-semibold mt-1">
                                                {formatearFecha(
                                                    antecedente.fecha
                                                )}
                                            </div>
                                        </div>

                                        {/* INFORMACIÓN */}
                                        <div className="col-md-9 col-lg-10">
                                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                                <span
                                                    className={`badge text-bg-${obtenerColorCategoria(
                                                        antecedente.categoria
                                                    )}`}
                                                >
                                                    {antecedente.categoria}
                                                </span>

                                                <span className="badge bg-light text-dark border">
                                                    {antecedente.estado}
                                                </span>
                                            </div>

                                            <h3 className="h5 fw-bold mb-2">
                                                {antecedente.titulo}
                                            </h3>

                                            <p className="text-white mb-2">
                                                {antecedente.descripcion}
                                            </p>

                                            <div className="small text-white">
                                                <strong>Detalle:</strong>{" "}
                                                {antecedente.detalle}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ESTADO SIN RESULTADOS */
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <span
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-secondary"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    —
                                </span>
                            </div>

                            <h3 className="h5 fw-bold">
                                No hay antecedentes registrados
                            </h3>

                            <p className="text-white mb-0">
                                No existen registros para la categoría
                                seleccionada.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};