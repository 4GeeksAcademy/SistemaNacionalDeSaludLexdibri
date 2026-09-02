import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authServices";

export const Register = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState("patient"); // "patient" | "doctor"

    // Campos comunes
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
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

    function validarContrasenas(password, confirmPassword) {
        if (password !== confirmPassword && confirmPassword != "" && password != "") {
            setError("Las contraseñas no coinciden")
        }
        else {
            setError("")
        }
    }

    const handleRegistro = async (e) => {
        e.preventDefault();

        // Validación de campos comunes
        if (!firstName || !lastName || !dni || !email || !password || !phone || !dateOfBirth || !sex) {
            setError("Por favor, completa todos los campos");
            return;
        }

        // Validación específica por rol
        if (role === "patient" && (!cip || !bloodType)) {
            setError("Completa el CIP y grupo sanguíneo");
            return;
        }

        if (role === "doctor" && (!medicalLicense || !specialtyId || !yearsExperience)) {
            setError("Completa la colegiatura, especialidad y años de experiencia");
            return;
        }

        setError("");
        setLoading(true);

        // Payload base
        const payload = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            dni,
            phone,
            date_of_birth: dateOfBirth,
            sex,
            role
        };

        // Agregar campos según el rol
        if (role === "patient") {
            payload.cip = cip;
            payload.blood_type = bloodType;
        } else {
            payload.medical_license = medicalLicense;
            payload.specialty_id = Number(specialtyId);
            payload.years_experience = Number(yearsExperience);
        }

        // Crear usuario

        try {
            await registrarUsuario(payload);
            alert("Registro realizado correctamente");
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center p-3"
            style={{
                background:
                    "radial-gradient(ellipse at top, #1E3A8A 0%, #0F172A 70%, #090D16 100%)",
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            <div
                className="card text-white border border-white border-opacity-25 rounded-4 shadow-lg p-4"
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <div className="text-center mb-4">
                    <div className="fs-1 mb-2">✚</div>
                    <h2 className="fw-bold">Crear una cuenta</h2>
                    <p className="text-white-50">
                        Regístrate en el Sistema Nacional de Salud
                    </p>
                </div>

                {/* Selector de rol */}
                {/* Selector de rol */}
                <div className="d-flex mb-4 p-1 rounded-pill bg-white bg-opacity-10">

                    <button
                        type="button"
                        onClick={() => setRole("patient")}
                        className="btn rounded-pill flex-fill border-0"
                        style={{
                            background: role === "patient" ? "#0284c7" : "transparent",
                            color: "white",
                        }}
                    >
                        🔒 Paciente
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole("doctor")}
                        className="btn rounded-pill flex-fill border-0"
                        style={{
                            background: role === "doctor" ? "#0284c7" : "transparent",
                            color: "white",
                        }}
                    >
                        👨‍⚕️ Médico
                    </button>

                </div>

                <form onSubmit={handleRegistro}>

                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label fw-semibold">Nombre</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="col-6 mb-3">
                            <label className="form-label fw-semibold">Apellidos</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Apellidos"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">DNI</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Ingrese su DNI"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label fw-semibold">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control form-control-lg"
                                placeholder="+34600000000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="col-6 mb-3">
                            <label className="form-label fw-semibold">Sexo</label>
                            <select
                                className="form-control form-control-lg"
                                value={sex}
                                onChange={(e) => setSex(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Fecha de nacimiento</label>
                        <input
                            type="date"
                            className="form-control form-control-lg"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    {/* Campos dinámicos según el rol */}
                    {role === "patient" && (
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label className="form-label fw-semibold">CIP</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Código CIP"
                                    value={cip}
                                    onChange={(e) => setCip(e.target.value)}
                                />
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label fw-semibold">Grupo sanguíneo</label>
                                <select
                                    className="form-control form-control-lg"
                                    value={bloodType}
                                    onChange={(e) => setBloodType(e.target.value)}
                                >
                                    <option value="">Seleccione</option>
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
                    )}

                    {role === "doctor" && (
                        <>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Número de colegiatura</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="COL12345"
                                    value={medicalLicense}
                                    onChange={(e) => setMedicalLicense(e.target.value)}
                                />
                            </div>

                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label fw-semibold">ID de especialidad</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg"
                                        placeholder="1"
                                        value={specialtyId}
                                        onChange={(e) => setSpecialtyId(e.target.value)}
                                    />
                                </div>

                                <div className="col-6 mb-3">
                                    <label className="form-label fw-semibold">Años de experiencia</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg"
                                        placeholder="5"
                                        value={yearsExperience}
                                        onChange={(e) => setYearsExperience(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)
                                validarContrasenas(e.target.value,confirmPassword)
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Repita la Contraseña</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Contraseña"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                validarContrasenas(password, e.target.value)
                            }

                            }
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 border-0"
                        style={{ background: "#0284C7" }}
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-white-50">
                        ¿Ya tienes una cuenta?{" "}
                    </span>
                    <Link
                        to="/"
                        className="btn btn-link p-0 text-info text-decoration-none fw-bold"
                    >
                        Inicia sesión aquí
                    </Link>
                </div>

                <div className="text-center mt-3 text-white-50">
                    🔒 Conexión segura y protegida
                </div>
            </div>
        </div>
    );
};