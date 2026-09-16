import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authServices";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);

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
            { threshold: 0.2 }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            elements.forEach((element) => observer.unobserve(element));
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Por favor, completa todos los campos");
            return;
        }

        try {
            setError("");

            const data = await iniciarSesion({
                email,
                password,
                tipoUsuario,
            });

            localStorage.setItem("user", JSON.stringify(data.user));

            dispatch({
                type: "login",
                payload: {
                    user: data.user || null,
                    access_token: data.access_token,
                },
            });

            navigate(
                data.dashboard === "doctor"
                    ? "/dashboard/medico"
                    : "/dashboard/paciente"
            );
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className=" text-white min-vh-100 d-flex align-items-center">

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
                                    Iniciar sesión
                                </h1>

                                <p className="text-white-50 small mb-0">
                                    Accede a tu cuenta de LEXDIBRI
                                </p>

                            </div>

                            {/* SELECTOR PACIENTE / MÉDICO */}
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
                                        onClick={() =>
                                            setTipoUsuario("paciente")
                                        }
                                        className={`btn rounded-start-pill fw-semibold ${
                                            tipoUsuario === "paciente"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                        }`}
                                    >
                                        🔒 Paciente
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTipoUsuario("medico")
                                        }
                                        className={`btn rounded-end-pill fw-semibold ${
                                            tipoUsuario === "medico"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                        }`}
                                    >
                                        👨‍⚕️ Médico
                                    </button>
                                </div>

                            </div>

                            {/* FORMULARIO */}
                            <form onSubmit={handleLogin}>

                                <div className="mb-3">
                                    <label
                                        htmlFor="login-email"
                                        className="form-label text-white-50 small"
                                    >
                                        Email / CIP / DNI
                                    </label>

                                    <input
                                        id="login-email"
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Ingrese su email, CIP o DNI"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="login-password"
                                        className="form-label text-white-50 small"
                                    >
                                        Contraseña
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Ingrese su contraseña"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary text-white"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </button>

                                    </div>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="alert alert-danger py-2 small">
                                        {error}
                                    </div>
                                )}

                                {/* BOTÓN */}
                                <button
                                    type="submit"
                                    className="btn btn-info rounded-pill fw-bold w-100 py-2 mt-2"
                                >
                                    Iniciar sesión →
                                </button>

                            </form>

                            {/* RECUPERAR CONTRASEÑA */}
                            <div className="text-center mt-4">

                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-info text-decoration-none small"
                                >
                                    ¿Olvidó su contraseña?
                                </button>

                            </div>

                            {/* REGISTRO */}
                            <div className="text-center mt-3 small">

                                <span className="text-white-50">
                                    ¿No eres usuario?{" "}
                                </span>

                                <Link
                                    to="/register"
                                    className="text-info text-decoration-none fw-bold"
                                >
                                    Regístrate aquí
                                </Link>

                            </div>

                            {/* SEGURIDAD */}
                            <div className="text-center mt-4 pt-3 border-top border-secondary">

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