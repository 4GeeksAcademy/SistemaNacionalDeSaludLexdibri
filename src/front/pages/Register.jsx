
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { DiditSdk } from "@didit-protocol/sdk-web";
import "react-phone-input-2/lib/style.css";
import { TurnstileCaptcha } from "../components/TurnstileCaptcha";
import {
    completarRegistroKyc,
    comprobarTelefonoRegistro,
    registrarUsuario
} from "../services/authServices";
import { Icon } from "../components/Icon";

const EMPTY_FORM = {
    dni: "",
    email: "",
    phone: "",
    medicalLicense: "",
    password: "",
    confirmPassword: ""
};

export const Register = () => {
    const navigate = useNavigate();

    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [kycConsent, setKycConsent] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const [captchaWidgetKey, setCaptchaWidgetKey] = useState(0);

    const [loadingDni, setLoadingDni] = useState(false);
    const [errorDni, setErrorDni] = useState("");
    const [dniValido, setDniValido] = useState(false);
    const [dniVerificado, setDniVerificado] = useState("");
    const [phoneCheckStatus, setPhoneCheckStatus] = useState("idle");
    const [phoneCheckError, setPhoneCheckError] = useState("");
    const [loadingColegiado, setLoadingColegiado] = useState(false);
    const [errorColegiado, setErrorColegiado] = useState("");
    const [colegiadoValido, setColegiadoValido] = useState(false);
    const [datosColegiado, setDatosColegiado] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [phoneCountry, setPhoneCountry] = useState("es");

    const dniAbortRef = useRef(null);
    const colegiadoAbortRef = useRef(null);
    const verificationCallbackSession = useRef("");

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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("verificationSessionId");
        if (!sessionId || verificationCallbackSession.current === sessionId) {
            return;
        }

        verificationCallbackSession.current = sessionId;
        setSubmitting(true);
        setError("");

        completarRegistroKyc(sessionId)
            .then(() => navigate("/login", { replace: true }))
            .catch((verificationError) => {
                setError(
                    verificationError.message ||
                    "No se pudo completar el registro tras la verificación."
                );
                setSubmitting(false);

                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete("verificationSessionId");
                cleanUrl.searchParams.delete("status");
                window.history.replaceState(
                    {},
                    "",
                    `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`
                );
            });
    }, [navigate]);

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

    useEffect(() => {
        const phone = formData.phone.trim();
        if (!phone) {
            setPhoneCheckStatus("idle");
            setPhoneCheckError("");
            return undefined;
        }

        const controller = new AbortController();
        setPhoneCheckStatus("checking");
        setPhoneCheckError("");

        const timeoutId = setTimeout(async () => {
            try {
                const result = await comprobarTelefonoRegistro(
                    phone,
                    controller.signal
                );
                setPhoneCheckStatus(result.exists ? "exists" : "available");
            } catch (phoneError) {
                if (phoneError.name === "AbortError") return;
                setPhoneCheckStatus("error");
                setPhoneCheckError(
                    phoneError.message ||
                    "No se pudo comprobar el número de teléfono."
                );
            }
        }, 400);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [formData.phone]);

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
        setKycConsent(false);
        setErrorDni("");
        setErrorColegiado("");
        setDniValido(false);
        setDniVerificado("");
        setColegiadoValido(false);
        setDatosColegiado(null);
        setPhoneCheckStatus("idle");
        setPhoneCheckError("");

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

    const handlePhoneChange = (value, countryData) => {
        setPhoneCountry(countryData.countryCode);
        setFormData((prev) => ({
            ...prev,
            phone:
                value.length > countryData.dialCode.length
                    ? `+${value}`
                    : ""
        }));
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

    const handleDniChange = async (value) => {
        const dniIngresado = value
            .toUpperCase()
            .replace(/\s/g, "");

        dniAbortRef.current?.abort();
        setLoadingDni(false);
        setErrorDni("");
        setDniValido(false);
        setDniVerificado("");
        setFormData((prev) => ({
            ...prev,
            dni: dniIngresado
        }));
        setError("");

        const esDni = /^\d{8}[A-Z]$/.test(dniIngresado);
        const esCip = /^CIP[A-Z0-9]{1,47}$/.test(dniIngresado);
        if (!esDni && !esCip) {
            if (/^\d{8}[A-Z0-9]$/.test(dniIngresado)) {
                setErrorDni("DNI no válido. Debe tener 8 números y una letra.");
            }
            return;
        }

        const controller = new AbortController();
        dniAbortRef.current = controller;

        if (esCip) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (controller.signal.aborted) return;
        }

        setLoadingDni(true);
        const role = tipoUsuario === "medico" ? "doctor" : "patient";

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/registration-dni/${encodeURIComponent(
                    dniIngresado
                )}?role=${role}`,
                { signal: controller.signal }
            );
            const data = await response.json();

            if (controller.signal.aborted) return;
            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "El DNI o CIP no es válido o no está autorizado para registrarse."
                );
            }

            setDniVerificado(data.dni);
            setDniValido(true);
        } catch (dniError) {
            if (dniError.name === "AbortError") return;
            setErrorDni(
                dniError.message || "El DNI o CIP no es válido."
            );
        } finally {
            if (dniAbortRef.current === controller) {
                setLoadingDni(false);
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

        if (!dniValido || !dniVerificado) {
            setError(
                errorDni ||
                "El DNI o CIP no es válido o no está autorizado para registrarse."
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

        if (!kycConsent) {
            setError(
                "Debes aceptar la verificación de identidad con Didit para continuar."
            );
            return;
        }

        if (!turnstileToken) {
            setError("Completa el CAPTCHA antes de crear la cuenta.");
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
            const phoneCheck = await comprobarTelefonoRegistro(formData.phone);
            if (phoneCheck.exists) {
                throw new Error(
                    "Este número de teléfono ya pertenece a una cuenta."
                );
            }

            const verification = await registrarUsuario({
                role:
                    tipoUsuario === "medico"
                        ? "doctor"
                        : "patient",

                dni: dniVerificado,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                turnstileToken,
                kycConsent,

                medicalLicense: formData.medicalLicense.trim()
            });

            if (!verification.verification_url) {
                throw new Error(
                    "Didit no ha devuelto el enlace de verificación."
                );
            }

            DiditSdk.shared.onComplete = async (result) => {
                if (result.type !== "completed") {
                    setError(
                        result.type === "cancelled"
                            ? "La verificación de identidad fue cancelada."
                            : result.error?.message ||
                                "Didit no pudo completar la verificación de identidad."
                    );
                    return;
                }

                try {
                    await completarRegistroKyc(verification.session_id);
                    navigate("/login", { replace: true });
                } catch (verificationError) {
                    setError(
                        verificationError.message ||
                        "No se pudo completar el registro tras la verificación."
                    );
                }
            };
            DiditSdk.shared.startVerification({
                url: verification.verification_url
            });
        } catch (submitError) {
            setError(
                submitError.message ||
                "No se pudo crear la cuenta."
            );
            setTurnstileToken("");
            setCaptchaWidgetKey((key) => key + 1);
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
                                            DNI o CIP
                                        </label>

                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="dni"
                                                value={formData.dni}
                                                onChange={(event) =>
                                                    handleDniChange(event.target.value)
                                                }
                                                maxLength={50}
                                                autoComplete="off"
                                                required
                                                className={`form-control bg-dark text-white text-uppercase ${
                                                    errorDni
                                                        ? "border-danger"
                                                        : dniValido
                                                            ? "border-success"
                                                            : "border-secondary"
                                                }`}
                                                placeholder="Ingrese DNI (12345678Z) o CIP (CIP000001)"
                                            />
                                        </div>
                                        {loadingDni && (
                                            <div className="text-info small mt-2" role="status">
                                                Comprobando DNI o CIP en la base de datos...
                                            </div>
                                        )}
                                        {!loadingDni && errorDni && (
                                            <div className="text-danger small mt-2" role="alert">
                                                {errorDni}
                                            </div>
                                        )}
                                        {!loadingDni && dniValido && (
                                            <div className="text-success small mt-2" role="status">
                                                DNI o CIP autorizado y disponible.
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

                                        <PhoneInput
                                            country={phoneCountry}
                                            value={formData.phone.replace(/^\+/, "")}
                                            onChange={handlePhoneChange}
                                            enableSearch
                                            disableSearchIcon
                                            countryCodeEditable={false}
                                            preferredCountries={[
                                                "es",
                                                "us",
                                                "gb",
                                                "fr",
                                                "de"
                                            ]}
                                            searchPlaceholder="Buscar país o prefijo..."
                                            inputProps={{
                                                name: "phone",
                                                required: true,
                                                autoComplete: "tel",
                                                "aria-label": "Teléfono"
                                            }}
                                            containerClass="register-phone-input"
                                            inputClass="form-control"
                                            buttonClass="btn-outline-info"
                                            dropdownClass="register-phone-dropdown"
                                        />
                                        {phoneCheckStatus === "checking" && (
                                            <div className="form-text text-white-50" role="status">
                                                Comprobando si el teléfono ya está registrado...
                                            </div>
                                        )}
                                        {phoneCheckStatus === "available" && (
                                            <div className="text-success small mt-2" role="status">
                                                El teléfono está disponible.
                                            </div>
                                        )}
                                        {phoneCheckStatus === "exists" && (
                                            <div className="text-danger small mt-2" role="alert">
                                                Este número de teléfono ya pertenece a una cuenta.
                                            </div>
                                        )}
                                        {phoneCheckError && (
                                            <div className="text-danger small mt-2" role="alert">
                                                {phoneCheckError}
                                            </div>
                                        )}
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

                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                id="kyc-consent"
                                                type="checkbox"
                                                checked={kycConsent}
                                                onChange={(event) =>
                                                    setKycConsent(event.target.checked)
                                                }
                                                className="form-check-input"
                                            />
                                            <label
                                                htmlFor="kyc-consent"
                                                className="form-check-label text-white-50 small"
                                            >
                                                Acepto verificar mi identidad con Didit y que se contrasten los datos del documento con el registro oficial.
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <TurnstileCaptcha
                                            key={captchaWidgetKey}
                                            onTokenChange={setTurnstileToken}
                                        />
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
                                                ? "Verificando identidad..."
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
