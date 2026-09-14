
import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Si no está autenticado, lo mandamos al login
    if (!store.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, puede acceder
    return children;
};

export default PrivateRoute;

