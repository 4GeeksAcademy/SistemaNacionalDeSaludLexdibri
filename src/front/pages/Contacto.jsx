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
    <div className="bg-dark text-white min-vh-100">

      {/* HERO */}
      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="col-lg-9 py-lg-5 scroll-reveal">

            <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 mb-4">
              Sistema Nacional de Salud
            </span>

            <h1 className="display-3 fw-bold mb-4">
              Atención y
              <br />
              <span className="text-info">
                contacto.
              </span>
            </h1>

            <p className="lead text-white-50 mx-auto col-lg-9 mb-0">
              Consulta nuestros canales de atención o envíanos tu consulta.
            </p>

          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="container py-5">

        {/* CABECERA */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9 text-center scroll-reveal">

            <span className="text-info small fw-semibold text-uppercase">
              Canales de asistencia
            </span>

            <h2 className="fw-bold mt-2 mb-3">
              ¿Cómo podemos ayudarte?
            </h2>

            <p className="text-white-50 mb-0">
              Elige el canal que mejor se adapte a tu consulta.
            </p>

          </div>
        </div>

        <div className="row g-4">

          {/* FORMULARIO */}
          <div className="col-lg-7">
            <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5 scroll-reveal">

              <div className="d-flex align-items-center gap-3 mb-4">

                <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4"
                  style={{ width: "56px", height: "56px" }}
                >
                  ✉
                </div>

                <div>
                  <span className="text-info small fw-semibold">
                    CONTACTO DIRECTO
                  </span>

                  <h3 className="h4 fw-bold mb-0 mt-1">
                    Envíanos tu consulta
                  </h3>
                </div>

              </div>

              <form>

                <div className="mb-3">
                  <label className="form-label text-white-50 small">
                    Nombre completo
                  </label>

                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white-50 small">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="nombre@correo.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small">
                    Consulta o mensaje
                  </label>

                  <textarea
                    className="form-control bg-dark text-white border-secondary"
                    rows="5"
                    placeholder="Escribe aquí tu consulta..."
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="btn btn-info rounded-pill w-100 fw-bold py-2"
                >
                  Enviar consulta →
                </button>

              </form>

            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="col-lg-5">

            <div className="d-flex flex-column gap-4 h-100">

              {/* TELÉFONO */}
              <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 scroll-reveal">

                <div className="d-flex align-items-center gap-3 mb-4">

                  <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4"
                    style={{ width: "56px", height: "56px" }}
                  >
                    ☎
                  </div>

                  <span className="text-info small fw-semibold">
                    ATENCIÓN TELEFÓNICA
                  </span>

                </div>

                <h3 className="h4 fw-bold mb-3">
                  Centro de Atención Telefónica
                </h3>

                <p className="text-white-50 mb-4">
                  Atención y orientación al paciente a través de nuestros
                  canales telefónicos.
                </p>

                <div className="fs-5 fw-bold">
                  <span className="text-info">012</span>
                  <span className="text-white-50 mx-2">/</span>
                  <span className="text-info">900 100 200</span>
                </div>

              </div>

              {/* SOPORTE */}
              <div className="card h-100 bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 scroll-reveal">

                <div className="d-flex align-items-center gap-3 mb-4">

                  <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4"
                    style={{ width: "56px", height: "56px" }}
                  >
                    @
                  </div>

                  <span className="text-info small fw-semibold">
                    SOPORTE DIGITAL
                  </span>

                </div>

                <h3 className="h4 fw-bold mb-3">
                  Atención online
                </h3>

                <p className="text-white-50 mb-3">
                  Para incidencias técnicas relacionadas con el portal.
                </p>

                <span className="text-info fw-semibold">
                  soporte@sns.gob.es
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL */}
      <section className="container py-5">

        <div className="row justify-content-center text-center">
          <div className="col-lg-9 scroll-reveal">

            <div className="bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 p-4 p-md-5">

              <span className="text-info small fw-semibold text-uppercase">
                Atención sanitaria
              </span>

              <h2 className="display-6 fw-bold mt-2 mb-4">
                Tu salud,
                <span className="text-info">
                  {" "}nuestra prioridad.
                </span>
              </h2>

              <p className="text-white-50 mb-0">
                Trabajamos para ofrecer una atención accesible, cercana
                y de calidad.
              </p>

            </div>

          </div>
        </div>

      </section>

    </div>
  );
};