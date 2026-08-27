import React, { useState, useEffect } from "react";

export const EpidemiologyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos simulados estructurados según el DataSet de JCyL (Enfermedades de Declaración Obligatoria - EDO)
  useEffect(() => {
    // Simulamos la petición a la API de Datos Abiertos de JCyL
    setTimeout(() => {
      setData([
        { id: 1, provincia: "Valladolid", enfermedad: "Gripe Aviar / Estacional", casos: 142, semana: "Semana 34", ano: 2026, estado: "Controlado" },
        { id: 2, provincia: "León", enfermedad: "COVID-19", casos: 89, semana: "Semana 34", ano: 2026, estado: "En Seguimiento" },
        { id: 3, provincia: "Burgos", enfermedad: "Varicela", casos: 23, semana: "Semana 33", ano: 2026, estado: "Bajo" },
        { id: 4, provincia: "Salamanca", enfermedad: "Gripe Aviar / Estacional", casos: 98, semana: "Semana 34", ano: 2026, estado: "Controlado" },
        { id: 5, provincia: "Zamora", enfermedad: "Tuberculosis", casos: 4, semana: "Semana 32", ano: 2026, estado: "Bajo" },
        { id: 6, provincia: "Palencia", enfermedad: "Campylobacteriosis", casos: 15, semana: "Semana 34", ano: 2026, estado: "Bajo" },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.enfermedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provincia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div 
        className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-4 shadow-lg text-white"
        style={{ backdropFilter: "blur(12px)" }}
      >
        {/* Encebezado del Componente */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold text-info mb-1 d-flex align-items-center gap-2">
              📊 Vigilancia Epidemiológica (Datos Abiertos JCyL)
            </h4>
            <p className="text-white-50 small mb-0">
              Registro oficial de Enfermedades de Declaración Obligatoria (EDO) — Junta de Castilla y León
            </p>
          </div>
          <span className="badge bg-primary bg-opacity-25 text-info border border-info px-3 py-2">
            API JCyL Conectada
          </span>
        </div>

        {/* Buscador / Filtro */}
        <div className="mb-3" style={{ maxWidth: "350px" }}>
          <input
            type="text"
            className="form-control bg-white bg-opacity-10 border-white border-opacity-25 text-white placeholder-white-50 rounded-3"
            placeholder="Filtrar por provincia o enfermedad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla Responsiva */}
        <div className="table-responsive">
          <table className="table table-dark table-hover bg-transparent align-middle mb-0">
            <thead>
              <tr className="border-bottom border-white border-opacity-25 text-info">
                <th>Provincia</th>
                <th>Enfermedad (EDO)</th>
                <th>Casos Registrados</th>
                <th>Periodo</th>
                <th>Estado Sanitario</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-white-50">
                    Cargando datos epidemiológicos...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="border-bottom border-white border-opacity-10">
                    <td className="fw-semibold text-white">{row.provincia}</td>
                    <td>{row.enfermedad}</td>
                    <td className="fw-bold text-warning">{row.casos}</td>
                    <td className="text-white-50 small">{row.semana} ({row.ano})</td>
                    <td>
                      <span
                        className={`badge bg-opacity-25 border px-2 py-1 ${
                          row.estado === "Controlado"
                            ? "bg-success text-success border-success"
                            : row.estado === "En Seguimiento"
                            ? "bg-warning text-warning border-warning"
                            : "bg-info text-info border-info"
                        }`}
                      >
                        {row.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-white-50">
                    No se encontraron registros coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};