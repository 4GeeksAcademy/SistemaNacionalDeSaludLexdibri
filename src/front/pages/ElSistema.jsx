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
    <div className="sistema-page">

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
      <section className="container py-5">

        <div className="sistema-story scroll-reveal">

          <div className="sistema-story-content">

            <span className="text-info small fw-semibold text-uppercase">
              El origen del proyecto
            </span>

            <h2 className="text-white fw-bold mt-2 mb-4">
              Tres estudiantes,
              <span className="text-info">
                {" "}un problema real.
              </span>
            </h2>

            <p className="text-white-50">
              Somos tres estudiantes de <strong className="text-white">
                4Geeks Academy
              </strong> que quisimos llevar nuestros conocimientos de
              programación a un problema del mundo real.
            </p>

            <p className="text-white-50">
              Durante el desarrollo del proyecto observamos que la
              información sanitaria puede encontrarse repartida entre
              diferentes servicios y comunidades autónomas, haciendo que
              acceder a determinados recursos o encontrar información
              relevante no siempre resulte sencillo.
            </p>

            <p className="text-white-50 mb-0">
              A partir de esta idea decidimos crear <strong className="text-info">
                LEXDIBRI
              </strong>: una plataforma pensada para centralizar,
              organizar y facilitar el acceso a diferentes servicios
              relacionados con la sanidad.
            </p>

          </div>

          <div className="sistema-story-number">
            <span>3</span>
            <small>ESTUDIANTES</small>
            <small>4GEEKS</small>
          </div>

        </div>

      </section>


      {/* TECNOLOGÍA */}
      <section className="container py-5">

        <div className="sistema-heading scroll-reveal">

          <span className="text-info small fw-semibold text-uppercase">
            Tecnología
          </span>

          <h2 className="text-white fw-bold mt-2 mb-3">
            Construido con las
            <span className="text-info">
              {" "} mejores tecnologías.
            </span>
          </h2>

          <p className="text-white-50 mb-0">
            Para convertir nuestra idea en una plataforma funcional
            utilizamos diferentes tecnologías y herramientas aprendidas
            durante nuestra formación.
          </p>

        </div>


        <div className="row g-4 mt-4">

          <div className="col-md-4">
            <div className="sistema-tech-card scroll-reveal">

              <div className="sistema-tech-icon">
                JS
              </div>

              <span className="text-info small fw-semibold">
                FRONTEND
              </span>

              <h3 className="text-white fw-bold mt-2">
                JavaScript
              </h3>

              <p className="text-white-50 mb-0">
                Utilizado para construir una interfaz dinámica,
                interactiva y fácil de utilizar.
              </p>

            </div>
          </div>


          <div className="col-md-4">
            <div className="sistema-tech-card scroll-reveal">

              <div className="sistema-tech-icon">
                PY
              </div>

              <span className="text-info small fw-semibold">
                BACKEND
              </span>

              <h3 className="text-white fw-bold mt-2">
                Python
              </h3>

              <p className="text-white-50 mb-0">
                Una de las tecnologías utilizadas para desarrollar
                la lógica y los servicios del sistema.
              </p>

            </div>
          </div>


          <div className="col-md-4">
            <div className="sistema-tech-card scroll-reveal">

              <div className="sistema-tech-icon">
                {"</>"}
              </div>

              <span className="text-info small fw-semibold">
                DESARROLLO
              </span>

              <h3 className="text-white fw-bold mt-2">
                Más tecnologías
              </h3>

              <p className="text-white-50 mb-0">
                El proyecto combina diferentes herramientas y
                tecnologías para crear una experiencia completa.
              </p>

            </div>
          </div>

        </div>

      </section>


      {/* OBJETIVO */}
      <section className="container py-5">

        <div className="sistema-final scroll-reveal">

          <span className="text-info small fw-semibold text-uppercase">
            Nuestro objetivo
          </span>

          <h2 className="display-6 text-white fw-bold mt-3 mb-4">
            La tecnología al servicio de
            <span className="text-info">
              {" "}las personas.
            </span>
          </h2>

          <p className="text-white-50 mb-0">
            LEXDIBRI es nuestro intento de demostrar cómo la tecnología
            puede ayudar a hacer que la información sanitaria sea más
            accesible, clara y sencilla para los ciudadanos.
          </p>

        </div>

      </section>

    </div>
  );
};