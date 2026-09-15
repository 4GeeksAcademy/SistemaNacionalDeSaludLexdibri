import React, { useEffect } from "react";

export const Especialidades = () => {
    useEffect(() => {
        const elements = document.querySelectorAll(".scroll-reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    } else {
                        entry.target.classList.remove("visible");
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            elements.forEach((element) => observer.unobserve(element));
        };
    }, []);

    const especialidades = [
        {
            icono: "❤️",
            titulo: "Cardiología",
            desc: "Prevención, diagnóstico y seguimiento de enfermedades del corazón y del sistema cardiovascular.",
            servicios: "Pruebas cardiovasculares, seguimiento y valoración especializada."
        },
        {
            icono: "👶",
            titulo: "Pediatría",
            desc: "Atención sanitaria especializada para niños y adolescentes.",
            servicios: "Desarrollo infantil, revisiones, prevención y seguimiento."
        },
        {
            icono: "🧠",
            titulo: "Neurología",
            desc: "Diagnóstico y seguimiento de enfermedades del cerebro, médula y sistema nervioso.",
            servicios: "Valoración neurológica, seguimiento y pruebas diagnósticas."
        },
        {
            icono: "👁️",
            titulo: "Oftalmología",
            desc: "Prevención, diagnóstico y tratamiento de enfermedades relacionadas con la visión.",
            servicios: "Revisiones visuales, diagnóstico y cirugía ocular."
        },
        {
            icono: "🦴",
            titulo: "Traumatología",
            desc: "Atención de lesiones, enfermedades y alteraciones del aparato locomotor.",
            servicios: "Lesiones, fracturas, articulaciones y seguimiento postquirúrgico."
        },
        {
            icono: "🩺",
            titulo: "Medicina Interna",
            desc: "Atención integral de enfermedades que afectan a diferentes órganos y sistemas.",
            servicios: "Diagnóstico, seguimiento y coordinación de tratamientos."
        },
        {
            icono: "🫁",
            titulo: "Neumología",
            desc: "Especialidad dedicada a las enfermedades del aparato respiratorio.",
            servicios: "Estudio respiratorio, seguimiento y pruebas funcionales."
        },
        {
            icono: "🩸",
            titulo: "Hematología",
            desc: "Estudio y tratamiento de enfermedades de la sangre y órganos relacionados.",
            servicios: "Análisis, diagnóstico y seguimiento hematológico."
        },
        {
            icono: "🧬",
            titulo: "Oncología",
            desc: "Prevención, diagnóstico, tratamiento y seguimiento de enfermedades oncológicas.",
            servicios: "Valoración especializada, tratamientos y seguimiento."
        },
        {
            icono: "🧴",
            titulo: "Dermatología",
            desc: "Prevención y tratamiento de enfermedades de la piel, cabello y uñas.",
            servicios: "Revisiones dermatológicas, diagnóstico y tratamientos."
        },
        {
            icono: "🦷",
            titulo: "Odontología",
            desc: "Prevención y atención de problemas relacionados con la salud bucodental.",
            servicios: "Revisiones, prevención y tratamientos odontológicos."
        },
        {
            icono: "🧘",
            titulo: "Psiquiatría",
            desc: "Atención especializada de los trastornos de la salud mental.",
            servicios: "Valoración, tratamiento y seguimiento psiquiátrico."
        },
        {
            icono: "💬",
            titulo: "Psicología Clínica",
            desc: "Evaluación y atención psicológica dentro del ámbito sanitario.",
            servicios: "Evaluación psicológica, intervención y seguimiento."
        },
        {
            icono: "🦵",
            titulo: "Reumatología",
            desc: "Diagnóstico y tratamiento de enfermedades reumáticas y musculoesqueléticas.",
            servicios: "Valoración articular, seguimiento y tratamientos."
        },
        {
            icono: "⚖️",
            titulo: "Endocrinología y Nutrición",
            desc: "Atención de alteraciones hormonales, metabólicas y nutricionales.",
            servicios: "Diabetes, tiroides, metabolismo y valoración nutricional."
        },
        {
            icono: "🫘",
            titulo: "Nefrología",
            desc: "Prevención, diagnóstico y tratamiento de enfermedades renales.",
            servicios: "Función renal, seguimiento y tratamientos especializados."
        },
        {
            icono: "🫀",
            titulo: "Cirugía Cardiovascular",
            desc: "Tratamiento quirúrgico de enfermedades del corazón y grandes vasos.",
            servicios: "Valoración quirúrgica, intervención y seguimiento."
        },
        {
            icono: "🔬",
            titulo: "Anatomía Patológica",
            desc: "Estudio de tejidos y muestras biológicas para apoyar el diagnóstico médico.",
            servicios: "Biopsias, citologías y estudios anatomopatológicos."
        },
        {
            icono: "🩻",
            titulo: "Radiología",
            desc: "Obtención de imágenes médicas para facilitar el diagnóstico y seguimiento.",
            servicios: "Radiografías, ecografías, TAC y otras pruebas de imagen."
        },
        {
            icono: "☢️",
            titulo: "Medicina Nuclear",
            desc: "Uso de técnicas con radiofármacos para diagnóstico y tratamiento.",
            servicios: "Pruebas funcionales, estudios diagnósticos y tratamientos."
        },
        {
            icono: "💊",
            titulo: "Farmacología Clínica",
            desc: "Especialidad centrada en el uso seguro y adecuado de los medicamentos.",
            servicios: "Valoración farmacológica y optimización de tratamientos."
        },
        {
            icono: "🦠",
            titulo: "Enfermedades Infecciosas",
            desc: "Prevención, diagnóstico y tratamiento de enfermedades infecciosas.",
            servicios: "Diagnóstico, tratamiento y seguimiento de infecciones."
        },
        {
            icono: "🌿",
            titulo: "Alergología",
            desc: "Diagnóstico y tratamiento de alergias y respuestas de hipersensibilidad.",
            servicios: "Pruebas de alergia, diagnóstico y seguimiento."
        },
        {
            icono: "🛡️",
            titulo: "Inmunología",
            desc: "Estudio de alteraciones del sistema inmunitario.",
            servicios: "Estudios inmunológicos y seguimiento especializado."
        },
        {
            icono: "🫃",
            titulo: "Gastroenterología",
            desc: "Atención de enfermedades del aparato digestivo.",
            servicios: "Estudio digestivo, endoscopias y seguimiento."
        },
        {
            icono: "🫁",
            titulo: "Cirugía Torácica",
            desc: "Tratamiento quirúrgico de enfermedades del tórax y aparato respiratorio.",
            servicios: "Valoración quirúrgica, intervención y seguimiento."
        },
        {
            icono: "⚕️",
            titulo: "Cirugía General",
            desc: "Tratamiento quirúrgico de diferentes patologías y procesos.",
            servicios: "Valoración, procedimientos quirúrgicos y seguimiento."
        },
        {
            icono: "🚻",
            titulo: "Urología",
            desc: "Atención de enfermedades del aparato urinario y reproductor masculino.",
            servicios: "Diagnóstico, seguimiento y tratamientos urológicos."
        },
        {
            icono: "🤰",
            titulo: "Ginecología y Obstetricia",
            desc: "Atención integral de la salud reproductiva y del embarazo.",
            servicios: "Revisiones, embarazo, prevención y seguimiento."
        },
        {
            icono: "👨‍⚕️",
            titulo: "Andrología",
            desc: "Atención especializada de la salud reproductiva y sexual masculina.",
            servicios: "Valoración reproductiva y seguimiento especializado."
        },
        {
            icono: "🧓",
            titulo: "Geriatría",
            desc: "Atención integral de las necesidades sanitarias de las personas mayores.",
            servicios: "Valoración geriátrica, prevención y seguimiento."
        },
        {
            icono: "🏃",
            titulo: "Medicina Física y Rehabilitación",
            desc: "Recuperación funcional después de lesiones, enfermedades o cirugías.",
            servicios: "Rehabilitación, recuperación funcional y seguimiento."
        },
        {
            icono: "💉",
            titulo: "Anestesiología",
            desc: "Atención médica relacionada con la anestesia y los procedimientos quirúrgicos.",
            servicios: "Valoración preoperatoria, anestesia y control perioperatorio."
        },
        {
            icono: "🚑",
            titulo: "Medicina de Urgencias",
            desc: "Atención médica ante situaciones que requieren valoración inmediata.",
            servicios: "Valoración urgente, diagnóstico y estabilización."
        },
        {
            icono: "🏥",
            titulo: "Medicina Familiar y Comunitaria",
            desc: "Atención sanitaria integral y continuada para personas y familias.",
            servicios: "Prevención, seguimiento y coordinación asistencial."
        },
        {
            icono: "🧪",
            titulo: "Medicina Preventiva y Salud Pública",
            desc: "Promoción de la salud y prevención de enfermedades en la población.",
            servicios: "Prevención, vacunación, vigilancia y promoción de la salud."
        }
    ];

    return (
        <div className="bg-dark text-white min-vh-100">

            {/* HERO */}
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-9 text-center py-lg-5 scroll-reveal">

                        <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 mb-3">
                            Sistema Nacional de Salud
                        </span>

                        <h1 className="display-4 fw-bold mt-3 mb-3">
                            Especialidades <span className="text-info">Médicas</span>
                        </h1>

                        <p className="lead text-white-50 mb-0">
                            Todas las especialidades que necesitas, gestionadas
                            desde nuestro Sistema Nacional de Salud.
                        </p>

                    </div>
                </div>
            </section>

            {/* CATÁLOGO */}
            <section className="container py-5">

                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-5 scroll-reveal">

                    <div>
                        <span className="text-info small fw-semibold text-uppercase">
                            Catálogo sanitario
                        </span>

                        <h2 className="fw-bold mt-2 mb-2">
                            Áreas de atención sanitaria
                        </h2>

                        <p className="text-white-50 mb-0">
                            Información sobre las diferentes áreas médicas,
                            sus funciones y los servicios que pueden ofrecer.
                        </p>
                    </div>

                    <div className="text-lg-end flex-shrink-0">
                        <span className="d-block text-info display-6 fw-bold lh-1">
                            {especialidades.length}
                        </span>
                        <span className="text-white-50 small">
                            especialidades
                        </span>
                    </div>

                </div>

                <div className="row g-4">
                    {especialidades.map((esp, i) => (
                        <div
                            key={i}
                            className="col-12 col-md-6 col-xl-4 scroll-reveal"
                        >
                            <article className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4">

                                <div className="d-flex justify-content-between align-items-start mb-4">

                                    <div
                                        className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 fs-3"
                                        style={{ width: "56px", height: "56px" }}
                                    >
                                        {esp.icono}
                                    </div>

                                    <span className="text-white-50 small fw-semibold">
                                        {(i + 1).toString().padStart(2, "0")}
                                    </span>

                                </div>

                                <h3 className="h4 text-white fw-bold mb-3">
                                    {esp.titulo}
                                </h3>

                                <p className="text-white-50 mb-4">
                                    {esp.desc}
                                </p>

                                <div className="border-top border-secondary border-opacity-50 pt-3 mt-auto">
                                    <span className="text-info small fw-semibold text-uppercase">
                                        Información
                                    </span>

                                    <p className="text-white-50 small mb-0 mt-2">
                                        {esp.servicios}
                                    </p>
                                </div>

                            </article>
                        </div>
                    ))}
                </div>

                {/* INFORMACIÓN FINAL */}
                <div className="row justify-content-center mt-5 scroll-reveal">
                    <div className="col-lg-10">
                        <div className="alert bg-info bg-opacity-10 border border-info border-opacity-25 text-white rounded-4 p-4 mb-0">

                            <div className="d-flex gap-3 align-items-start">

                                <div className="text-info fs-4 flex-shrink-0">
                                    ℹ
                                </div>

                                <div>
                                    <h3 className="h5 fw-bold mb-2">
                                        Una vez iniciada la sesión tendrás acceso a más servicios
                                    </h3>

                                    <p className="text-white-50 mb-0">
                                        El acceso identificado permite consultar y gestionar
                                        información relacionada con tu asistencia sanitaria,
                                        como citas, documentación clínica, tratamientos,
                                        pruebas y otros servicios disponibles según tu
                                        informe médico.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};