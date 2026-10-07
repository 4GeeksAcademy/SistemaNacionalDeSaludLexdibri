
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authServices";
import { Icon } from "../components/Icon";

const EMPTY_FORM = {
    dni: "",
    email: "",
    phone: "",
    cip: "",
    medicalLicense: "",
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

    const [loadingDni, setLoadingDni] = useState(false);
    const [errorDni, setErrorDni] = useState("");
    const [loadingColegiado, setLoadingColegiado] = useState(false);
    const [errorColegiado, setErrorColegiado] = useState("");
    const [colegiadoValido, setColegiadoValido] = useState(false);
    const [datosColegiado, setDatosColegiado] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [dniValido, setDniValido] = useState(false);

    const dniAbortRef = useRef(null);
    const colegiadoAbortRef = useRef(null);

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
        return () => {
            dniAbortRef.current?.abort();
            colegiadoAbortRef.current?.abort();
        };
    }, []);

    // ============================================================
    // VALIDAR NÚMERO DE COLEGIADO
    // ============================================================

    useEffect(() => {
        const medicalLicense = formData.medicalLicense.trim();
        if (tipoUsuario !== "medico" || !medicalLicense) return undefined;

        const controller = new AbortController();
        colegiadoAbortRef.current = controller;
        const timeoutId = setTimeout(async () => {
            setLoadingColegiado(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/registration-license/${encodeURIComponent(
                        medicalLicense
                    )}`,
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
                    throw new Error(
                        data.error ||
                        "El número de colegiado no está autorizado."
                    );
                }

                setDatosColegiado(data);
                setColegiadoValido(true);
                setErrorColegiado("");
            } catch (licenseError) {
                if (licenseError.name === "AbortError") return;

                console.error(
                    "Error comprobando número de colegiado:",
                    licenseError
                );
                setDatosColegiado(null);
                setColegiadoValido(false);
                setErrorColegiado(
                    licenseError.message ||
                    "No se pudo verificar el número de colegiado."
                );
            } finally {
                if (
                    colegiadoAbortRef.current === controller &&
                    !controller.signal.aborted
                ) {
                    setLoadingColegiado(false);
                }
            }
        }, 400);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
            if (colegiadoAbortRef.current === controller) {
                colegiadoAbortRef.current = null;
            }
        };
    }, [tipoUsuario, formData.medicalLicense]);

    // ============================================================
    // CAMBIAR TIPO DE USUARIO
    // ============================================================

    const handleTipoUsuarioChange = (tipo) => {
        dniAbortRef.current?.abort();
        colegiadoAbortRef.current?.abort();

        setLoadingDni(false);
        setLoadingColegiado(false);
        setTipoUsuario(tipo);

        setError("");
        setSuccess("");
        setErrorDni("");
        setErrorColegiado("");
        setColegiadoValido(false);
        setDatosColegiado(null);
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

    const handleColegiadoChange = (e) => {
        colegiadoAbortRef.current?.abort();
        setLoadingColegiado(false);
        setErrorColegiado("");
        setColegiadoValido(false);
        setDatosColegiado(null);
        setFormData((prev) => ({
            ...prev,
            medicalLicense: e.target.value.toUpperCase()
        }));
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
                            data.error ||
                            (tipoUsuario === "medico"
                                ? "Este DNI no es válido."
                                : "El DNI no es válido o no está autorizado para registrarse.")
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
        // COMPROBAR DATOS DEL MÉDICO
        // ========================================================

        if (tipoUsuario === "medico" && !colegiadoValido) {
            setError(
                errorColegiado ||
                "El número de colegiado no está verificado."
            );
            return;
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

                medicalLicense: formData.medicalLicense.trim()
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
                                                    value={formData.medicalLicense}
                                                    onChange={handleColegiadoChange}
                                                />

                                                {loadingColegiado && (
                                                    <div className="text-info small mt-2">
                                                        <Icon
                                                            name="LoaderCircle"
                                                            className="me-1"
                                                        />
                                                        Comprobando número de colegiado...
                                                    </div>
                                                )}

                                                {!loadingColegiado && errorColegiado && (
                                                    <div className="text-danger small mt-2">
                                                        <Icon
                                                            name="CircleAlert"
                                                            className="me-1"
                                                        />
                                                        {errorColegiado}
                                                    </div>
                                                )}

                                                {!loadingColegiado &&
                                                    colegiadoValido &&
                                                    datosColegiado && (
                                                        <div className="text-success small mt-2">
                                                            <Icon
                                                                name="Check"
                                                                className="me-1"
                                                            />
                                                            Colegiado verificado
                                                        </div>
                                                    )}

                                            </div>
                                        </>
                                    )}

                                    {/* CONTRASEÑA */}

                                    <div className="col-12">

                                        

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

                                        <label className="form-label text-white-50 small">
                                            Contraseña
                                        </label>

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
