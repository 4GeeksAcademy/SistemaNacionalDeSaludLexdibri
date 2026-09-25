import React, { useEffect } from "react";
import { Icon } from "../components/Icon";

export const Urgencias = () => {
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
              Urgencias sanitarias
              <br />
              <span className="text-danger">
                24 horas.
              </span>
            </h1>

            <p className="lead text-white-50 mx-auto col-lg-9 mb-0">
              Acceso rápido a los servicios de emergencia cuando más
              lo necesitas.
            </p>

          </div>
        </div>
      </section>

      {/* EMERGENCIA */}
      <section className="container py-5">

        <div className="row justify-content-center">
          <div className="col-12 scroll-reveal">

            <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-4 p-4 p-md-5">

              <div className="row align-items-center g-4">

                <div className="col-lg-8">

                  <span className="badge rounded-pill bg-danger text-white px-3 py-2">
                    <Icon name="Siren" className="me-1" />EMERGENCIA
                  </span>

                  <h2 className="fw-bold mt-3 mb-3">
                    ¿Necesitas asistencia médica inmediata?
                  </h2>

                  <p className="text-white-50 mb-4">
                    Ante una emergencia de riesgo vital, contacta con
                    los servicios de emergencia.
                  </p>

                  <div className="d-flex gap-3 flex-wrap">

                    <a
                      href="tel:112"
                      className="btn btn-danger btn-lg rounded-pill fw-bold px-4"
                    >
                      <Icon name="Phone" className="me-1" />Llamar al 112
                    </a>

                    <a
                      href="tel:061"
                      className="btn btn-outline-danger btn-lg rounded-pill fw-bold px-4"
                    >
                      <Icon name="Ambulance" className="me-1" />Llamar al 061
                    </a>

                  </div>

                </div>

                <div className="col-lg-4 text-center">

                  <span className="display-1 fw-bold text-danger">
                    112
                  </span>

                  <span className="d-block text-white-50 fw-semibold">
                    EMERGENCIAS
                  </span>

                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* LOCALIZACIÓN */}
      <section className="container py-5">

        <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5 scroll-reveal">

          <div className="row align-items-center g-5">

            <div className="col-lg-5">

              <span className="text-info small fw-semibold text-uppercase">
                Localización
              </span>

              <h2 className="fw-bold mt-2 mb-3">
                Encuentra el centro de urgencias
                <span className="text-info">
                  {" "}más cercano.
                </span>
              </h2>

              <p className="text-white-50">
                Localiza hospitales y centros con servicio de urgencias
                próximos a tu ubicación.
              </p>

              <button
                type="button"
                className="btn btn-info rounded-pill fw-bold mt-3"
              >
                <Icon name="MapPin" className="me-1" />Buscar centros cercanos
              </button>

              <div className="d-flex align-items-start gap-3 mt-4">

                <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fw-bold flex-shrink-0"
                  style={{ width: "48px", height: "48px" }}
                >
                  <Icon name="Check" />
                </div>

                <div>
                  <strong className="d-block">
                    Servicios de urgencias
                  </strong>

                  <p className="text-white-50 mb-0 mt-1">
                    Consulta centros disponibles y su localización.
                  </p>
                </div>

              </div>

            </div>

            <div className="col-lg-7">

              <div className="ratio ratio-16x9 rounded-4 overflow-hidden border border-secondary border-opacity-50">

                <iframe
                  title="Mapa de centros de urgencias"
                  src="https://www.google.com/maps?q=hospitales%20Vigo%20Espa%C3%B1a&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};