import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center">

            <section className="container py-5">
                <div className="row justify-content-center">

                    <div className="col-12 col-sm-10 col-md-8 col-lg-5">

                        <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5 scroll-reveal">

                            {/* CABECERA */}
                            <div className="text-center mb-4">

                                <div
                                    className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4 mb-3"
                                    style={{ width: "56px", height: "56px" }}
                                >
                                    ✚
                                </div>

                                <h1 className="h2 fw-bold mb-2">
                                    Crear una cuenta
                                </h1>

                                <p className="text-white-50 small mb-0">
                                    Regístrate en el Sistema Nacional de Salud
                                </p>

                            </div>

                            {/* SELECTOR */}
                            <div className="mb-4">

                                <span className="text-info small fw-semibold text-uppercase d-block mb-2">
                                    Tipo de usuario
                                </span>

                                <div
                                    className="btn-group w-100"
                                    role="group"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setTipoUsuario("paciente")}
                                        className={`btn rounded-start-pill fw-semibold ${tipoUsuario === "paciente"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                            }`}
                                    >
                                        🔒 Paciente
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTipoUsuario("medico")}
                                        className={`btn rounded-end-pill fw-semibold ${tipoUsuario === "medico"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                            }`}
                                    >
                                        👨‍⚕️ Médico
                                    </button>
                                </div>

                            </div>

                            {/* FORMULARIO */}
                            <form className="text-start">

                                <div className="row g-3">

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Nombre"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Apellidos
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Apellidos"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            DNI
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Ingrese su DNI"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Correo electrónico
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Teléfono
                                        </label>

                                        <input
                                            type="tel"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="+34600000000"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Fecha de nacimiento
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control bg-dark text-white border-secondary"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Sexo
                                        </label>

                                        <select className="form-select bg-dark text-white border-secondary">
                                            <option value="">
                                                Seleccione
                                            </option>
                                            <option value="M">
                                                Masculino
                                            </option>
                                            <option value="F">
                                                Femenino
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Grupo sanguíneo
                                        </label>

                                        <select className="form-select bg-dark text-white border-secondary">
                                            <option value="">
                                                Seleccione
                                            </option>

                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            CIP
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Código CIP"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Contraseña
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control bg-dark text-white border-secondary"
                                                placeholder="••••••••••••"
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary text-white"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? "🙈" : "👁️"}
                                            </button>

                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Repite la contraseña
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control bg-dark text-white border-secondary"
                                                placeholder="Repite tu contraseña"
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary text-white"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword
                                                    ? "🙈"
                                                    : "👁️"}
                                            </button>

                                        </div>
                                    </div>

                                    <div className="col-12">

                                        <button
                                            type="submit"
                                            className="btn btn-info rounded-pill fw-bold w-100 py-2 mt-2"
                                        >
                                            Crear cuenta →
                                        </button>

                                    </div>

                                </div>

                            </form>

                            {/* PIE */}
                            <div className="text-center mt-4 pt-3 border-top border-secondary">

                                <p className="text-white-50 small mb-2">
                                    ¿Ya tienes una cuenta?
                                </p>

                                <Link
                                    to="/login"
                                    className="text-info text-decoration-none small fw-bold"
                                >
                                    Inicia sesión aquí
                                </Link>

                            </div>

                            <div className="text-center mt-3">

                                <span className="text-white-50 small">
                                    🔒 Conexión segura y protegida
                                </span>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};