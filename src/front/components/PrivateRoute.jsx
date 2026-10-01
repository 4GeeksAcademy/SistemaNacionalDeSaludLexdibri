import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const PrivateRoute = ({ children, roles }) => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    // Mientras se está verificando la sesión (ej. al recargar la página
    // y se está validando el token contra el backend), no renderizamos
    // nada todavía para evitar el "flash" de contenido protegido.
    if (store.authChecked === false) {
        return null; // o un spinner/loader
    }

    // No autenticado -> a login, guardando a dónde quería ir
    if (!store.isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Autenticado pero sin el rol requerido -> fuera
    if (roles && roles.length > 0) {
        const userRole = store.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PrivateRoute;