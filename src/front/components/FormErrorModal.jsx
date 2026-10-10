import React from "react";

export const FormErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-error-modal-title"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(5px)"
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white border border-danger border-opacity-50 rounded-4 shadow-lg">
                    <div className="modal-header border-bottom border-white border-opacity-10">
                        <h2
                            id="form-error-modal-title"
                            className="modal-title fs-5 fw-bold text-danger"
                        >
                            Error del formulario
                        </h2>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Cerrar"
                            onClick={onClose}
                        />
                    </div>
                    <div className="modal-body" role="alert">
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
