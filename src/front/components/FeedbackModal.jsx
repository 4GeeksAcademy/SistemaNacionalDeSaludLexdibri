import React from "react";

export const FeedbackModal = ({ message, type = "success", onClose }) => {
    if (!message) return null;

    const isSuccess = type === "success";
    const color = isSuccess ? "success" : "danger";

    return (
        <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(5px)",
                zIndex: 1060
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content bg-dark text-white border border-${color} border-opacity-50 rounded-4 shadow-lg`}>
                    <div className="modal-header border-bottom border-white border-opacity-10">
                        <h2
                            id="feedback-modal-title"
                            className={`modal-title fs-5 fw-bold text-${color}`}
                        >
                            {isSuccess ? "Operación completada" : "No se pudo completar"}
                        </h2>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Cerrar"
                            onClick={onClose}
                        />
                    </div>
                    <div className="modal-body" role={isSuccess ? "status" : "alert"}>
                        {message}
                    </div>
                    <div className="modal-footer border-top border-white border-opacity-10">
                        <button
                            type="button"
                            className="btn btn-outline-light rounded-3"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
