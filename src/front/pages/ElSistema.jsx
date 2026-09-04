import React from "react";

export const ElSistema = () => {
  return (
    <div className="container text-white py-4">
      <h2 className="fw-bold mb-1">🏛️ El Sistema Nacional de Salud</h2>
      <p className="text-secondary mb-4">Estructura organizativa e interoperabilidad entre comunidades autónomas</p>

      <div className="p-4 bg-dark border border-secondary rounded-3 mb-4">
        <h5 className="text-white fw-bold">Red del Sistema Nacional de Salud</h5>
        <p className="text-secondary small mb-3">
          El SNS garantiza la equidad y calidad de las prestaciones sanitarias públicas mediante la integración de las 17 Comunidades Autónomas.
        </p>
        <div className="row text-center g-3">
          <div className="col-4">
            <div className="p-2 border border-secondary rounded bg-black bg-opacity-20">
              <h3 className="text-info m-0">17</h3>
              <small className="text-secondary">Servicios Regionales</small>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 border border-secondary rounded bg-black bg-opacity-20">
              <h3 className="text-info m-0">100%</h3>
              <small className="text-secondary">Receta Electrónica Conectada</small>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 border border-secondary rounded bg-black bg-opacity-20">
              <h3 className="text-info m-0">24/7</h3>
              <small className="text-secondary">Acceso al Historial</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};