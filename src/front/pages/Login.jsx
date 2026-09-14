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
        return () => elements.forEach((element) => observer.unobserve(element));
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

            navigate(data.dashboard === "doctor" ? "/dashboard/medico" : "/dashboard/paciente");
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card shadow-lg border-0 glass-card p-4 p-md-5 scroll-reveal w-100 text-start" style={{ maxWidth: "450px" }}>
                
                {/* CABECERA */}
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-2 mb-3" style={{ width: "40px", height: "40px" }}>
                        ✚
                    </div>
                    <h2 className="fw-bold text-white">Iniciar sesión</h2>
                    <p className="text-light opacity-75 small">Accede a tu cuenta de LEXDIBRI</p>
                </div>

                {/* SELECTOR PACIENTE / MÉDICO */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group w-100" role="group">
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

                {/* FORMULARIO */}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="login-email" className="form-label text-white small">
                            Email / CIP / DNI
                        </label>
                        <input
                            id="login-email"
                            type="text"
                            className="form-control"
                            placeholder="Ingrese su email, CIP o DNI"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="login-password" className="form-label text-white small">
                            Contraseña
                        </label>
                        <div className="input-group">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                    <button type="submit" className="btn btn-light text-primary fw-bold w-100 py-2 mt-2">
                        Iniciar sesión
                    </button>
                </form>

                {/* OPCIONES */}
                <div className="text-center mt-3">
                    <button type="button" className="btn btn-link p-0 text-info text-decoration-none small">
                        ¿Olvidó su contraseña?
                    </button>
                </div>

                <div className="text-center mt-3 small">
                    <span className="text-white">¿No eres usuario? </span>
                    <Link to="/register" className="text-info text-decoration-none fw-bold">
                        Regístrate aquí
                    </Link>
                </div>

                <div className="text-center mt-4 pt-3 border-top border-secondary small text-light opacity-75">
                    🔒 Conexión segura y protegida
                </div>
            </div>
        </div>
    );
};