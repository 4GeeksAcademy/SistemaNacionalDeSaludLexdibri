import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export const TurnstileCaptcha = ({ onTokenChange }) => {
    const [error, setError] = useState("");

    if (!siteKey) {
        return (
            <div className="alert alert-warning py-2 small mb-3" role="alert">
                El CAPTCHA no está configurado. Añade VITE_TURNSTILE_SITE_KEY
                al entorno del frontend.
            </div>
        );
    }

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-center">
                <Turnstile
                    siteKey={siteKey}
                    options={{ theme: "dark" }}
                    onSuccess={(token) => {
                        setError("");
                        onTokenChange(token);
                    }}
                    onExpire={() => onTokenChange("")}
                    onError={(errorCode) => {
                        onTokenChange("");
                        setError(
                            errorCode === "110200"
                                ? `El dominio ${window.location.hostname} no está autorizado para esta clave de Turnstile. Añádelo en Cloudflare, en la configuración del widget y su lista de Hostnames.`
                                : `Cloudflare Turnstile no pudo cargar (error ${errorCode}). Recarga la página y vuelve a intentarlo.`
                        );
                    }}
                />
            </div>
            {error && (
                <div className="alert alert-danger py-2 small mt-2 mb-0" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};
