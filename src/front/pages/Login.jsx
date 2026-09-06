import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion, getDashboard } from "../services/authServices";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("paciente");

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
            });

            dispatch({
                type: "login",
                payload: {
                    user: data.user || null,
                    access_token: data.access_token,
                },
            });

            const dashboard = await getDashboard(data.access_token);

            if (dashboard.dashboard === "doctor") {
                navigate("/");
            } else if (dashboard.dashboard === "patient") {
                navigate("/dashboard/patient");
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className="login-page">

            

            {/* LOGIN */}
            <section className="login-section">
                <div className="container">

                    <div className="login-card glass-card scroll-reveal">

                        {/* CABECERA */}
                        <div className="login-card-header text-center">

                            <div className="login-icon">
                                ✚
                            </div>

                            <h2>
                                Iniciar sesión
                            </h2>

                            <p>
                                Accede a tu cuenta de LEXDIBRI
                            </p>

                        </div>

                        {/* SELECTOR PACIENTE / MÉDICO */}
                        <div className="login-user-selector">

                            <button
                                type="button"
                                onClick={() => setTipoUsuario("paciente")}
                                className={
                                    tipoUsuario === "paciente"
                                        ? "login-user-option active"
                                        : "login-user-option"
                                }
                            >
                                <span>🔒</span>
                                Paciente
                            </button>

                            <button
                                type="button"
                                onClick={() => setTipoUsuario("medico")}
                                className={
                                    tipoUsuario === "medico"
                                        ? "login-user-option active"
                                        : "login-user-option"
                                }
                            >
                                <span>👨‍⚕️</span>
                                Médico
                            </button>

                        </div>

                        {/* FORMULARIO */}
                        <form onSubmit={handleLogin}>

                            {/* EMAIL */}
                            <div className="login-form-group">
                                <label htmlFor="login-email">
                                    Email / CIP / DNI
                                </label>

                                <input
                                    id="login-email"
                                    type="text"
                                    className="login-input"
                                    placeholder="Ingrese su email, CIP o DNI"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />
                            </div>

                            {/* CONTRASEÑA */}
                            <div className="login-form-group">
                                <label htmlFor="login-password">
                                    Contraseña
                                </label>

                                <input
                                    id="login-password"
                                    type="password"
                                    className="login-input"
                                    placeholder="Ingrese su contraseña"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}

                            {/* BOTÓN */}
                            <button
                                type="submit"
                                className="login-submit"
                            >
                                Iniciar sesión
                            </button>

                        </form>

                        {/* RECUPERAR CONTRASEÑA */}
                        <div className="login-forgot">
                            <button type="button">
                                ¿Olvidó su contraseña?
                            </button>
                        </div>

                        {/* REGISTRO */}
                        <div className="login-register">
                            <span>
                                ¿No eres usuario?{" "}
                            </span>

                            <Link to="/registro">
                                Regístrate aquí
                            </Link>
                        </div>

                        {/* SEGURIDAD */}
                        <div className="login-security">
                            <span>🔒</span>
                            Conexión segura y protegida
                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};