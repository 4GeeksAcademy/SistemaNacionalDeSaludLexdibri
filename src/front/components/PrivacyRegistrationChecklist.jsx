import React, { useState } from "react";

const DEMO_NOTICE_VERSION = "propuesta-demo-v1";

const officialReferences = [
    {
        label: "Historia Clínica Digital del SNS (Ministerio de Sanidad)",
        href: "https://www.sanidad.gob.es/areas/saludDigital/historiaClinicaSNS/"
    },
    {
        label: "Agencia Española de Protección de Datos",
        href: "https://www.aepd.es/"
    },
    {
        label: "Ley 41/2002, de autonomía del paciente (BOE)",
        href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-22188"
    }
];

const checklistItems = [
    {
        id: "identity",
        title: "1. Identificación de la persona",
        description:
            "El DNI o CIP sirve para localizar la autorización de registro, no para autenticar por sí solo. La propuesta contempla verificación de identidad y acceso posterior mediante credenciales."
    },
    {
        id: "information",
        title: "2. Información sobre el tratamiento de datos",
        description:
            "Ejemplo de los datos que el aviso definitivo deberá explicar. Todo lo relativo a esta aplicación queda pendiente de determinación y validación institucional y jurídica."
    }
];

export const PrivacyRegistrationChecklist = ({ onConfirmationChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acknowledgements, setAcknowledgements] = useState({
        identity: false,
        information: false
    });
    const [privacyConfigurationAccepted, setPrivacyConfigurationAccepted] =
        useState(false);
    const [optionalNotificationsConsent, setOptionalNotificationsConsent] =
        useState(false);
    const [confirmedRecord, setConfirmedRecord] = useState(null);

    const clearConfirmation = () => {
        setConfirmedRecord(null);
        onConfirmationChange(false);
    };

    const updateAcknowledgement = (id, checked) => {
        setAcknowledgements((current) => ({
            ...current,
            [id]: checked
        }));
        clearConfirmation();
    };

    const confirmDecisions = () => {
        const record = {
            version: DEMO_NOTICE_VERSION,
            timestamp: new Date().toISOString(),
            identityAcknowledged: acknowledgements.identity,
            informationAcknowledged: acknowledgements.information,
            privacyConfigurationAccepted,
            optionalNotificationsConsent
        };
        setConfirmedRecord(record);
        onConfirmationChange(true);
        setIsModalOpen(false);
    };

    const requiredItemsReviewed =
        acknowledgements.identity &&
        acknowledgements.information &&
        privacyConfigurationAccepted;

    return (
        <section
            className="col-12"
            aria-labelledby="privacy-checklist-title"
        >
            <div className="border border-info border-opacity-50 rounded-3 p-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                        <h2 id="privacy-checklist-title" className="h6 mb-1 text-light">
                            Privacidad y decisiones de acceso
                        </h2>
                        <span className="badge text-bg-warning">
                            Propuesta · simulación
                        </span>
                    </div>
                    <a
                        href="#privacy-checklist-modal"
                        className="link-info fw-semibold"
                        onClick={(event) => {
                            event.preventDefault();
                            setIsModalOpen(true);
                        }}
                    >
                        Revisar checklist de privacidad
                    </a>
                </div>
                <div className="form-check mt-2">
                    <input
                        id="privacy-checklist-complete"
                        type="checkbox"
                        className="form-check-input"
                        checked={Boolean(confirmedRecord)}
                        readOnly
                        disabled
                    />
                    <label
                        htmlFor="privacy-checklist-complete"
                        className="form-check-label small text-light"
                    >
                        {confirmedRecord
                            ? "Checklist de privacidad revisado y confirmado."
                            : "Checklist de privacidad pendiente de revisión."}
                    </label>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="modal d-block"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="privacy-checklist-modal-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsModalOpen(false);
                        }
                    }}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        backdropFilter: "blur(5px)",
                        zIndex: 1060
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                        <div className="modal-content bg-dark text-white border border-info border-opacity-50 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom border-white border-opacity-10">
                                <div>
                                    <h2
                                        id="privacy-checklist-modal-title"
                                        className="modal-title fs-5 fw-bold"
                                    >
                                        Privacidad y decisiones de acceso
                                    </h2>
                                    <span className="badge text-bg-warning mt-2">
                                        Propuesta · simulación
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    aria-label="Cerrar"
                                    onClick={() => setIsModalOpen(false)}
                                />
                            </div>
                            <div className="modal-body">
                <div className="alert alert-warning small">
                    Este flujo es un prototipo para evaluación institucional.
                    No acredita aprobación, aval ni autorización del Gobierno,
                    del Ministerio de Sanidad o del SNS. Los datos del responsable,
                    las bases jurídicas, las opciones y sus efectos requieren
                    validación. Las selecciones son demostrativas: no se aplican
                    ni se guardan en el servidor.
                </div>

                <ol className="list-unstyled d-grid gap-3 mb-0">
                    {checklistItems.map((item) => (
                        <li
                            key={item.id}
                            className="border border-secondary rounded-3 p-3"
                        >
                            <h3 className="h6 text-info">{item.title}</h3>
                            <p className="small text-white-50">{item.description}</p>
                            {item.id === "information" && (
                                <>
                                    <ul className="small text-white-50">
                                        <li>
                                            Responsable y contacto: pendiente de
                                            designación formal para esta aplicación;
                                            no se atribuye esta responsabilidad al
                                            Ministerio de Sanidad.
                                        </li>
                                        <li>
                                            Finalidades: propuesta de gestión de
                                            cuenta, verificación de identidad y
                                            atención sanitaria, pendiente de
                                            concretar según las funciones reales.
                                        </li>
                                        <li>
                                            Base jurídica: pendiente de análisis
                                            por la entidad responsable; no se
                                            presume que el consentimiento sea la
                                            base para toda actividad asistencial.
                                        </li>
                                        <li>
                                            Destinatarios: pendiente de definir de
                                            acuerdo con los flujos reales; la
                                            propuesta contempla profesionales
                                            autorizados y proveedores que se
                                            confirmen.
                                        </li>
                                        <li>
                                            Conservación: pendiente de concretar
                                            conforme a las obligaciones aplicables
                                            y a la política aprobada.
                                        </li>
                                        <li>
                                            Derechos: acceso, rectificación,
                                            supresión y los demás que procedan,
                                            ante el responsable que se designe; se
                                            informará también de la posibilidad de
                                            reclamar ante la AEPD.
                                        </li>
                                    </ul>
                                    <div className="small text-white-50 border-start border-info border-2 ps-2 mb-3">
                                        Referencia oficial HCDSNS: el Registro de
                                        Actividades de Tratamiento del Ministerio
                                        identifica a la Subdirección General de
                                        Información Sanitaria como responsable en
                                        el ámbito ministerial y publica{" "}
                                        <a
                                            href="mailto:secis@sanidad.gob.es"
                                            className="link-info"
                                        >
                                            secis@sanidad.gob.es
                                        </a>
                                        {" "}y{" "}
                                        <a
                                            href="mailto:delegadoprotecciondatos@sanidad.gob.es"
                                            className="link-info"
                                        >
                                            delegadoprotecciondatos@sanidad.gob.es
                                        </a>
                                        {" "}como contactos ministeriales. No son
                                        los contactos de esta aplicación; los
                                        servicios autonómicos pueden tener
                                        responsabilidades propias sobre los datos
                                        que custodian.
                                    </div>
                                </>
                            )}
                            <div className="form-check">
                                <input
                                    id={`privacy-${item.id}`}
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={acknowledgements[item.id]}
                                    onChange={(event) =>
                                        updateAcknowledgement(
                                            item.id,
                                            event.target.checked
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`privacy-${item.id}`}
                                    className="form-check-label small"
                                >
                                    He revisado este apartado de la propuesta.
                                </label>
                            </div>
                        </li>
                    ))}

                    <li className="border border-secondary rounded-3 p-3">
                        <h3 className="h6 text-info">
                            3. Configuración de privacidad
                        </h3>
                        <p className="small text-white-50">
                            Configuración inicial propuesta para esta
                            demostración. Podrás modificar quién puede consultar
                            tu información y las demás opciones de privacidad al
                            crear tu cuenta y posteriormente desde tu perfil.
                        </p>
                        <div className="form-check">
                            <input
                                id="privacy-configuration-accepted"
                                type="checkbox"
                                className="form-check-input"
                                checked={privacyConfigurationAccepted}
                                onChange={(event) => {
                                    setPrivacyConfigurationAccepted(
                                        event.target.checked
                                    );
                                    clearConfirmation();
                                }}
                            />
                            <label
                                htmlFor="privacy-configuration-accepted"
                                className="form-check-label small"
                            >
                                Acepto que toda mi información sanitaria quede
                                disponible para los profesionales sanitarios
                                autorizados de mi hospital y, cuando exista una
                                necesidad asistencial, de centros sanitarios de
                                toda España. Podré modificar quién puede verla y
                                las demás opciones de privacidad al crear mi
                                cuenta.
                            </label>
                        </div>
                    </li>

                    <li className="border border-secondary rounded-3 p-3">
                        <h3 className="h6 text-info">
                            4. Consentimientos específicos, si proceden
                        </h3>
                        <p className="small text-white-50">
                            La asistencia ordinaria no se condiciona a aceptar
                            usos opcionales. Esta casilla ilustra el consentimiento
                            para recibir comunicaciones no asistenciales sobre el
                            servicio. En una versión real debería retirarse desde
                            las preferencias de la cuenta o mediante el canal de
                            privacidad que se designe. No se enviarán
                            notificaciones.
                        </p>
                        <div className="form-check">
                            <input
                                id="privacy-optional-notifications"
                                type="checkbox"
                                className="form-check-input"
                                checked={optionalNotificationsConsent}
                                onChange={(event) => {
                                    setOptionalNotificationsConsent(
                                        event.target.checked
                                    );
                                    clearConfirmation();
                                }}
                            />
                            <label
                                htmlFor="privacy-optional-notifications"
                                className="form-check-label small"
                            >
                                Doy mi consentimiento opcional para recibir
                                comunicaciones no asistenciales sobre el servicio
                                (solo simulación; no condiciona la atención).
                            </label>
                        </div>
                    </li>

                    <li className="border border-secondary rounded-3 p-3">
                        <h3 className="h6 text-info">
                            5. Confirmación y registro de las decisiones
                        </h3>
                        <p className="small text-white-50">
                            La propuesta prevé registrar la versión mostrada, la
                            fecha, las preferencias y los consentimientos. Aquí
                            solo se genera una vista demostrativa en pantalla;
                            no es un registro persistente ni protegido del servidor.
                        </p>
                        {confirmedRecord && (
                            <div className="alert alert-info small mt-3 mb-0">
                                <strong>Registro demostrativo (no persistente)</strong>
                                <ul className="mb-0 mt-1">
                                    <li>
                                        Versión: {confirmedRecord.version}
                                    </li>
                                    <li>
                                        Fecha:{" "}
                                        {new Date(
                                            confirmedRecord.timestamp
                                        ).toLocaleString("es-ES")}
                                    </li>
                                    <li>
                                        Información revisada: identidad{" "}
                                        {confirmedRecord.identityAcknowledged
                                            ? "sí"
                                            : "no"}
                                        , privacidad{" "}
                                        {confirmedRecord.informationAcknowledged
                                            ? "sí"
                                            : "no"}
                                    </li>
                                    <li>
                                        Configuración de privacidad:{" "}
                                        {confirmedRecord.privacyConfigurationAccepted
                                            ? "aceptada para la demostración"
                                            : "no aceptada"}
                                    </li>
                                    <li>
                                        Consentimiento opcional:{" "}
                                        {confirmedRecord.optionalNotificationsConsent
                                            ? "otorgado en la simulación"
                                            : "no otorgado"}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ol>

                <p className="small text-white-50 mt-3 mb-2">
                    Referencias funcionales y normativas (no implican aval de
                    esta aplicación):
                </p>
                <ul className="small mb-0">
                    {officialReferences.map((reference) => (
                        <li key={reference.href}>
                            <a
                                href={reference.href}
                                target="_blank"
                                rel="noreferrer"
                                className="link-info"
                            >
                                {reference.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
                            <div className="modal-footer border-top border-white border-opacity-10">
                                <button
                                    type="button"
                                    className="btn btn-outline-light rounded-pill"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Volver al formulario
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-info rounded-pill fw-bold"
                                    disabled={!requiredItemsReviewed}
                                    onClick={confirmDecisions}
                                >
                                    Confirmar checklist y continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
