import React, { useState, useEffect } from "react";
import { Icon } from "../components/Icon";

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

    // Agrupación estructurada por bloques sanitarios
    const categorias = [
        {
            nombre: "Atención General y Primaria",
            especialidades: [
                { icono: "Hospital", titulo: "Medicina Familiar y Comunitaria", desc: "Atención sanitaria integral y continuada para personas y familias.", servicios: "Prevención, seguimiento y coordinación asistencial." },
                { icono: "Stethoscope", titulo: "Medicina Interna", desc: "Atención integral de enfermedades que afectan a diferentes órganos y sistemas.", servicios: "Diagnóstico, seguimiento y coordinación de tratamientos." },
                { icono: "Baby", titulo: "Pediatría", desc: "Atención sanitaria especializada para niños y adolescentes.", servicios: "Desarrollo infantil, revisiones, prevención y seguimiento." },
                { icono: "PersonStanding", titulo: "Geriatría", desc: "Atención integral de las necesidades sanitarias de las personas mayores.", servicios: "Valoración geriátrica, prevención y seguimiento." },
                { icono: "Ambulance", titulo: "Medicina de Urgencias", desc: "Atención médica ante situaciones que requieren valoración inmediata.", servicios: "Valoración urgente, diagnóstico y estabilización." },
                { icono: "TestTube2", titulo: "Medicina Preventiva y Salud Pública", desc: "Promoción de la salud y prevención de enfermedades en la población.", servicios: "Prevención, vacunación, vigilancia y promoción de la salud." }
            ]
        },
        {
            nombre: "Especialidades Médicas y Órganos",
            especialidades: [
                { icono: "HeartPulse", titulo: "Cardiología", desc: "Prevención, diagnóstico y seguimiento de enfermedades del corazón.", servicios: "Pruebas cardiovasculares y valoración especializada." },
                { icono: "Brain", titulo: "Neurología", desc: "Diagnóstico de enfermedades del cerebro, médula y sistema nervioso.", servicios: "Valoración neurológica y pruebas diagnósticas." },
                { icono: "Lungs", titulo: "Neumología", desc: "Especialidad dedicada a las enfermedades del aparato respiratorio.", servicios: "Estudio respiratorio y pruebas funcionales." },
                { icono: "Utensils", titulo: "Gastroenterología", desc: "Atención de enfermedades del aparato digestivo.", servicios: "Estudio digestivo, endoscopias y seguimiento." },
                { icono: "Bean", titulo: "Nefrología", desc: "Prevención, diagnóstico y tratamiento de enfermedades renales.", servicios: "Función renal y tratamientos especializados." },
                { icono: "Droplet", titulo: "Hematología", desc: "Estudio y tratamiento de enfermedades de la sangre.", servicios: "Análisis y seguimiento hematológico." },
                { icono: "Dna", titulo: "Oncología", desc: "Prevención, diagnóstico y tratamiento de enfermedades oncológicas.", servicios: "Valoración especializada y seguimiento." },
                { icono: "ScanFace", titulo: "Dermatología", desc: "Prevención y tratamiento de enfermedades de la piel, cabello y uñas.", servicios: "Revisiones dermatológicas y tratamientos." },
                { icono: "Scale", titulo: "Endocrinología y Nutrición", desc: "Atención de alteraciones hormonales, metabólicas y nutricionales.", servicios: "Diabetes, tiroides, metabolismo y valoración nutricional." },
                { icono: "Bone", titulo: "Reumatología", desc: "Diagnóstico y tratamiento de enfermedades reumáticas.", servicios: "Valoración articular y tratamientos." },
                { icono: "Leaf", titulo: "Alergología", desc: "Diagnóstico de alergias y respuestas de hipersensibilidad.", servicios: "Pruebas de alergia y seguimiento." },
                { icono: "ShieldCheck", titulo: "Inmunología", desc: "Estudio de alteraciones del sistema inmunitario.", servicios: "Estudios inmunológicos especializados." },
                { icono: "Bug", titulo: "Enfermedades Infecciosas", desc: "Prevención y tratamiento de enfermedades infecciosas.", servicios: "Diagnóstico y seguimiento de infecciones." }
            ]
        },
        {
            nombre: "Cirugía y Procedimientos",
            especialidades: [
                { icono: "Scissors", titulo: "Cirugía General", desc: "Tratamiento quirúrgico de diferentes patologías y procesos.", servicios: "Procedimientos quirúrgicos y seguimiento." },
                { icono: "Heart", titulo: "Cirugía Cardiovascular", desc: "Tratamiento quirúrgico de enfermedades del corazón y grandes vasos.", servicios: "Valoración quirúrgica e intervención." },
                { icono: "Lungs", titulo: "Cirugía Torácica", desc: "Tratamiento quirúrgico de enfermedades del tórax.", servicios: "Valoración e intervención quirúrgica." },
                { icono: "Bone", titulo: "Traumatología", desc: "Atención de lesiones y alteraciones del aparato locomotor.", servicios: "Lesiones, fracturas y postquirúrgico." },
                { icono: "Eye", titulo: "Oftalmología", desc: "Prevención y tratamiento quirúrgico/médico de la visión.", servicios: "Revisiones visuales y cirugía ocular." },
                { icono: "Syringe", titulo: "Anestesiología", desc: "Atención relacionada con la anestesia y procedimientos quirúrgicos.", servicios: "Valoración preoperatoria y control." }
            ]
        },
        {
            nombre: "Salud Específica, Salud Mental y Diagnóstico",
            especialidades: [
                { icono: "Baby", titulo: "Ginecología y Obstetricia", desc: "Atención integral de la salud reproductiva y del embarazo.", servicios: "Revisiones, embarazo y prevención." },
                { icono: "Droplets", titulo: "Urología", desc: "Enfermedades del aparato urinario y reproductor masculino.", servicios: "Diagnóstico y tratamientos urológicos." },
                { icono: "UserRound", titulo: "Andrología", desc: "Salud reproductiva y sexual masculina.", servicios: "Valoración reproductiva especializada." },
                { icono: "Tooth", titulo: "Odontología", desc: "Prevención y atención de la salud bucodental.", servicios: "Revisiones y tratamientos odontológicos." },
                { icono: "Brain", titulo: "Psiquiatría", desc: "Atención especializada de trastornos de la salud mental.", servicios: "Valoración, tratamiento y seguimiento." },
                { icono: "MessageCircle", titulo: "Psicología Clínica", desc: "Evaluación y atención psicológica sanitaria.", servicios: "Evaluación e intervención psicológica." },
                { icono: "PersonStanding", titulo: "Medicina Física y Rehabilitación", desc: "Recuperación funcional tras lesiones o cirugías.", servicios: "Rehabilitación y recuperación funcional." },
                { icono: "ScanLine", titulo: "Radiología", desc: "Obtención de imágenes médicas para el diagnóstico.", servicios: "Radiografías, ecografías y TAC." },
                { icono: "Microscope", titulo: "Anatomía Patológica", desc: "Estudio de tejidos y muestras biológicas.", servicios: "Biopsias, citologías y estudios." },
                { icono: "Atom", titulo: "Medicina Nuclear", desc: "Técnicas con radiofármacos para diagnóstico.", servicios: "Pruebas funcionales y tratamientos." },
                { icono: "Pill", titulo: "Farmacología Clínica", desc: "Uso seguro y adecuado de medicamentos.", servicios: "Optimización de tratamientos." }
            ]
        }
    ];

    return (
        <div className="especialidades-page py-4">
            {/* HERO */}
            <section className="container py-4 text-center">
                <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 mb-3">
                    Sistema Nacional de Salud
                </span>
                <h1 className="display-5 fw-bold text-white mb-3">
                    Especialidades <span className="text-info">Médicas</span>
                </h1>
                <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: "650px" }}>
                    Consulta las distintas áreas asistenciales agrupadas por categorías o usa la búsqueda rápida.
                </p>

                {/* BUSCADOR */}
                <div className="row justify-content-center mb-4">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="input-group input-group-lg bg-dark rounded-3 border border-secondary border-opacity-50">
                            <span className="input-group-text bg-transparent border-0 text-white-50"><Icon name="Search" /></span>
                            <input
                                type="text"
                                className="form-control bg-transparent border-0 text-white shadow-none"
                                placeholder="Buscar especialidad (ej. Cardiología, Pediatría)..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN PRINCIPAL: ACORDEÓN */}
            <section className="container py-3">
                <div className="accordion" id="accordionEspecialidades">
                    {categorias.map((cat, idx) => {
                        const especialidadesFiltradas = cat.especialidades.filter(esp =>
                            esp.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            esp.desc.toLowerCase().includes(busqueda.toLowerCase())
                        );

                        if (busqueda && especialidadesFiltradas.length === 0) return null;

                        return (
                            <div className="accordion-item bg-dark bg-opacity-75 border border-secondary border-opacity-50 mb-3 rounded-3 overflow-hidden shadow-sm" key={idx}>
                                <h2 className="accordion-header" id={`heading-${idx}`}>
                                    <button
                                        className="accordion-button bg-dark text-white fw-bold shadow-none p-3"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${idx}`}
                                        aria-expanded={idx === 0 || busqueda ? "true" : "false"}
                                    >
                                        <div className="d-flex align-items-center justify-content-between w-100 me-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-info">●</span>
                                                <span>{cat.nombre}</span>
                                            </div>
                                            <span className="badge bg-secondary bg-opacity-50 rounded-pill px-3 py-2 fw-normal">
                                                {especialidadesFiltradas.length}
                                            </span>
                                        </div>
                                    </button>
                                </h2>

                                <div
                                    id={`collapse-${idx}`}
                                    className={`accordion-collapse collapse ${idx === 0 || busqueda ? "show" : ""}`}
                                >
                                    <div className="accordion-body bg-dark bg-opacity-50">
                                        <div className="list-group list-group-flush">
                                            {especialidadesFiltradas.map((esp, i) => (
                                                <div key={i} className="list-group-item bg-transparent text-white border-secondary border-opacity-25 py-3">
                                                    <div className="d-flex align-items-start gap-3">
                                                        <Icon name={esp.icono} className="fs-3 text-info flex-shrink-0" size="1em" />
                                                        <div className="w-100">
                                                            <h5 className="mb-1 text-info fw-bold">{esp.titulo}</h5>
                                                            <p className="text-white-50 mb-2 small">{esp.desc}</p>
                                                            <div className="p-2 rounded bg-black bg-opacity-25 border border-secondary border-opacity-25">
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

                {/* MENSAJE DE INFORMACIÓN */}
                <div className="alert bg-info bg-opacity-10 border border-info border-opacity-25 text-white rounded-4 p-4 mt-5">
                    <div className="d-flex gap-3 align-items-center">
                        <Icon name="Info" className="text-info fs-3" size="1em" />
                        <div>
                            <h3 className="h6 fw-bold mb-1">Acceso identificado a la historia clínica</h3>
                            <p className="text-white-50 small mb-0">
                                Inicia sesión para consultar citas programadas, solicitar tratamientos o revisar informes médicos vinculados a tu perfil.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};