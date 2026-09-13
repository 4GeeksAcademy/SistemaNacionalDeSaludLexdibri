import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card shadow-lg border-0 glass-card p-4 p-md-5 w-100 text-start" style={{ maxWidth: "850px" }}>
                
                {/* CABECERA */}
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-2 mb-3" style={{ width: "40px", height: "40px" }}>
                        ✚
                    </div>
                    <h2 className="fw-bold text-white">Crear una cuenta</h2>
                    <p className="text-light opacity-75 small">Regístrate en el Sistema Nacional de Salud</p>
                </div>

                {/* SELECTOR PACIENTE / MÉDICO */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            onClick={() => setTipoUsuario("paciente")}
                            className={`btn ${tipoUsuario === "paciente" ? "btn-light text-primary fw-bold" : "btn-outline-light"}`}
                        >
                            🔒 Paciente
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipoUsuario("medico")}
                            className={`btn ${tipoUsuario === "medico" ? "btn-light text-primary fw-bold" : "btn-outline-light"}`}
                        >
                            👨‍⚕️ Médico
                        </button>
                    </div>
                </div>

                {/* FORMULARIO GRID */}
                <form className="text-start">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-white small">Nombre</label>
                                <input type="text" className="form-control" placeholder="Nombre" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">DNI</label>
                                <input type="text" className="form-control" placeholder="Ingrese su DNI" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Correo electrónico</label>
                                <input type="email" className="form-control" placeholder="ejemplo@correo.com" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Teléfono</label>
                                <input type="tel" className="form-control" placeholder="+34600000000" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Fecha de nacimiento</label>
                                <input type="date" className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">CIP</label>
                                <input type="text" className="form-control" placeholder="Código CIP" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Contraseña</label>
                                <div className="input-group">
                                    <input type={showPassword ? "text" : "password"} className="form-control" placeholder="••••••••••••" />
                                    <button type="button" className="btn btn-light" onClick={() => setShowPassword(!showPassword)}>
                                        👁️
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Repite la contraseña</label>
                                <div className="input-group">
                                    <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Repite tu contraseña" />
                                    <button type="button" className="btn btn-light" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        👁️
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-light text-primary fw-bold w-100 mt-2">
                                Crear cuenta
                            </button>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-white small">Apellidos</label>
                                <input type="text" className="form-control" placeholder="Apellidos" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Sexo</label>
                                <select className="form-select">
                                    <option value="">Seleccione</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white small">Grupo sanguíneo</label>
                                <select className="form-select">
                                    <option value="">Seleccione</option>
                                    <option value="A+">A+</option>
                                    <option value="O+">O+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                {/* PIE */}
                <div className="text-center mt-4">
                    <span className="text-white small">¿Ya tienes una cuenta? </span>
                    <Link to="/login" className="text-info text-decoration-none small fw-bold">
                        Inicia sesión aquí
                    </Link>
                </div>

                <div className="text-center mt-3 text-light opacity-75 small">
                    🔒 Conexión segura y protegida
                </div>
            </div>
        </div>
    );
};