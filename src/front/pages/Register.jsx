import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

// Datos de los pacientes pre-registrados en el sistema (sin credenciales ni datos privados)
const pacientesRegistrados = [
    {
        first_name: "Ana",
        last_name: "García López",
        dni: "12345678Z",
        date_of_birth: "1988-04-15",
        sex: "F",
        is_active: true,
        cip: "CIP000001"
    },
    {
        first_name: "Carlos",
        last_name: "Martínez Ruiz",
        dni: "23456789D",
        date_of_birth: "1975-09-22",
        sex: "M",
        is_active: true,
        cip: "CIP000002"
    },
    {
        first_name: "Laura",
        last_name: "Sánchez Martín",
        dni: "34567890V",
        date_of_birth: "1995-02-10",
        sex: "F",
        is_active: true,
        cip: "CIP000003"
    },
    {
        first_name: "Miguel",
        last_name: "Fernández García",
        dni: "45678901G",
        date_of_birth: "1968-11-30",
        sex: "M",
        is_active: true,
        cip: "CIP000004"
    },
    {
        first_name: "Marta",
        last_name: "López Rodríguez",
        dni: "56789012B",
        date_of_birth: "2001-07-18",
        sex: "F",
        is_active: true,
        cip: "CIP000005"
    },
    {
        first_name: "David",
        last_name: "Navarro Pérez",
        dni: "67890123N",
        date_of_birth: "1982-04-03",
        sex: "M",
        is_active: true,
        cip: "CIP000006"
    },
    {
        first_name: "Sofía",
        last_name: "Romero Díaz",
        dni: "78901234X",
        date_of_birth: "1990-12-25",
        sex: "F",
        is_active: true,
        cip: "CIP000007"
    },
    {
        first_name: "Jorge",
        last_name: "Molina Sánchez",
        dni: "89012345E",
        date_of_birth: "1959-06-12",
        sex: "M",
        is_active: true,
        cip: "CIP000008"
    },
    {
        first_name: "Elena",
        last_name: "Castro Moreno",
        dni: "90123456W",
        date_of_birth: "1979-03-27",
        sex: "F",
        is_active: true,
        cip: "CIP000009"
    },
    {
        first_name: "Pablo",
        last_name: "Ortega Jiménez",
        dni: "01234567L",
        date_of_birth: "1998-10-05",
        sex: "M",
        is_active: true,
        cip: "CIP000010"
    }
];

export const Register = () => {
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        sex: "",
        bloodType: "",
        cip: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [pacienteValido, setPacienteValido] = useState(false);

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

    // Buscar paciente automáticamente cuando cambia el DNI
    const handleDniChange = (e) => {
        const dniIngresado = e.target.value.toUpperCase().trim();

        setFormData((prev) => ({
            ...prev,
            dni: dniIngresado
        }));

        if (dniIngresado.length === 9) {
            const paciente = pacientesRegistrados.find((p) => p.dni === dniIngresado);

            if (paciente) {
                setFormData((prev) => ({
                    ...prev,
                    firstName: paciente.first_name,
                    lastName: paciente.last_name,
                    dateOfBirth: paciente.date_of_birth,
                    sex: paciente.sex,
                    cip: paciente.cip
                }));
                setPacienteValido(true);
                setError("");
            } else {
                setPacienteValido(false);
                setError("El DNI ingresado no existe en el registro del SNS.");
            }
        } else {
            setPacienteValido(false);
            setError("");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pacienteValido && tipoUsuario === "paciente") {
            setError("Debes ingresar un DNI válido para registrarte.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        alert(`Registro exitoso para ${formData.firstName} ${formData.lastName}`);
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
                                    <Icon name="UserPlus" size={28} />
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
                                        <Icon name="LockKeyhole" className="me-2" />Paciente
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTipoUsuario("medico")}
                                        className={`btn rounded-end-pill fw-semibold ${tipoUsuario === "medico"
                                            ? "btn-info"
                                            : "btn-outline-secondary text-white"
                                            }`}
                                    >
                                        <Icon name="Stethoscope" className="me-2" />Médico
                                    </button>
                                </div>

                            </div>

                            {/* FORMULARIO */}
                            <form className="text-start" onSubmit={handleSubmit} autoComplete="off">

                                <div className="row g-3">

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            DNI
                                        </label>

                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleDniChange}
                                            maxLength={9}
                                            autoComplete="off"
                                            className="form-control bg-dark text-white border-secondary text-uppercase"
                                            placeholder="Ingrese su DNI (ej: 12345678Z)"
                                        />
                                    </div>

                                    {error && (
                                        <div className="col-12">
                                            <div className="alert alert-danger bg-danger bg-opacity-25 text-danger border-danger border-opacity-50 py-2 small mb-0">
                                                {error}
                                            </div>
                                        </div>
                                    )}

                                    {pacienteValido && (
                                        <div className="col-12">
                                            <div className="alert alert-success bg-success bg-opacity-25 text-success border-success border-opacity-50 py-2 small mb-0">
                                                <Icon name="Check" className="me-1" />DNI verificado en el sistema.
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            readOnly={pacienteValido}
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
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            readOnly={pacienteValido}
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Apellidos"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Correo electrónico
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="off"
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
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="off"
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
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            readOnly={pacienteValido}
                                            className="form-control bg-dark text-white border-secondary"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Sexo
                                        </label>

                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            disabled={pacienteValido}
                                            className="form-select bg-dark text-white border-secondary"
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

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            Grupo sanguíneo
                                        </label>

                                        <select
                                            name="bloodType"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                            className="form-select bg-dark text-white border-secondary"
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

                                    <div className="col-12">
                                        <label className="form-label text-white-50 small">
                                            CIP
                                        </label>

                                        <input
                                            type="text"
                                            name="cip"
                                            value={formData.cip}
                                            onChange={handleChange}
                                            readOnly={pacienteValido}
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
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
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
                                                <Icon name={showPassword ? "EyeOff" : "Eye"} />
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
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                autoComplete="new-password"
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
                                                <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} />
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
                                    <Icon name="LockKeyhole" className="me-1" />Conexión segura y protegida
                                </span>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};