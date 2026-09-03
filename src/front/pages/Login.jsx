import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion, getDashboard } from "../services/authServices";

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("paciente");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError("Por favor, completa todos los campos"); return; }
        try {
            setError(""); const data = await iniciarSesion({ email, password });
            console.log("Usuario autenticado:", data);
            localStorage.setItem("access_token", data.access_token);
            const dashboard = await getDashboard(data.access_token);
            console.log("Dashboard:", dashboard); if (dashboard.dashboard === "doctor") { navigate("/dashboard/doctor"); } else if (dashboard.dashboard === "patient") { navigate("/dashboard/patient"); }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center p-3"
            style={{
                background:
                    "radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 70%, #090d16 100%)",
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            <div
                className="card text-white border border-white border-opacity-25 rounded-4 shadow-lg p-4"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                }}
            >
                {/* Logo / título */}
                <div className="text-center mb-4">
                    <div className="fs-1 mb-2">✚</div>

                    <h2 className="fw-bold mb-1">
                        Sistema Nacional de Salud
                    </h2>

                    <p className="text-white-50 mb-0">
                        Portal del paciente
                    </p>
                </div>

                {/* Selector Paciente / Médico */}
                <div className="d-flex mb-4 p-1 rounded-pill bg-white bg-opacity-10">

                    <button
                        type="button"
                        onClick={() => setTipoUsuario("paciente")}
                        className="btn rounded-pill flex-fill border-0"
                        style={{
                            background:
                                tipoUsuario === "paciente" ? "#0284c7" : "transparent",
                            color: "white",
                        }}
                    >
                        🔒 Paciente
                    </button>

                    <button
                        type="button"
                        onClick={() => setTipoUsuario("medico")}
                        className="btn rounded-pill flex-fill border-0"
                        style={{
                            background:
                                tipoUsuario === "medico" ? "#0284c7" : "transparent",
                            color: "white",
                        }}
                    >
                        👨‍⚕️ Médico
                    </button>

                </div>

                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Email / CIP / DNI
                        </label>

                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Ingrese su email, CIP o DNI"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 border-0 shadow-sm"
                        style={{ background: "#0284c7" }}
                    >
                        Iniciar Sesión
                    </button>
                </form>

                {/* Recuperar contraseña */}
                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link text-white text-decoration-none"
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-white-50">
                        ¿No eres usuario?{" "}
                    </span>

                    <Link
                        to="/registro"
                        className="btn btn-link p-0 text-info text-decoration-none fw-bold"
                    >
                        Regístrate aquí
                    </Link>
                </div>

                {/* Seguridad */}
                <div className="text-center mt-3 text-white-50">
                    🔒 Conexión segura y protegida
                </div>
            </div>
        </div>
    );
};