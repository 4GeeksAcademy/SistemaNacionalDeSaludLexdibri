
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authServices";
import { Icon } from "../components/Icon";

const EMPTY_FORM = {
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
};

export const Register = () => {
    const navigate = useNavigate();

    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [especialidades, setEspecialidades] = useState([]);
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
    const [errorEspecialidades, setErrorEspecialidades] = useState("");

    const [loadingDni, setLoadingDni] = useState(false);
    const [errorDni, setErrorDni] = useState("");

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [dniValido, setDniValido] = useState(false);

    const dniAbortRef = useRef(null);

    // ============================================================
    // ANIMACIÓN DE ENTRADA
    // ============================================================

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

    // ============================================================
    // CANCELAR COMPROBACIÓN DE DNI AL DESMONTAR
    // ============================================================

    useEffect(() => {
        return () => dniAbortRef.current?.abort();
    }, []);

    // ============================================================
    // CARGAR ESPECIALIDADES PARA MÉDICOS
    // ============================================================

    useEffect(() => {
        if (tipoUsuario !== "medico") {
            return;
        }

        const controller = new AbortController();

        const cargarEspecialidades = async () => {
            setLoadingEspecialidades(true);
            setErrorEspecialidades("");

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/especialidades`,
                    {
                        signal: controller.signal
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron cargar las especialidades."
                    );
                }

                setEspecialidades(data.especialidades || []);
            } catch (loadError) {
                if (loadError.name === "AbortError") {
                    return;
                }

                setErrorEspecialidades(loadError.message);
                setEspecialidades([]);
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingEspecialidades(false);
                }
            }
        };

        cargarEspecialidades();

        return () => controller.abort();
    }, [tipoUsuario]);

    // ============================================================
    // CAMBIAR TIPO DE USUARIO
    // ============================================================

    const handleTipoUsuarioChange = (tipo) => {
        dniAbortRef.current?.abort();

        setLoadingDni(false);
        setTipoUsuario(tipo);

        setError("");
        setSuccess("");
        setErrorDni("");
        setDniValido(false);

        setFormData({
            ...EMPTY_FORM
        });
    };

    // ============================================================
    // CAMBIOS GENERALES
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "confirmPassword") {
            setError("");
        }
    };

    // ============================================================
    // ESTADO DE CONTRASEÑAS
    // ============================================================

    const passwordMismatch =
        formData.confirmPassword.length > 0 &&
        formData.password !== formData.confirmPassword;

    const passwordsMatch =
        formData.password.length > 0 &&
        formData.confirmPassword.length > 0 &&
        formData.password === formData.confirmPassword;

    const passwordRequirements = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
        hasSpecial: /[^A-Za-z0-9]/.test(formData.password)
    };

    const passwordValid =
        passwordRequirements.minLength &&
        passwordRequirements.hasUppercase &&
        passwordRequirements.hasNumber &&
        passwordRequirements.hasSpecial;

    // ============================================================
    // VALIDACIÓN DEL DNI
    // ============================================================

    const handleDniChange = async (e) => {
        const dniIngresado = e.target.value
            .toUpperCase()
            .replace(/\s/g, "");

        dniAbortRef.current?.abort();
        setLoadingDni(false);

        setFormData((prev) => ({
            ...prev,
            dni: dniIngresado,
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            sex: "",
            cip: ""
        }));

        setDniValido(false);
        setError("");
        setErrorDni("");

        if (dniIngresado.length === 0) {
            return;
        }

        // ========================================================
        // VALIDACIÓN DEL FORMATO
        // ========================================================

        if (
            dniIngresado.length <= 8 &&
            !/^\d*$/.test(dniIngresado)
        ) {
            setErrorDni("DNI no válido.");
            return;
        }

        if (dniIngresado.length > 9) {
            setErrorDni("DNI no válido.");
            return;
        }

        if (dniIngresado.length === 9) {
            if (!/^\d{8}[A-Z]$/.test(dniIngresado)) {
                setErrorDni(
                    "DNI no válido. Debe tener 8 números y una letra."
                );
                return;
            }

            // ====================================================
            // COMPROBAR DNI EN BACKEND
            // ====================================================

            const controller = new AbortController();
            dniAbortRef.current = controller;

            setLoadingDni(true);

            const rolBackend =
                tipoUsuario === "medico"
                    ? "doctor"
                    : "patient";

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/registration-dni/${encodeURIComponent(
                        dniIngresado
                    )}?role=${rolBackend}`,
                    {
                        signal: controller.signal
                    }
                );

                let data = {};

                try {
                    data = await response.json();
                } catch {
                    data = {};
                }

                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error(
                            "Este DNI ya ha sido utilizado para crear una cuenta."
                        );
                    }

                    if (response.status === 404) {
                        throw new Error(
                            tipoUsuario === "medico"
                                ? "Este DNI no es válido."
                                : "El DNI no es válido o no está autorizado para registrarse."
                        );
                    }

                    throw new Error(
                        data.error ||
                        "El DNI no es válido o no está autorizado para registrarse."
                    );
                }

                // =================================================
                // DNI VÁLIDO
                // =================================================

                setFormData((prev) => ({
                    ...prev,
                    dni: dniIngresado,
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    dateOfBirth: data.date_of_birth || "",
                    sex: data.sex || "",
                    cip: data.cip || ""
                }));

                setDniValido(true);
                setErrorDni("");
            } catch (dniError) {
                if (dniError.name === "AbortError") {
                    return;
                }

                console.error(
                    "Error comprobando DNI:",
                    dniError
                );

                setDniValido(false);

                setErrorDni(
                    dniError.message ||
                    "El DNI no es válido."
                );
            } finally {
                if (dniAbortRef.current === controller) {
                    setLoadingDni(false);
                }
            }
        }
    };

    // ============================================================
    // ENVÍO DEL FORMULARIO
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        setError("");
        setSuccess("");

        // ========================================================
        // COMPROBAR DNI
        // ========================================================

        if (!dniValido) {
            setError(
                errorDni ||
                "El DNI no es válido o no está autorizado para registrarse."
            );
            return;
        }

        // ========================================================
        // COMPROBAR CONTRASEÑAS
        // ========================================================

        if (!passwordValid) {
            setError(
                "La contraseña no cumple todos los requisitos de seguridad."
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // ========================================================
        // COMPROBAR GRUPO SANGUÍNEO DEL PACIENTE
        // ========================================================

        if (
            tipoUsuario === "paciente" &&
            !formData.bloodType
        ) {
            setError(
                "Debes seleccionar tu grupo sanguíneo."
            );
            return;
        }

        // ========================================================
        // COMPROBAR DATOS DEL MÉDICO
        // ========================================================

        if (tipoUsuario === "medico") {
            const medicalLicense =
                form.medical_license?.value
                    ?.trim()
                    .toUpperCase() || "";

            const specialtyId =
                form.specialty_id?.value || "";

            const yearsExperience =
                form.years_experience?.value || "";

            if (!medicalLicense) {
                setError(
                    "Debes introducir el número de colegiado."
                );
                return;
            }

            if (!specialtyId) {
                setError(
                    "Debes seleccionar una especialidad."
                );
                return;
            }

            if (
                yearsExperience === "" ||
                Number(yearsExperience) < 0
            ) {
                setError(
                    "Debes introducir unos años de experiencia válidos."
                );
                return;
            }
        }

        setSubmitting(true);

        try {
            await registrarUsuario({
                role:
                    tipoUsuario === "medico"
                        ? "doctor"
                        : "patient",

                dni: formData.dni,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,

                // Solo pacientes
                bloodType: formData.bloodType,

                // Solo médicos
                medicalLicense:
                    form.medical_license?.value
                        ?.trim()
                        .toUpperCase() || "",

                specialtyId:
                    form.specialty_id?.value || "",

                yearsExperience:
                    Number(
                        form.years_experience?.value
                    ) || 0
            });

            // ====================================================
            // REGISTRO CORRECTO
            // ====================================================

            navigate("/login");
        } catch (submitError) {
            setError(
                submitError.message ||
                "No se pudo crear la cuenta."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // CAMPOS BLOQUEADOS DESPUÉS DE VALIDAR DNI
    // ============================================================

    const camposBloqueados = dniValido;

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="text-white min-vh-100 d-flex align-items-center">
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5">

                        <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5 scroll-reveal">

                            {/* CABECERA */}

                            <div className="text-center text-light mb-4">

                                <div
                                    className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4 mb-3"
                                    style={{
                                        width: "56px",
                                        height: "56px"
                                    }}
                                >
                                    <Icon
                                        name="UserRound"
                                        size={28}
                                    />
                                </div>

                                <h1 className="h2 fw-bold mb-2">
                                    Crear una cuenta
                                </h1>

                                <p className="text-white-50 small mb-0">
                                    Regístrate en el Sistema Nacional de Salud
                                </p>

                            </div>

                            {/* SELECTOR DE USUARIO */}

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
                                            handleTipoUsuarioChange(
                                                "paciente"
                                            )
                                        }
                                        className={`btn rounded-start-pill fw-semibold ${
                                            tipoUsuario === "paciente"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                        }`}
                                    >
                                        <Icon
                                            name="LockKeyhole"
                                            className="me-2"
                                        />
                                        Paciente
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTipoUsuarioChange(
                                                "medico"
                                            )
                                        }
                                        className={`btn rounded-end-pill fw-semibold ${
                                            tipoUsuario === "medico"
                                                ? "btn-info"
                                                : "btn-outline-secondary text-white"
                                        }`}
                                    >
                                        <Icon
                                            name="Stethoscope"
                                            className="me-2"
                                        />
                                        Médico
                                    </button>

                                </div>
                            </div>

                            {/* FORMULARIO */}

                            <form
                                className="text-start"
                                onSubmit={handleSubmit}
                                autoComplete="off"
                            >
                                <div className="row g-3">

                                    {/* DNI */}

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
                                            required
                                            className={`form-control bg-dark text-white text-uppercase ${
                                                errorDni
                                                    ? "border-danger"
                                                    : dniValido
                                                        ? "border-success"
                                                        : "border-secondary"
                                            }`}
                                            placeholder="Ingrese su DNI (ej: 12345678Z)"
                                        />

                                        {loadingDni && (
                                            <div className="text-info small mt-2">
                                                <Icon
                                                    name="LoaderCircle"
                                                    className="me-1"
                                                />
                                                Comprobando DNI...
                                            </div>
                                        )}

                                        {!loadingDni &&
                                            errorDni && (
                                                <div className="text-danger small mt-2">
                                                    <Icon
                                                        name="CircleAlert"
                                                        className="me-1"
                                                    />
                                                    {errorDni}
                                                </div>
                                            )}

                                        {!loadingDni &&
                                            dniValido && (
                                                <div className="text-success small mt-2">
                                                    <Icon
                                                        name="Check"
                                                        className="me-1"
                                                    />
                                                    DNI verificado en el sistema.
                                                </div>
                                            )}

                                    </div>

                                    {/* ERROR GENERAL */}

                                    {error && (
                                        <div className="col-12">
                                            <div className="alert alert-danger bg-danger bg-opacity-25 text-danger border-danger border-opacity-50 py-2 small mb-0">
                                                {error}
                                            </div>
                                        </div>
                                    )}

                                    {/* NOMBRE */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            readOnly={camposBloqueados}
                                            required
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Nombre"
                                        />

                                    </div>

                                    {/* APELLIDOS */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            Apellidos
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            readOnly={camposBloqueados}
                                            required
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Apellidos"
                                        />

                                    </div>

                                    {/* EMAIL */}

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
                                            required
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="ejemplo@correo.com"
                                        />

                                    </div>

                                    {/* TELÉFONO */}

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
                                            required
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="+34600000000"
                                        />

                                    </div>

                                    {/* FECHA DE NACIMIENTO */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            Fecha de nacimiento
                                        </label>

                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            readOnly={camposBloqueados}
                                            required
                                            className="form-control bg-dark text-white border-secondary"
                                        />

                                    </div>

                                    {/* SEXO */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            Sexo
                                        </label>

                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            disabled={camposBloqueados}
                                            required
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

                                    {/* GRUPO SANGUÍNEO */}

                                    {tipoUsuario === "paciente" && (
                                        <div className="col-12">

                                            <label className="form-label text-white-50 small">
                                                Grupo sanguíneo
                                            </label>

                                            <select
                                                name="bloodType"
                                                value={formData.bloodType}
                                                onChange={handleChange}
                                                required
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
                                    )}

                                    {/* CIP */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            CIP
                                        </label>

                                        <input
                                            type="text"
                                            name="cip"
                                            value={formData.cip}
                                            readOnly
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="Código CIP"
                                        />

                                        <div className="text-white-50 small mt-1">
                                            El CIP se obtiene automáticamente
                                            del sistema sanitario.
                                        </div>

                                    </div>

                                    {/* DATOS DEL MÉDICO */}

                                    {tipoUsuario === "medico" && (
                                        <>
                                            {/* NÚMERO DE COLEGIADO */}

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

                                            {/* ESPECIALIDAD */}

                                            <div className="col-12">

                                                <label className="form-label text-white-50 small">
                                                    Especialidad
                                                </label>

                                                <select
                                                    name="specialty_id"
                                                    className="form-select bg-dark text-white border-secondary"
                                                    defaultValue=""
                                                    required
                                                    disabled={
                                                        loadingEspecialidades ||
                                                        especialidades.length === 0
                                                    }
                                                >
                                                    <option value="">
                                                        {loadingEspecialidades
                                                            ? "Cargando especialidades..."
                                                            : "Seleccione una especialidad"}
                                                    </option>

                                                    {especialidades.map(
                                                        (especialidad) => (
                                                            <option
                                                                key={
                                                                    especialidad.id
                                                                }
                                                                value={
                                                                    especialidad.id
                                                                }
                                                            >
                                                                {
                                                                    especialidad.name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {errorEspecialidades && (
                                                    <div className="text-danger small mt-2">
                                                        {errorEspecialidades}
                                                    </div>
                                                )}

                                            </div>

                                            {/* AÑOS DE EXPERIENCIA */}

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

                                    {/* CONTRASEÑA */}

                                    <div className="col-12">

                                        <label className="form-label text-white-50 small">
                                            Contraseña
                                        </label>

                                        {/* REQUISITOS */}

                                        <div className="bg-dark bg-opacity-50 border border-secondary rounded-3 p-3 mb-2">

                                            <div className="text-white-50 small fw-semibold mb-2">
                                                La contraseña debe contener:
                                            </div>

                                            {/* MÍNIMO 8 */}

                                            <div
                                                className={`small d-flex align-items-center mb-1 ${
                                                    passwordRequirements.minLength
                                                        ? "text-decoration-line-through text-success"
                                                        : "text-white-50"
                                                }`}
                                            >
                                                <Icon
                                                    name={
                                                        passwordRequirements.minLength
                                                            ? "Check"
                                                            : "Circle"
                                                    }
                                                    size={14}
                                                    className="me-2"
                                                />
                                                Mínimo 8 caracteres
                                            </div>

                                            {/* ESPECIAL */}

                                            <div
                                                className={`small d-flex align-items-center mb-1 ${
                                                    passwordRequirements.hasSpecial
                                                        ? "text-decoration-line-through text-success"
                                                        : "text-white-50"
                                                }`}
                                            >
                                                <Icon
                                                    name={
                                                        passwordRequirements.hasSpecial
                                                            ? "Check"
                                                            : "Circle"
                                                    }
                                                    size={14}
                                                    className="me-2"
                                                />
                                                1 carácter especial
                                            </div>

                                            {/* MAYÚSCULA */}

                                            <div
                                                className={`small d-flex align-items-center mb-1 ${
                                                    passwordRequirements.hasUppercase
                                                        ? "text-decoration-line-through text-success"
                                                        : "text-white-50"
                                                }`}
                                            >
                                                <Icon
                                                    name={
                                                        passwordRequirements.hasUppercase
                                                            ? "Check"
                                                            : "Circle"
                                                    }
                                                    size={14}
                                                    className="me-2"
                                                />
                                                1 letra mayúscula
                                            </div>

                                            {/* NÚMERO */}

                                            <div
                                                className={`small d-flex align-items-center ${
                                                    passwordRequirements.hasNumber
                                                        ? "text-decoration-line-through text-success"
                                                        : "text-white-50"
                                                }`}
                                            >
                                                <Icon
                                                    name={
                                                        passwordRequirements.hasNumber
                                                            ? "Check"
                                                            : "Circle"
                                                    }
                                                    size={14}
                                                    className="me-2"
                                                />
                                                1 número
                                            </div>

                                        </div>

                                        {/* INPUT PASSWORD */}

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
                                                required
                                                className={`form-control bg-dark text-white ${
                                                    formData.password.length > 0 &&
                                                    passwordValid
                                                        ? "border-success"
                                                        : "border-secondary"
                                                }`}
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
                                                <Icon
                                                    name={
                                                        showPassword
                                                            ? "EyeOff"
                                                            : "Eye"
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    {/* CONFIRMAR CONTRASEÑA */}

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
                                                value={
                                                    formData.confirmPassword
                                                }
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                required
                                                className={`form-control bg-dark text-white ${
                                                    passwordMismatch
                                                        ? "border-danger"
                                                        : passwordsMatch
                                                            ? "border-success"
                                                            : "border-secondary"
                                                }`}
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
                                                <Icon
                                                    name={
                                                        showConfirmPassword
                                                            ? "EyeOff"
                                                            : "Eye"
                                                    }
                                                />
                                            </button>

                                        </div>

                                        {/* NO COINCIDEN */}

                                        {passwordMismatch && (
                                            <div className="text-danger small mt-2">
                                                <Icon
                                                    name="CircleAlert"
                                                    className="me-1"
                                                />
                                                Las contraseñas no coinciden.
                                            </div>
                                        )}

                                        {/* COINCIDEN */}

                                        {passwordsMatch && (
                                            <div className="text-success small mt-2">
                                                <Icon
                                                    name="Check"
                                                    className="me-1"
                                                />
                                                Las contraseñas coinciden.
                                            </div>
                                        )}

                                    </div>

                                    {/* BOTÓN */}

                                    <div className="col-12">

                                        <button
                                            type="submit"
                                            disabled={
                                                submitting ||
                                                loadingDni ||
                                                passwordMismatch ||
                                                !passwordValid
                                            }
                                            className="btn btn-info rounded-pill fw-bold w-100 py-2 mt-2"
                                        >
                                            {submitting
                                                ? "Creando cuenta..."
                                                : "Crear cuenta →"}
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
                                    <Icon
                                        name="LockKeyhole"
                                        className="me-1"
                                    />
                                    Conexión segura y protegida
                                </span>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

