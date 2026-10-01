import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMensaje("");
        setError("");

        if (!email.trim()) {
            setError("Por favor, introduce tu email.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "No se ha podido procesar la solicitud."
                );
            }

            setMensaje(
                data.message ||
                "Se han enviado las instrucciones a tu correo."
            );

            setEmail("");

        } catch (err) {
            setError(
                err.message ||
                "Ha ocurrido un error. Inténtalo de nuevo."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white min-vh-100 d-flex align-items-center">
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5">

                        <div className="card bg-white bg-opacity-10 border border-secondary border-opacity-50 rounded-4 p-4 p-md-5">

                            <div className="text-center text-light mb-4">

                                <div
                                    className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 border border-info border-opacity-25 rounded-4 text-info fs-4 mb-3"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                    }}
                                >
                                    <Icon
                                        name="KeyRound"
                                        size={28}
                                    />
                                </div>

                                <h1 className="h2 fw-bold mb-2">
                                    Recuperar contraseña
                                </h1>

                                <p className="text-white-50 small mb-0">
                                    Introduce tu email para recuperar tu
                                    contraseña.
                                </p>

                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label
                                        htmlFor="forgot-email"
                                        className="form-label text-white-50 small"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="forgot-email"
                                        type="email"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Ingrese su email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger py-2 small">
                                        {error}
                                    </div>
                                )}

                                {mensaje && (
                                    <div className="alert alert-success py-2 small">
                                        {mensaje}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-info rounded-pill fw-bold w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            />

                                            Enviando...
                                        </>
                                    ) : (
                                        "Recuperar contraseña →"
                                    )}
                                </button>

                            </form>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-info text-decoration-none small"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;