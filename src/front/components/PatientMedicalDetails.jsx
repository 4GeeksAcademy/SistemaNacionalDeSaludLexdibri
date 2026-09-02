import React from "react";
import { RecipeCard, AppointmentCard } from "./patient";

export const PatientMedicalDetails = ({ 
  recetas = [], 
  citas = [], 
  onOpenTeleconsulta 
}) => {
  const recetasActivas = recetas.filter(r => r.estado === "Activa");

  return (
    <div className="container py-3">
      <div className="row g-4">
        
        {/* SECCIÓN 1: RECETAS */}
        <div className="col-12 col-lg-6">
          <div 
            className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white h-100"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-info d-flex align-items-center gap-2">
                💊 Mis Recetas
              </h5>
              <span className="badge bg-info bg-opacity-25 text-info border border-info">
                {recetasActivas.length} Vigentes
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {recetas.length > 0 ? (
                recetas.map((receta) => <RecipeCard key={receta.id} receta={receta} />)
              ) : (
                <p className="text-white-50 small text-center my-4">No hay recetas registradas.</p>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: CITAS */}
        <div className="col-12 col-lg-6">
          <div 
            className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-3 shadow-lg text-white h-100"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-info d-flex align-items-center gap-2">
                📅 Citas Programadas
              </h5>
              <span className="badge bg-success bg-opacity-25 text-success border border-success">
                {citas.length} Pendientes
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {citas.length > 0 ? (
                citas.map((cita) => (
                  <AppointmentCard 
                    key={cita.id} 
                    cita={cita} 
                    onOpenTeleconsulta={onOpenTeleconsulta} 
                  />
                ))
              ) : (
                <p className="text-white-50 small text-center my-4">No tienes citas programadas.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};