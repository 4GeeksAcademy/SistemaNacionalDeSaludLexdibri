export const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-auto py-4">
            <div className="container text-center">
                <h6 className="mb-2">Sistema Nacional de Salud</h6>

                <p className="mb-1">
                    Plataforma de gestión y consulta de información sanitaria.
                </p>

                <small className="text-secondary">
                    © {new Date().getFullYear()} Sistema Nacional de Salud
                </small>
            </div>
        </footer>
    );
};
