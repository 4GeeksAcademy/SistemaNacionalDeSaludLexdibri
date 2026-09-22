import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrarUsuario } from "../services/authServices";

export const Register = () => {
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [especialidades, setEspecialidades] = useState([]);
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
    const [errorEspecialidades, setErrorEspecialidades] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm_password");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setSubmitting(true);
        try {
            await registrarUsuario({
                role: tipoUsuario === "medico" ? "doctor" : "patient",
                firstName: formData.get("first_name"),
                lastName: formData.get("last_name"),
                dni: formData.get("dni"),
                email: formData.get("email"),
                password,
                phone: formData.get("phone"),
                dateOfBirth: formData.get("date_of_birth"),
                sex: formData.get("sex"),
                cip: formData.get("cip"),
                bloodType: formData.get("blood_type"),
                medicalLicense: formData.get("medical_license"),
                specialtyId: formData.get("specialty_id"),
                yearsExperience: formData.get("years_experience") || 0
            });
            setSuccess("Cuenta creada correctamente. Ya puedes iniciar sesión.");
            event.currentTarget.reset();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSubmitting(false);
        }
    };

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

    useEffect(() => {
        if (tipoUsuario !== "medico") return;

        const cargarEspecialidades = async () => {
            setLoadingEspecialidades(true);
            setErrorEspecialidades("");

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/especialidades`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "No se pudieron cargar las especialidades."
                    );
                }

                setEspecialidades(data.especialidades || []);
            } catch (loadError) {
                setErrorEspecialidades(loadError.message);
                setEspecialidades([]);
            } finally {
                setLoadingEspecialidades(false);
            }
        };

        cargarEspecialidades();
    }, [tipoUsuario]);

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
                            <form className="text-start" onSubmit={handleSubmit}>

                                <div className="row g-3">

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
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
                                            name="last_name"
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
                                            name="dni"
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
                                            name="email"
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
                                            name="phone"
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
                                            name="date_of_birth"
                                            className="form-control bg-dark text-white border-secondary"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Sexo
                                        </label>

                                        <select name="sex" className="form-select bg-dark text-white border-secondary" required>
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

                                        <select name="blood_type" className="form-select bg-dark text-white border-secondary" required>
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
                                            name="cip"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Código CIP"
                                        />
                                    </div>

                                    {tipoUsuario === "medico" && (
                                        <>
                                            <div className="col-12">
                                                <label className="form-label text-white-50 small">
                                                    Número de colegiado
                                                </label>
                                                <input
                                                    type="text"
                                                    name="medical_license"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    placeholder="Número de colegiado"
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label text-white-50 small">
                                                    Especialidad
                                                </label>
                                                <select
                                                    name="specialty_id"
                                                    className="form-select bg-dark text-white border-secondary"
                                                    defaultValue=""
                                                    required
                                                    disabled={loadingEspecialidades || especialidades.length === 0}
                                                >
                                                    <option value="">
                                                        {loadingEspecialidades
                                                            ? "Cargando especialidades..."
                                                            : "Seleccione una especialidad"}
                                                    </option>
                                                    {especialidades.map((especialidad) => (
                                                        <option key={especialidad.id} value={especialidad.id}>
                                                            {especialidad.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errorEspecialidades && (
                                                    <div className="text-danger small mt-2">
                                                        {errorEspecialidades}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label text-white-50 small">
                                                    Años de experiencia
                                                </label>
                                                <input
                                                    type="number"
                                                    name="years_experience"
                                                    min="0"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    placeholder="Años de experiencia"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

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
                                                name="password"
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
                                                name="confirm_password"
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

                                    {error && <div className="col-12"><div className="alert alert-danger mb-0">{error}</div></div>}
                                    {success && <div className="col-12"><div className="alert alert-success mb-0">{success}</div></div>}

                                    <div className="col-12">

                                        <button
                                            type="submit"
                                            className="btn btn-info rounded-pill fw-bold w-100 py-2 mt-2"
                                        >
                                            {submitting ? "Creando cuenta..." : "Crear cuenta →"}
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