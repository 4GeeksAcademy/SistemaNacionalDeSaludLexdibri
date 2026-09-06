import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const Home = () => {

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
        <div className="home-page">

            {/* ========================================
                HERO
            ======================================== */}
            <section className="container py-5">
                <div className="row justify-content-center">

                    <div className="col-lg-9 text-center py-lg-5 scroll-reveal">

                        <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 mb-4">
                            Sistema Nacional de Salud
                        </span>

                        <h1 className="display-2 fw-bold text-white lh-sm mb-4">
                            Tu salud,
                            <span className="text-info"> conectada.</span>
                        </h1>

                        <p
                            className="lead text-white-50 mx-auto mb-4"
                            style={{ maxWidth: "750px" }}
                        >
                            Accede de forma sencilla a los servicios sanitarios,
                            información de salud y recursos del Sistema Nacional
                            de Salud desde un único espacio digital.
                        </p>

                        <div className="d-flex justify-content-center flex-wrap gap-3">

                            <Link
                                to="/login"
                                className="btn btn-info btn-lg px-4 rounded-pill fw-semibold"
                            >
                                Acceder a Mi Portal
                            </Link>

                            <Link
                                to="/especialidades"
                                className="btn btn-outline-light btn-lg px-4 rounded-pill"
                            >
                                Explorar servicios
                            </Link>

                        </div>

                        <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 text-white-50 small">
                            <span>✓ Información sanitaria</span>
                            <span>✓ Servicios digitales</span>
                            <span>✓ Acceso seguro</span>
                        </div>

                    </div>

                </div>
            </section>


            {/* ========================================
                ACCESOS RÁPIDOS
            ======================================== */}
            <section className="container py-5">

                <div className="text-center mb-5 scroll-reveal">

                    <span className="text-info small fw-semibold text-uppercase">
                        Servicios digitales
                    </span>

                    <h2 className="text-white fw-bold mt-2">
                        Todo lo que necesitas, en un solo lugar
                    </h2>

                    <p
                        className="text-white-50 mx-auto"
                        style={{ maxWidth: "650px" }}
                    >
                        Encuentra rápidamente información, profesionales y
                        servicios relacionados con el Sistema Nacional de Salud.
                    </p>

                </div>


                {/* TARJETAS CENTRADAS */}
                <div className="row g-4 justify-content-center">

                    {/* ESPECIALIDADES */}
                    <div className="col-md-6 col-lg-3 scroll-reveal">

                        <Link
                            to="/especialidades"
                            className="home-service-card text-decoration-none"
                        >

                            <div className="home-service-icon">
                                🩺
                            </div>

                            <h5 className="text-white fw-bold mt-4">
                                Especialidades
                            </h5>

                            <p className="text-white-50 mb-0">
                                Conoce las principales áreas de atención médica.
                            </p>

                            <span className="home-arrow">
                                →
                            </span>

                        </Link>

                    </div>


                    {/* DIAGNÓSTICO */}
                    <div className="col-md-6 col-lg-3 scroll-reveal">

                        <Link
                            to="/diagnostico"
                            className="home-service-card text-decoration-none"
                        >

                            <div className="home-service-icon">
                                🔬
                            </div>

                            <h5 className="text-white fw-bold mt-4">
                                Diagnóstico
                            </h5>

                            <p className="text-white-50 mb-0">
                                Tecnología y recursos para el diagnóstico sanitario.
                            </p>

                            <span className="home-arrow">
                                →
                            </span>

                        </Link>

                    </div>


                    {/* SALUD PÚBLICA */}
                    <div className="col-md-6 col-lg-3 scroll-reveal">

                        <Link
                            to="/salud-publica"
                            className="home-service-card text-decoration-none"
                        >

                            <div className="home-service-icon">
                                🌐
                            </div>

                            <h5 className="text-white fw-bold mt-4">
                                Salud Pública
                            </h5>

                            <p className="text-white-50 mb-0">
                                Información y recursos para cuidar de tu salud.
                            </p>

                            <span className="home-arrow">
                                →
                            </span>

                        </Link>

                    </div>

                </div>

            </section>


            {/* ========================================
                SOBRE EL SNS
            ======================================== */}
            <section className="container py-5">

                <div className="home-info-section scroll-reveal">

                    <div className="row align-items-center g-5">

                        {/* TEXTO */}
                        <div className="col-lg-6">

                            <span className="text-info small fw-semibold text-uppercase">
                                Una red al servicio de todos
                            </span>

                            <h2 className="display-6 text-white fw-bold mt-3 mb-4">
                                Un sistema sanitario
                                <br />
                                conectado y accesible
                            </h2>

                            <p className="text-white-50">
                                El Sistema Nacional de Salud integra los servicios
                                sanitarios públicos para garantizar una atención
                                sanitaria de calidad, accesible y coordinada.
                            </p>

                            <p className="text-white-50">
                                Este portal reúne información y herramientas
                                digitales para facilitar el acceso de ciudadanos
                                y profesionales a los recursos sanitarios.
                            </p>

                            <Link
                                to="/el-sistema"
                                className="btn btn-outline-info rounded-pill px-4 mt-2"
                            >
                                Conocer el sistema →
                            </Link>

                        </div>


                        {/* ESTADÍSTICAS */}
                        <div className="col-lg-6">

                            <div className="row g-3">

                                {/* COMUNIDADES */}
                                <div className="col-6 scroll-reveal">

                                    <div className="home-stat-card">

                                        <span className="text-info fs-2 fw-bold">
                                            17
                                        </span>

                                        <p className="text-white fw-semibold mb-1">
                                            Comunidades
                                        </p>

                                        <small className="text-white-50">
                                            Servicios sanitarios coordinados
                                        </small>

                                    </div>

                                </div>


                                {/* ATENCIÓN */}
                                <div className="col-6 scroll-reveal">

                                    <div className="home-stat-card">

                                        <span className="text-info fs-2 fw-bold">
                                            24/7
                                        </span>

                                        <p className="text-white fw-semibold mb-1">
                                            Atención
                                        </p>

                                        <small className="text-white-50">
                                            Servicios de urgencias
                                        </small>

                                    </div>

                                </div>


                                {/* PROFESIONALES */}
                                <div className="col-6 scroll-reveal">

                                    <div className="home-stat-card">

                                        <span className="text-info fs-2 fw-bold">
                                            +1M
                                        </span>

                                        <p className="text-white fw-semibold mb-1">
                                            Profesionales
                                        </p>

                                        <small className="text-white-50">
                                            Formando parte de la red sanitaria
                                        </small>

                                    </div>

                                </div>


                                {/* COBERTURA */}
                                <div className="col-6 scroll-reveal">

                                    <div className="home-stat-card">

                                        <span className="text-info fs-2 fw-bold">
                                            🇪🇸
                                        </span>

                                        <p className="text-white fw-semibold mb-1">
                                            Cobertura nacional
                                        </p>

                                        <small className="text-white-50">
                                            Atención sanitaria pública
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================
                URGENCIAS
            ======================================== */}
            <section className="container py-5 pb-5">

                <div className="home-emergency scroll-reveal">

                    <div>

                        <span className="text-danger fw-bold">
                            ATENCIÓN INMEDIATA
                        </span>

                        <h3 className="text-white fw-bold mt-2 mb-2">
                            ¿Necesitas ayuda urgente?
                        </h3>

                        <p className="text-white-50 mb-0">
                            En caso de emergencia sanitaria, contacta con los
                            servicios de emergencias de tu comunidad.
                        </p>

                    </div>

                    <Link
                        to="/urgencias"
                        className="btn btn-danger rounded-pill px-4 fw-semibold"
                    >
                        Ver información de urgencias
                    </Link>

                </div>

            </section>

        </div>
    );
};