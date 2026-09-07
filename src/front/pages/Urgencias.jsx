import React, { useEffect } from "react";

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
    <div className="urgencias-page">

      {/* HERO */}
      <section className="urgencias-hero">
        <div className="container">

          <div className="urgencias-hero-content scroll-reveal">

            <span className="especialidades-badge">
              Sistema nacional de salud LEXDIBRI
            </span>

            <h1 className="display-3 fw-bold text-white mt-4 mb-4">
              Urgencias sanitarias
              <br />
              <span className="text-danger">
                24 horas.
              </span>
            </h1>

            <p className="lead text-white-50 mx-auto">
              Atención sanitaria urgente y acceso rápido a los servicios
              de emergencia cuando más lo necesitas.
            </p>

          </div>

        </div>

        <div className="urgencias-hero-glow"></div>
      </section>

      {/* EMERGENCIA */}
      <section className="container py-5">

        <div className="urgencias-emergency scroll-reveal">

          <div className="urgencias-emergency-content">

            <span className="urgencias-emergency-label">
              🚨 EMERGENCIA
            </span>

            <h2 className="text-white fw-bold mt-3 mb-3">
              ¿Necesitas asistencia médica inmediata?
            </h2>

            <p className="text-white-50 mb-4">
              Ante una emergencia de riesgo vital, actúa rápidamente y
              contacta con los servicios de emergencia.
            </p>

            <div className="d-flex gap-3 flex-wrap">

              <a
                href="tel:112"
                className="btn btn-danger btn-lg fw-bold px-4 urgencias-main-button"
              >
                📞 Llamar al 112
              </a>

              <a
                href="tel:061"
                className="btn btn-outline-danger btn-lg fw-bold px-4 urgencias-secondary-button"
              >
                🚑 Llamar al 061
              </a>

            </div>

          </div>

          <div className="urgencias-emergency-number">
            <span>112</span>
            <small>EMERGENCIAS</small>
          </div>

        </div>

      </section>

      {/* MAPA */}
      <section className="container py-5">

        <div className="urgencias-map-section scroll-reveal">

          <div className="row align-items-center g-5">

            <div className="col-lg-5">

              <span className="text-info small fw-semibold text-uppercase">
                Localización
              </span>

              <h2 className="text-white fw-bold mt-2 mb-3">
                Encuentra el centro de urgencias
                <span className="text-info">
                  {" "}más cercano.
                </span>
              </h2>

              <p className="text-white-50">
                Utiliza el mapa para localizar hospitales y centros con
                servicio de urgencias próximos a tu ubicación.
              </p>

              <button
                type="button"
                className="btn btn-info fw-bold mt-3 urgencias-location-button"
              >
                📍 Buscar centros cercanos
              </button>

              <div className="urgencias-map-info mt-4">

                <div className="urgencias-map-info-icon">
                  ✓
                </div>

                <div>
                  <strong className="text-white">
                    Servicios de urgencias
                  </strong>

                  <p className="text-white-50 mb-0 mt-1">
                    Consulta centros disponibles y su localización.
                  </p>
                </div>

              </div>

            </div>

            <div className="col-lg-7">

              <div className="urgencias-map">

                {/* GOOGLE MAPS */}
                <iframe
                  title="Mapa de centros de urgencias"
                  src="https://www.google.com/maps?q=hospitales%20Vigo%20Espa%C3%B1a&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div className="urgencias-map-overlay">
                  <span>🚑 Centros de urgencias</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};