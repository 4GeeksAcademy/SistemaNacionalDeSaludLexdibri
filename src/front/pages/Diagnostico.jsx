import React, { useEffect } from "react";

export const Diagnostico = () => {

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
        <div className="diagnostico-page">
            <section className="diagnostico-hero">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-9">

                            <div className="diagnostico-hero-content scroll-reveal">

                                <span className="especialidades-badge">
                                    Sistema nacional de salud LEXDIBRI
                                </span>

                                <h1 className="display-3 fw-bold text-white mb-4">
                                    La medicina del futuro
                                    <br />
                                    <span className="text-info">
                                        ya está aquí.
                                    </span>
                                </h1>

                                <p className="lead text-white-50 mx-auto">
                                    La innovación tecnológica está transformando
                                    la forma en la que se diagnostican enfermedades,
                                    se realizan tratamientos y se personaliza la
                                    atención sanitaria.
                                </p>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="diagnostico-hero-glow"></div>
            </section>

            {/* INTRO */}
            <section className="container py-5">

                <div className="diagnostico-intro scroll-reveal">

                    <span className="text-info small fw-semibold text-uppercase">
                        Innovación sanitaria
                    </span>

                    <h2 className="text-white fw-bold mt-2 mb-3">
                        Tecnología al servicio de la salud
                    </h2>

                    <p className="text-white-50 mb-0">
                        Desde sistemas capaces de analizar imágenes médicas
                        mediante inteligencia artificial hasta robots quirúrgicos
                        y tratamientos capaces de dirigir la radiación con una
                        precisión extraordinaria, la tecnología está ampliando
                        las posibilidades de la medicina moderna.
                    </p>

                </div>

            </section>


            {/* 01 */}
            <section className="container py-5">

                <div className="row align-items-center g-5 diagnostico-feature">

                    <div className="col-lg-6">

                        <div className="diagnostico-image scroll-reveal">

                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
                                alt="Inteligencia artificial aplicada a la medicina"
                            />

                            <div className="diagnostico-image-overlay"></div>

                        </div>

                    </div>

                    <div className="col-lg-6">

                        <div className="diagnostico-content scroll-reveal">

                            <span className="text-info small fw-semibold">
                                01 / INTELIGENCIA ARTIFICIAL
                            </span>

                            <h2 className="text-white fw-bold mt-3 mb-4">
                                Inteligencia artificial aplicada al diagnóstico
                            </h2>

                            <p className="text-white-50">
                                Los sistemas de inteligencia artificial están
                                empezando a convertirse en una herramienta de
                                apoyo para los profesionales sanitarios.
                            </p>

                            <p className="text-white-50">
                                Algoritmos capaces de analizar grandes cantidades
                                de imágenes y datos pueden ayudar a detectar
                                patrones, identificar anomalías y priorizar
                                determinados hallazgos médicos.
                            </p>

                            <div className="diagnostico-highlight">

                                <span className="text-info fw-bold">
                                    IA + Diagnóstico
                                </span>

                                <p className="text-white-50 mb-0 mt-2">
                                    Una segunda capa de análisis que ayuda al
                                    profesional a tomar decisiones con mayor
                                    información.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* 02 */}
            <section className="container py-5">

                <div className="row align-items-center g-5 diagnostico-feature">

                    <div className="col-lg-6 order-2 order-lg-1">

                        <div className="diagnostico-content scroll-reveal">

                            <span className="text-info small fw-semibold">
                                02 / CIRUGÍA ROBÓTICA
                            </span>

                            <h2 className="text-white fw-bold mt-3 mb-4">
                                Cirugía robótica de alta precisión
                            </h2>

                            <p className="text-white-50">
                                Los sistemas quirúrgicos robóticos permiten al
                                cirujano trabajar con una gran precisión y una
                                visión ampliada del campo quirúrgico.
                            </p>

                            <p className="text-white-50">
                                La evolución actual combina robótica, visión
                                avanzada e inteligencia artificial para ofrecer
                                asistencia durante la intervención.
                            </p>

                            <div className="diagnostico-tags">
                                <span>Precisión</span>
                                <span>Visión 3D</span>
                                <span>Asistencia IA</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-lg-6 order-1 order-lg-2">

                        <div className="diagnostico-image scroll-reveal">

                            <img
                                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80"
                                alt="Tecnología robótica aplicada a la cirugía"
                            />

                            <div className="diagnostico-image-overlay"></div>

                        </div>

                    </div>

                </div>

            </section>


            {/* 03 */}
            <section className="container py-5">

                <div className="row align-items-center g-5 diagnostico-feature">

                    <div className="col-lg-6">

                        <div className="diagnostico-image scroll-reveal">

                            <img
                                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
                                alt="Tecnología avanzada para tratamientos médicos"
                            />

                            <div className="diagnostico-image-overlay"></div>

                        </div>

                    </div>

                    <div className="col-lg-6">

                        <div className="diagnostico-content scroll-reveal">

                            <span className="text-info small fw-semibold">
                                03 / ONCOLOGÍA DE PRECISIÓN
                            </span>

                            <h2 className="text-white fw-bold mt-3 mb-4">
                                Protonterapia: radiación dirigida
                            </h2>

                            <p className="text-white-50">
                                La protonterapia utiliza haces de protones para
                                depositar una dosis de radiación altamente
                                controlada sobre una zona determinada.
                            </p>

                            <p className="text-white-50">
                                Su capacidad para concentrar la dosis en el
                                objetivo y reducir la exposición de tejidos
                                cercanos la convierte en una tecnología avanzada
                                dentro de la radioterapia.
                            </p>

                            <div className="diagnostico-highlight">

                                <span className="text-info fw-bold">
                                    Precisión terapéutica
                                </span>

                                <p className="text-white-50 mb-0 mt-2">
                                    La tecnología permite diseñar tratamientos
                                    cada vez más adaptados a la anatomía de cada
                                    paciente.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* 04 */}
            <section className="container py-5">

                <div className="row align-items-center g-5 diagnostico-feature">

                    <div className="col-lg-6 order-2 order-lg-1">

                        <div className="diagnostico-content scroll-reveal">

                            <span className="text-info small fw-semibold">
                                04 / MEDICINA DE PRECISIÓN
                            </span>

                            <h2 className="text-white fw-bold mt-3 mb-4">
                                Genómica y medicina personalizada
                            </h2>

                            <p className="text-white-50">
                                La medicina de precisión busca adaptar la
                                prevención, el diagnóstico y el tratamiento a
                                las características concretas de cada persona.
                            </p>

                            <p className="text-white-50">
                                El análisis genómico permite estudiar información
                                biológica del paciente para comprender mejor
                                determinadas enfermedades y ayudar a seleccionar
                                estrategias terapéuticas más personalizadas.
                            </p>

                            <div className="diagnostico-tags">
                                <span>Genómica</span>
                                <span>Datos clínicos</span>
                                <span>Personalización</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-lg-6 order-1 order-lg-2">

                        <div className="diagnostico-image scroll-reveal">

                            <img
                                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
                                alt="Investigación genética y medicina de precisión"
                            />

                            <div className="diagnostico-image-overlay"></div>

                        </div>

                    </div>

                </div>

            </section>


            {/* 05 */}
            <section className="container py-5">

                <div className="row align-items-center g-5 diagnostico-feature">

                    <div className="col-lg-6">

                        <div className="diagnostico-image scroll-reveal">

                            <img
                                src="https://casenrecordati.com/wp-content/uploads/shutterstock_313372355-624x416.jpg"
                                alt="Bioimpresión 3D de tejidos y órganos"
                            />

                            <div className="diagnostico-image-overlay"></div>

                        </div>

                    </div>

                    <div className="col-lg-6">

                        <div className="diagnostico-content scroll-reveal">

                            <span className="text-info small fw-semibold">
                                05 / BIOINGENIERÍA
                            </span>

                            <h2 className="text-white fw-bold mt-3 mb-4">
                                Bioimpresión y fabricación 3D
                            </h2>

                            <p className="text-white-50">
                                La impresión 3D permite fabricar modelos
                                anatómicos, prótesis, implantes personalizados
                                y diferentes estructuras utilizadas en
                                investigación biomédica.
                            </p>

                            <p className="text-white-50">
                                La bioimpresión estudia cómo utilizar materiales
                                biocompatibles y células para construir
                                estructuras destinadas a la investigación y
                                futuras aplicaciones regenerativas.
                            </p>

                            <div className="diagnostico-highlight">

                                <span className="text-info fw-bold">
                                    Fabricación personalizada
                                </span>

                                <p className="text-white-50 mb-0 mt-2">
                                    La fabricación digital permite adaptar
                                    determinados dispositivos a la anatomía
                                    específica de cada paciente.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* FINAL */}
            <section className="container py-5">

                <div className="diagnostico-future scroll-reveal">

                    <div className="diagnostico-future-line"></div>

                    <div className="row justify-content-center text-center">

                        <div className="col-lg-8">

                            <span className="text-info small fw-semibold text-uppercase">
                                El siguiente paso
                            </span>

                            <h2 className="display-6 text-white fw-bold mt-3 mb-4">
                                Una medicina cada vez más
                                <span className="text-info">
                                    {" "}precisa, conectada y personalizada.
                                </span>
                            </h2>

                            <p className="text-white-50 mb-0">
                                La tecnología no sustituye al profesional
                                sanitario. Lo dota de nuevas herramientas para
                                comprender mejor las enfermedades, mejorar los
                                tratamientos y ofrecer una atención cada vez más
                                adaptada a cada paciente.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};