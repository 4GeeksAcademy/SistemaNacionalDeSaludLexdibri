import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authServices";

export const Register = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState("patient");

    // Campos comunes
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [sex, setSex] = useState("");

    // Campos de paciente
    const [cip, setCip] = useState("");
    const [bloodType, setBloodType] = useState("");

    // Campos de médico
    const [medicalLicense, setMedicalLicense] = useState("");
    const [specialtyId, setSpecialtyId] = useState("");
    const [yearsExperience, setYearsExperience] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Visibilidad de contraseñas
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

    function validarContrasenas(password, confirmPassword) {
        if (
            password !== confirmPassword &&
            confirmPassword !== "" &&
            password !== ""
        ) {
            setError("Las contraseñas no coinciden");
        } else {
            setError("");
        }
    }

    const handleRegistro = async (e) => {
        e.preventDefault();

        if (
            !firstName ||
            !lastName ||
            !dni ||
            !email ||
            !password ||
            !phone ||
            !dateOfBirth ||
            !sex
        ) {
            setError("Por favor, completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (role === "patient" && (!cip || !bloodType)) {
            setError("Completa el CIP y grupo sanguíneo");
            return;
        }

        if (
            role === "doctor" &&
            (!medicalLicense || !specialtyId || !yearsExperience)
        ) {
            setError(
                "Completa la colegiatura, especialidad y años de experiencia"
            );
            return;
        }

        setError("");
        setLoading(true);

        try {
            await registrarUsuario({
                role,
                firstName,
                lastName,
                dni,
                email,
                password,
                phone,
                dateOfBirth,
                sex,
                cip,
                bloodType,
                medicalLicense,
                specialtyId,
                yearsExperience,
            });

            alert("Registro realizado correctamente");
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* REGISTRO */}
            <section className="register-section">
                <div className="container">

                    <div className="register-card glass-card scroll-reveal">

                        {/* CABECERA */}
                        <div className="register-card-header text-center">

                            <div className="register-icon">
                                ✚
                            </div>

                            <h2>
                                Crear una cuenta
                            </h2>

                            <p>
                                Regístrate en el Sistema Nacional de Salud
                            </p>

                        </div>

                        {/* SELECTOR DE ROL */}
                        <div className="register-user-selector">

                            <button
                                type="button"
                                onClick={() => setRole("patient")}
                                className={
                                    role === "patient"
                                        ? "register-user-option active"
                                        : "register-user-option"
                                }
                            >
                                <span>🔒</span>
                                Paciente
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("doctor")}
                                className={
                                    role === "doctor"
                                        ? "register-user-option active"
                                        : "register-user-option"
                                }
                            >
                                <span>👨‍⚕️</span>
                                Médico
                            </button>

                        </div>

                        {/* FORMULARIO */}
                        <form onSubmit={handleRegistro}>

                            {/* NOMBRE Y APELLIDOS */}
                            <div className="row">

                                <div className="col-md-6">
                                    <div className="register-form-group">
                                        <label htmlFor="register-first-name">
                                            Nombre
                                        </label>

                                        <input
                                            id="register-first-name"
                                            type="text"
                                            className="register-input"
                                            placeholder="Nombre"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="register-form-group">
                                        <label htmlFor="register-last-name">
                                            Apellidos
                                        </label>

                                        <input
                                            id="register-last-name"
                                            type="text"
                                            className="register-input"
                                            placeholder="Apellidos"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* DNI */}
                            <div className="register-form-group">
                                <label htmlFor="register-dni">
                                    DNI
                                </label>

                                <input
                                    id="register-dni"
                                    type="text"
                                    className="register-input"
                                    placeholder="Ingrese su DNI"
                                    value={dni}
                                    onChange={(e) =>
                                        setDni(e.target.value)
                                    }
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="register-form-group">
                                <label htmlFor="register-email">
                                    Correo electrónico
                                </label>

                                <input
                                    id="register-email"
                                    type="email"
                                    className="register-input"
                                    placeholder="Ingrese su correo"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />
                            </div>

                            {/* TELÉFONO Y SEXO */}
                            <div className="row">

                                <div className="col-md-6">
                                    <div className="register-form-group">
                                        <label htmlFor="register-phone">
                                            Teléfono
                                        </label>

                                        <input
                                            id="register-phone"
                                            type="tel"
                                            className="register-input"
                                            placeholder="+34600000000"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="register-form-group">
                                        <label htmlFor="register-sex">
                                            Sexo
                                        </label>

                                        <select
                                            id="register-sex"
                                            className="register-input"
                                            value={sex}
                                            onChange={(e) =>
                                                setSex(e.target.value)
                                            }
                                        >
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
                                </div>

                            </div>

                            {/* FECHA DE NACIMIENTO */}
                            <div className="register-form-group">
                                <label htmlFor="register-birth">
                                    Fecha de nacimiento
                                </label>

                                <input
                                    id="register-birth"
                                    type="date"
                                    className="register-input"
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                        setDateOfBirth(e.target.value)
                                    }
                                />
                            </div>

                            {/* CAMPOS PACIENTE */}
                            {role === "patient" && (
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="register-form-group">
                                            <label htmlFor="register-cip">
                                                CIP
                                            </label>

                                            <input
                                                id="register-cip"
                                                type="text"
                                                className="register-input"
                                                placeholder="Código CIP"
                                                value={cip}
                                                onChange={(e) =>
                                                    setCip(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="register-form-group">
                                            <label htmlFor="register-blood">
                                                Grupo sanguíneo
                                            </label>

                                            <select
                                                id="register-blood"
                                                className="register-input"
                                                value={bloodType}
                                                onChange={(e) =>
                                                    setBloodType(e.target.value)
                                                }
                                            >
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
                                    </div>

                                </div>
                            )}

                            {/* CAMPOS MÉDICO */}
                            {role === "doctor" && (
                                <>
                                    <div className="register-form-group">
                                        <label htmlFor="register-license">
                                            Número de colegiatura
                                        </label>

                                        <input
                                            id="register-license"
                                            type="text"
                                            className="register-input"
                                            placeholder="COL12345"
                                            value={medicalLicense}
                                            onChange={(e) =>
                                                setMedicalLicense(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="row">

                                        <div className="col-md-6">
                                            <div className="register-form-group">
                                                <label htmlFor="register-specialty">
                                                    ID de especialidad
                                                </label>

                                                <input
                                                    id="register-specialty"
                                                    type="number"
                                                    className="register-input"
                                                    placeholder="1"
                                                    value={specialtyId}
                                                    onChange={(e) =>
                                                        setSpecialtyId(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="register-form-group">
                                                <label htmlFor="register-experience">
                                                    Años de experiencia
                                                </label>

                                                <input
                                                    id="register-experience"
                                                    type="number"
                                                    className="register-input"
                                                    placeholder="5"
                                                    value={yearsExperience}
                                                    onChange={(e) =>
                                                        setYearsExperience(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </>
                            )}

                            {/* CONTRASEÑA */}
                            <div className="register-form-group">
                                <label htmlFor="register-password">
                                    Contraseña
                                </label>

                                <div className="password-input-wrapper">
                                    <input
                                        id="register-password"
                                        type={showPassword ? "text" : "password"}
                                        className="register-input"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            validarContrasenas(
                                                e.target.value,
                                                confirmPassword
                                            );
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle-btn"
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

                            {/* CONFIRMAR CONTRASEÑA */}
                            <div className="register-form-group">
                                <label htmlFor="register-confirm-password">
                                    Repite la contraseña
                                </label>

                                <div className="password-input-wrapper">
                                    <input
                                        id="register-confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="register-input"
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(
                                                e.target.value
                                            );
                                            validarContrasenas(
                                                password,
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Ocultar contraseña"
                                                : "Mostrar contraseña"
                                        }
                                    >
                                        {showConfirmPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="register-error">
                                    {error}
                                </div>
                            )}

                            {/* BOTÓN */}
                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Registrando..."
                                    : "Crear cuenta"}
                            </button>

                        </form>

                        {/* LOGIN */}
                        <div className="register-login">
                            <span>
                                ¿Ya tienes una cuenta?{" "}
                            </span>

                            <Link to="/login">
                                Inicia sesión aquí
                            </Link>
                        </div>

                        {/* SEGURIDAD */}
                        <div className="register-security">
                            <span>🔒</span>
                            Conexión segura y protegida
                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};