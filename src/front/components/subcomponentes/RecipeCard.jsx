import React from "react";

export const RecipeCard = ({ receta }) => {
  const isActiva = receta.estado === "Activa";
  return (
    <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10 d-flex justify-content-between align-items-center">
      <div>
        <h6 className="fw-bold mb-1 text-white">{receta.medicamento}</h6>
        <p className="mb-0 text-white-50 small">
          <strong>Dosis:</strong> {receta.dosis}
        </p>
        <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>
          {receta.duracion}
        </span>
      </div>
      <span className={`badge ${isActiva ? "bg-success text-success" : "bg-secondary text-secondary"} bg-opacity-25 border border-${isActiva ? "success" : "secondary"}`}>
        {receta.estado}
      </span>
    </div>
  );
};