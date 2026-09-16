import React, { useState, useEffect } from "react";

export const Especialidades = () => {
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const elements = document.querySelectorAll(".scroll-reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible");
                    else entry.target.classList.remove("visible");
                });
            },
            { threshold: 0.2 }
        );
        elements.forEach((element) => observer.observe(element));
        return () => elements.forEach((element) => observer.unobserve(element));
    }, []);

    // Agrupación lógica por categorías sanitarias
    const categorias = [
        {
            nombre: "Atención General y Primaria",
            especialidades: [
                { icono: "🏥", titulo: "Medicina Familiar y Comunitaria", desc: "Atención sanitaria integral y continuada para personas y familias.", servicios: "Prevención, seguimiento y coordinación asistencial." },
                { icono: "🩺", titulo: "Medicina Interna", desc: "Atención integral de enfermedades que afectan a diferentes órganos y sistemas.", servicios: "Diagnóstico, seguimiento y coordinación de tratamientos." },
                { icono: "🚑", titulo: "Medicina de Urgencias", desc: "Atención médica ante situaciones que requieren valoración inmediata.", servicios: "Valoración urgente, diagnóstico y estabilización." },
                { icono: "🧪", titulo: "Medicina Preventiva y Salud Pública", desc: "Promoción de la salud y prevención de enfermedades en la población.", servicios: "Prevención, vacunación, vigilancia y promoción de la salud." }
            ]
        },
        {
            nombre: "Especialidades Médicas y Órganos",
            especialidades: [
                { icono: "❤️", titulo: "Cardiología", desc: "Prevención, diagnóstico y seguimiento de enfermedades del corazón.", servicios: "Pruebas cardiovasculares y valoración especializada." },
                { icono: "🧠", titulo: "Neurología", desc: "Diagnóstico de enfermedades del cerebro, médula y sistema nervioso.", servicios: "Valoración neurológica y pruebas diagnósticas." },
                { icono: "🫁", titulo: "Neumología", desc: "Especialidad dedicada a las enfermedades del aparato respiratorio.", servicios: "Estudio respiratorio y pruebas funcionales." },
                { icono: "🫃", titulo: "Gastroenterología", desc: "Atención de enfermedades del aparato digestivo.", servicios: "Estudio digestivo, endoscopias y seguimiento." },
                { icono: "🫘", titulo: "Nefrología", desc: "Prevención, diagnóstico y tratamiento de enfermedades renales.", servicios: "Función renal y tratamientos especializados." },
                { icono: "🩸", titulo: "Hematología", desc: "Estudio y tratamiento de enfermedades de la sangre.", servicios: "Análisis y seguimiento hematológico." },
                { icono: "🧬", titulo: "Oncología", desc: "Prevención, diagnóstico y tratamiento de enfermedades oncológicas.", servicios: "Valoración especializada y seguimiento." }
            ]
        },
        {
            nombre: "Cirugía y Procedimientos",
            especialidades: [
                { icono: "⚕️", titulo: "Cirugía General", desc: "Tratamiento quirúrgico de diferentes patologías y procesos.", servicios: "Procedimientos quirúrgicos y seguimiento." },
                { icono: "🫀", titulo: "Cirugía Cardiovascular", desc: "Tratamiento quirúrgico de enfermedades del corazón y grandes vasos.", servicios: "Valoración quirúrgica e intervención." },
                { icono: "🫁", titulo: "Cirugía Torácica", desc: "Tratamiento quirúrgico de enfermedades del tórax.", servicios: "Valoración e intervención quirúrgica." },
                { icono: "🦴", titulo: "Traumatología", desc: "Atención de lesiones y alteraciones del aparato locomotor.", servicios: "Lesiones, fracturas y postquirúrgico." },
                { icono: "💉", titulo: "Anestesiología", desc: "Atención relacionada con la anestesia y procedimientos quirúrgicos.", servicios: "Valoración preoperatoria y control." }
            ]
        },
        {
            nombre: "Diagnóstico y Laboratorio",
            especialidades: [
                { icono: "🩻", titulo: "Radiología", desc: "Obtención de imágenes médicas para el diagnóstico.", servicios: "Radiografías, ecografías y TAC." },
                { icono: "🔬", titulo: "Anatomía Patológica", desc: "Estudio de tejidos y muestras biológicas.", servicios: "Biopsias, citologías y estudios." },
                { icono: "☢️", titulo: "Medicina Nuclear", desc: "Uso de técnicas con radiofármacos.", servicios: "Pruebas funcionales y diagnósticos." },
                { icono: "💊", titulo: "Farmacología Clínica", desc: "Uso seguro y adecuado de los medicamentos.", servicios: "Optimización de tratamientos." }
            ]
        }
    ];

    return (
        <div className="especialidades-page">
            {/* HERO */}
            <section className="especialidades-hero py-5">
                <div className="container text-center text-md-start">
                    <span className="especialidades-badge">Sistema nacional de salud LEXDIBRI</span>
                    <h1 className="display-4 fw-bold mt-3 mb-3 text-white">
                        Especialidades <span className="text-info">Médicas</span>
                    </h1>
                    <p className="lead text-white-50 mb-4">
                        Consulta nuestro catálogo estructurado de áreas de atención sanitaria.
                    </p>

                    {/* BARRA DE BÚSQUEDA RÁPIDA */}
                    <div className="col-lg-6">
                        <input
                            type="text"
                            className="form-control form-control-lg bg-dark text-white border-secondary"
                            placeholder="🔍 Buscar especialidad (ej. Cardiología)..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* VISTA EN ACORDEÓN / LISTA */}
            <section className="especialidades-content py-5">
                <div className="container">
                    <div className="accordion" id="accordionEspecialidades">
                        {categorias.map((cat, idx) => {
                            // Filtrado dinámico por búsqueda
                            const especialidadesFiltradas = cat.especialidades.filter(esp =>
                                esp.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                                esp.desc.toLowerCase().includes(busqueda.toLowerCase())
                            );

                            if (busqueda && especialidadesFiltradas.length === 0) return null;

                            return (
                                <div className="accordion-item bg-dark border-secondary mb-3 rounded-3 overflow-hidden" key={idx}>
                                    <h2 className="accordion-header" id={`heading-${idx}`}>
                                        <button
                                            className="accordion-button bg-dark text-white fw-bold shadow-none p-3"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${idx}`}
                                            aria-expanded={idx === 0 || busqueda ? "true" : "false"}
                                        >
                                            {/* Contenedor principal alineado con flexbox */}
                                            <div className="d-flex align-items-center justify-content-between w-100 me-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-info">●</span>
                                                    <span>{cat.nombre}</span>
                                                </div>
                                                
                                                <span className="badge bg-secondary rounded-pill px-3 py-2 fw-normal">
                                                    {especialidadesFiltradas.length}
                                                </span>
                                            </div>
                                        </button>
                                    </h2>

                                    <div
                                        id={`collapse-${idx}`}
                                        className={`accordion-collapse collapse ${idx === 0 || busqueda ? "show" : ""}`}
                                    >
                                        <div className="accordion-body bg-dark bg-opacity-75">
                                            <div className="list-group list-group-flush">
                                                {especialidadesFiltradas.map((esp, i) => (
                                                    <div key={i} className="list-group-item bg-transparent text-white border-secondary border-opacity-25 py-3">
                                                        <div className="d-flex align-items-start gap-3">
                                                            <span className="fs-3">{esp.icono}</span>
                                                            <div className="w-100">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h5 className="mb-1 text-info fw-bold">{esp.titulo}</h5>
                                                                </div>
                                                                <p className="text-white-50 mb-1 small">{esp.desc}</p>

                                                                <div className="mt-2 p-2 rounded bg-black bg-opacity-25 border border-secondary border-opacity-25">
                                                                    <small className="text-info fw-semibold">Servicios: </small>
                                                                    <small className="text-white-50">{esp.servicios}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};