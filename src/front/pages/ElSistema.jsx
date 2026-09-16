import React, { useEffect } from "react";

export const ElSistema = () => {
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

    return (
        <div className=" text-white min-vh-100">

            {/* HERO */}
            <section className="container py-5">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-9 py-lg-5 scroll-reveal">

                        <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 mb-4">
                            Sistema Nacional de Salud
                        </span>

                        <h1 className="display-3 fw-bold mb-4">
                            Una idea para
                            <br />
                            <span className="text-info">
                                mejorar la sanidad.
                            </span>
                        </h1>

                        <p className="lead text-white-50 mx-auto col-lg-10 mb-0">
                            Un proyecto desarrollado por tres estudiantes de
                            4Geeks Academy: <strong style={{ color : "#00d5ff"}}>Alex, Diego</strong> y
                            <strong style={{ color : "#00d5ff"}}> Brian.</strong> 
                            </p>

                    </div>
                </div>
            </section>

            {/* HISTORIA */}
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">

                        <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5 scroll-reveal">

                            <div className="row align-items-center g-5">

                                <div className="col-lg-8">

                                    <span className="text-info small fw-semibold text-uppercase">
                                        El origen del proyecto
                                    </span>

                                    <h2 className="fw-bold mt-2 mb-4">
                                        Tres estudiantes,
                                        <span className="text-info">
                                            {" "}un problema real.
                                        </span>
                                    </h2>

                                    <p className="text-white-50 mb-3">
                                        Somos tres estudiantes de{" "}
                                        <strong className="text-white">
                                            4Geeks Academy
                                        </strong>{" "}
                                        que quisimos aplicar nuestros conocimientos de programación a un problema del mundo real: la falta de interconexión entre las bases de datos sanitarias de las distintas comunidades autónomas dificulta que los profesionales médicos puedan consultar de forma rápida y segura la información clínica de un paciente cuando este es atendido fuera de su comunidad.

                                    </p>

                                    <p className="text-white-50 mb-0">
                                        A partir de esta idea desarrollamos una
                                        plataforma orientada a centralizar y
                                        organizar información y servicios
                                        relacionados con la sanidad.
                                    </p>

                                </div>

                                <div className="col-lg-4 text-center">

                                    <span className="display-3 fw-bold text-info">
                                        3
                                    </span>

                                    <span className="d-block text-white fw-semibold">
                                        ESTUDIANTES
                                    </span>

                                    <span className="text-info small fw-bold">
                                        4GEEKS ACADEMY
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* TECNOLOGÍA */}
            <section className="container py-5">

                <div className="row justify-content-center mb-5">
                    <div className="col-lg-9 text-center scroll-reveal">

                        <span className="text-info small fw-semibold text-uppercase">
                            Tecnología
                        </span>

                        <h2 className="fw-bold mt-2 mb-3">
                            ¿Cómo está construido?
                        </h2>

                        <p className="text-white-50 mb-0">
                            El proyecto combina diferentes tecnologías para
                            construir la interfaz, la lógica y los servicios
                            de la aplicación.
                        </p>

                    </div>
                </div>

                <div className="row g-4">

                    {/* JAVASCRIPT */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 scroll-reveal">

                            <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 fs-4 fw-bold text-info mb-4"
                                style={{ width: "56px", height: "56px" }}
                            >
                                JS
                            </div>

                            <span className="text-info small fw-semibold">
                                FRONTEND
                            </span>

                            <h3 className="h4 fw-bold mt-2 mb-3">
                                JavaScript
                            </h3>

                            <p className="text-white-50 mb-0">
                                Utilizado para construir una interfaz
                                dinámica e interactiva.
                            </p>

                        </div>
                    </div>

                    {/* PYTHON */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 scroll-reveal">

                            <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 fs-4 fw-bold text-info mb-4"
                                style={{ width: "56px", height: "56px" }}
                            >
                                PY
                            </div>

                            <span className="text-info small fw-semibold">
                                BACKEND
                            </span>

                            <h3 className="h4 fw-bold mt-2 mb-3">
                                Python
                            </h3>

                            <p className="text-white-50 mb-0">
                                Utilizado para desarrollar parte de la
                                lógica y los servicios del sistema.
                            </p>

                        </div>
                    </div>

                    {/* OTRAS TECNOLOGÍAS */}
                    <div className="col-12 col-md-4">
                        <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 scroll-reveal">

                            <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 fs-4 fw-bold text-info mb-4"
                                style={{ width: "56px", height: "56px" }}
                            >
                                {"</>"}
                            </div>

                            <span className="text-info small fw-semibold">
                                DESARROLLO
                            </span>

                            <h3 className="h4 fw-bold mt-2 mb-3">
                                Otras tecnologías
                            </h3>

                            <p className="text-white-50 mb-0">
                                Herramientas adicionales completan la
                                arquitectura y experiencia del proyecto.
                            </p>

                        </div>
                    </div>

                </div>
            </section>

            {/* OBJETIVO */}
            <section className="container py-5 pb-5">

                <div className="row justify-content-center text-center">
                    <div className="col-lg-9 scroll-reveal">

                        <div className="bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 p-4 p-md-5">

                            <span className="text-info small fw-semibold text-uppercase">
                                Nuestro objetivo
                            </span>

                            <h2 className="display-6 fw-bold mt-2 mb-4">
                                La tecnología al servicio de
                                <span className="text-info">
                                    {" "}las personas.
                                </span>
                            </h2>

                            <p className="text-white-50 mb-0">
                                Demostrar cómo una plataforma digital puede
                                ayudar a presentar la información sanitaria
                                de una forma más accesible, clara y sencilla.
                            </p>

                        </div>

                    </div>
                </div>

            </section>

        </div>
    );
};