import React, { useEffect } from "react";

export const Contacto = () => {

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
    <div className="contacto-page">

      {/* HERO */}
      <section className="contacto-hero">
        <div className="container">

          <div className="contacto-hero-content scroll-reveal">

            <span className="especialidades-badge">
              Sistema nacional de salud LEXDIBRI
            </span>

            <h1 className="display-3 fw-bold text-white mt-4 mb-4">
              Atención y
              <br />
              <span className="text-info">
                contacto.
              </span>
            </h1>

            <p className="lead text-white-50 mx-auto">
              Estamos aquí para ayudarte. Consulta nuestros canales de
              atención o contacta con el sistema sanitario.
            </p>

          </div>

        </div>

        <div className="contacto-hero-glow"></div>
      </section>

      {/* CONTENIDO */}
      <section className="container py-5">

        {/* CABECERA */}
        <div className="contacto-heading scroll-reveal">

          <span className="text-info small fw-semibold text-uppercase">
            Canales de asistencia
          </span>

          <h2 className="text-white fw-bold mt-2 mb-3">
            ¿Cómo podemos ayudarte?
          </h2>

          <p className="text-white-50 mb-0">
            Puedes contactar con nosotros mediante cualquiera de los canales
            oficiales de atención al paciente.
          </p>

        </div>

        <div className="row g-4 mt-4">

          {/* FORMULARIO */}
          <div className="col-lg-7">
            <div className="contacto-card scroll-reveal">

              <div className="contacto-card-header">

                <div className="contacto-icon">
                  ✉
                </div>

                <div>
                  <span className="text-info small fw-semibold">
                    CONTACTO DIRECTO
                  </span>

                  <h3 className="text-white fw-bold mb-0 mt-1">
                    Envíanos tu consulta
                  </h3>
                </div>

              </div>

              <form>

                <div className="mb-3">
                  <label className="form-label text-white-50 small">
                    Nombre Completo
                  </label>

                  <input
                    type="text"
                    className="form-control contacto-input"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white-50 small">
                    Correo Electrónico
                  </label>

                  <input
                    type="email"
                    className="form-control contacto-input"
                    placeholder="nombre@correo.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small">
                    Consulta o Mensaje
                  </label>

                  <textarea
                    className="form-control contacto-input"
                    rows="5"
                    placeholder="Escribe aquí tu consulta..."
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="btn btn-info contacto-submit w-100 fw-bold"
                >
                  Enviar consulta
                  <span>→</span>
                </button>

              </form>

            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="col-lg-5">

            <div className="d-flex flex-column gap-4 h-100">

              <div className="contacto-info-card scroll-reveal">

                <div className="contacto-info-icon">
                  ☎
                </div>

                <div>
                  <span className="text-info small fw-semibold">
                    ATENCIÓN TELEFÓNICA
                  </span>

                  <h3 className="text-white fw-bold mt-2">
                    Centro de Atención Telefónica
                  </h3>

                  <p className="text-white-50 mb-3">
                    Atención y orientación al paciente a través de nuestros
                    canales telefónicos oficiales.
                  </p>

                  <div className="contacto-phone">
                    <strong>012</strong>
                    <span> / </span>
                    <strong>900 100 200</strong>
                  </div>
                </div>

              </div>

              <div className="contacto-info-card scroll-reveal">

                <div className="contacto-info-icon">
                  @
                </div>

                <div>
                  <span className="text-info small fw-semibold">
                    SOPORTE DIGITAL
                  </span>

                  <h3 className="text-white fw-bold mt-2">
                    Atención online
                  </h3>

                  <p className="text-white-50 mb-2">
                    Para incidencias técnicas relacionadas con el portal
                    sanitario.
                  </p>

                  <span className="contacto-email">
                    soporte@sns.gob.es
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL */}
      <section className="container py-5">

        <div className="contacto-final scroll-reveal">

          <span className="text-info small fw-semibold text-uppercase">
            Atención sanitaria
          </span>

          <h2 className="display-6 text-white fw-bold mt-3 mb-4">
            Tu salud,
            <span className="text-info">
              {" "}nuestra prioridad.
            </span>
          </h2>

          <p className="text-white-50 mb-0">
            El Sistema Nacional de Salud trabaja para ofrecer una atención
            accesible, cercana y de calidad a todos los ciudadanos.
          </p>

        </div>

      </section>

    </div>
  );
};