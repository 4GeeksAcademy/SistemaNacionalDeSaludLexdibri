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
    <div className="sistema-page pb-5">

      {/* HERO */}
      <section className="sistema-hero">
        <div className="container">
          <div className="sistema-hero-content scroll-reveal">

            <span className="especialidades-badge">
              Sistema nacional de salud LEXDIBRI
            </span>

            <h1 className="display-3 fw-bold text-white mt-4 mb-4">
              Una idea para
              <br />
              <span className="text-info">
                mejorar la sanidad.
              </span>
            </h1>

            <p className="lead text-white-50 mx-auto">
              LEXDIBRI nace como proyecto de tres estudiantes de 4Geeks
              que decidimos buscar una solución tecnológica a un problema
              que encontramos en la sanidad española.
            </p>

          </div>
        </div>

        <div className="sistema-hero-glow"></div>
      </section>


      {/* NUESTRA HISTORIA */}
      <section className="container py-5 my-3">

        <div className="sistema-story scroll-reveal p-4 p-md-5 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-20 shadow-lg">

          <div className="sistema-story-content">

            <span className="text-info small fw-semibold text-uppercase tracking-wider">
              El origen del proyecto
            </span>

            <h2 className="text-white fw-bold mt-2 mb-4">
              Tres estudiantes,
              <span className="text-info">
                {" "}un problema real.
              </span>
            </h2>

            <p className="text-white-50 mb-3">
              Somos tres estudiantes de <strong className="text-white">
                4Geeks Academy
              </strong> que quisimos llevar nuestros conocimientos de
              programación a un problema del mundo real.
            </p>

            <p className="text-white-50 mb-3">
              Durante el desarrollo del proyecto observamos que la
              información sanitaria puede encontrarse repartida entre
              diferentes servicios y comunidades autónomas, haciendo que
              acceder a determinados recursos o encontrar información
              relevante no siempre resulte sencillo.
            </p>

            <p className="text-white-50 mb-0">
              A partir de esta idea decidimos crear <strong className="text-info fw-bold">
                LEXDIBRI
              </strong>: una plataforma pensada para centralizar,
              organizar y facilitar el acceso a diferentes servicios
              relacionados con la sanidad.
            </p>

          </div>

          <div className="sistema-story-number mt-4 mt-lg-0">
            <span>3</span>
            <small className="fw-semibold">ESTUDIANTES</small>
            <small className="text-info fw-bold">4GEEKS</small>
          </div>

        </div>

      </section>


      {/* TECNOLOGÍA */}
      <section className="container py-5 my-3">

        <div className="sistema-heading scroll-reveal mb-4">

          <span className="text-info small fw-semibold text-uppercase tracking-wider">
            Tecnología
          </span>

          <h2 className="text-white fw-bold mt-2 mb-3">
            Construido con las
            <span className="text-info">
              {" "}mejores tecnologías.
            </span>
          </h2>

          <p className="text-white-50 mb-0">
            Para convertir nuestra idea en una plataforma funcional
            utilizamos diferentes tecnologías y herramientas aprendidas
            durante nuestra formación.
          </p>

        </div>


        <div className="row g-4 mt-2">

          <div className="col-12 col-md-4">
            <div className="sistema-tech-card scroll-reveal h-100 p-4 rounded-3 border border-secondary border-opacity-20 bg-dark bg-opacity-50 shadow-sm d-flex flex-column justify-content-between">

              <div>
                <div className="sistema-tech-icon mb-3">
                  JS
                </div>

                <span className="text-info small fw-semibold d-block mb-1">
                  FRONTEND
                </span>

                <h3 className="text-white fw-bold mb-3">
                  JavaScript
                </h3>

                <p className="text-white-50 mb-0">
                  Utilizado para construir una interfaz dinámica,
                  interactiva y fácil de utilizar.
                </p>
              </div>

            </div>
          </div>


          <div className="col-12 col-md-4">
            <div className="sistema-tech-card scroll-reveal h-100 p-4 rounded-3 border border-secondary border-opacity-20 bg-dark bg-opacity-50 shadow-sm d-flex flex-column justify-content-between">

              <div>
                <div className="sistema-tech-icon mb-3">
                  PY
                </div>

                <span className="text-info small fw-semibold d-block mb-1">
                  BACKEND
                </span>

                <h3 className="text-white fw-bold mb-3">
                  Python
                </h3>

                <p className="text-white-50 mb-0">
                  Una de las tecnologías utilizadas para desarrollar
                  la lógica y los servicios del sistema.
                </p>
              </div>

            </div>
          </div>


          <div className="col-12 col-md-4">
            <div className="sistema-tech-card scroll-reveal h-100 p-4 rounded-3 border border-secondary border-opacity-20 bg-dark bg-opacity-50 shadow-sm d-flex flex-column justify-content-between">

              <div>
                <div className="sistema-tech-icon mb-3">
                  {"</>"}
                </div>

                <span className="text-info small fw-semibold d-block mb-1">
                  DESARROLLO
                </span>

                <h3 className="text-white fw-bold mb-3">
                  Más tecnologías
                </h3>

                <p className="text-white-50 mb-0">
                  El proyecto combina diferentes herramientas y
                  tecnologías para crear una experiencia completa.
                </p>
              </div>

            </div>
          </div>

        </div>

      </section>


      {/* OBJETIVO */}
      <section className="container py-5 my-4">

        <div className="sistema-final scroll-reveal p-4 p-md-5 rounded-4 bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-center">

          <span className="text-info small fw-semibold text-uppercase tracking-wider">
            Nuestro objetivo
          </span>

          <h2 className="display-6 text-white fw-bold mt-2 mb-4">
            La tecnología al servicio de
            <span className="text-info">
              {" "}las personas.
            </span>
          </h2>

          <p className="text-white-50 mb-0 mx-auto" style={{ maxWidth: "750px" }}>
            LEXDIBRI es nuestro intento de demostrar cómo la tecnología
            puede ayudar a hacer que la información sanitaria sea más
            accesible, clara y sencilla para los ciudadanos.
          </p>

        </div>

      </section>

    </div>
  );
};