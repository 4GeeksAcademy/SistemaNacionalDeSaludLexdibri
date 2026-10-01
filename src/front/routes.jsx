import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { DashboardPaciente } from "./pages/DashboardPaciente";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { CuadroMedico } from "./pages/CuadroMedico";
import { Especialidades } from "./pages/Especialidades";
import { Diagnostico } from "./pages/Diagnostico";
import { SaludPublica } from "./pages/SaludPublica";
import { ElSistema } from "./pages/ElSistema";
import { Contacto } from "./pages/Contacto";
import { Urgencias } from "./pages/Urgencias";
import { Home } from "./pages/Home";
import { DashboardMedico } from "./pages/DashboardMedico";
import Teleconsulta from "./pages/Teleconsulta";
import { HistorialClinico } from "./pages/HistorialClinico";
import { NuevoDiagnostico } from "./pages/NuevoDiagnostico";
import { NuevaConsulta } from "./pages/NuevaConsulta";
import { CrearReceta } from "./pages/CrearReceta";
import { SolicitarConsulta } from "./pages/SolicitarConsulta";
import PrivateRoute from "./components/PrivateRoute";
import OlvideContraseña from "./pages/OlvideContraseña";
import { CrearVacunacion } from "./pages/CrearVacunacion";
import { CrearCirugia } from "./pages/CrearCirugia";
import { DashboardAdmin } from "./pages/DashboardAdmin";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >
            {/* Rutas públicas */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="olvide/contraseña" element={<OlvideContraseña />} />
            <Route path="demo" element={<Demo />} />
            <Route path="single/:theId" element={<Single />} />

            <Route path="cuadro-medico" element={<CuadroMedico />} />
            <Route path="especialidades" element={<Especialidades />} />
            <Route path="diagnostico" element={<Diagnostico />} />
            <Route path="salud-publica" element={<SaludPublica />} />
            <Route path="el-sistema" element={<ElSistema />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="urgencias" element={<Urgencias />} />

            {/* Rutas privadas: paciente */}
            <Route
                path="dashboard/paciente"
                element={
                    <PrivateRoute>
                        <DashboardPaciente />
                    </PrivateRoute>
                }
            />
            <Route
                path="historial/clinico"
                element={
                    <PrivateRoute>
                        <HistorialClinico />
                    </PrivateRoute>
                }
            />
            <Route
                path="solicitar-consulta"
                element={
                    <PrivateRoute>
                        <SolicitarConsulta />
                    </PrivateRoute>
                }
            />
            <Route
                path="teleconsulta/:citaId"
                element={
                    <PrivateRoute>
                        <Teleconsulta />
                    </PrivateRoute>
                }
            />

            {/* Rutas privadas: médico */}
            <Route
                path="dashboard/medico"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <DashboardMedico />
                    </PrivateRoute>
                }
            />
            <Route
                path="nuevo-diagnostico"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <NuevoDiagnostico />
                    </PrivateRoute>
                }
            />
            <Route
                path="nueva-consulta"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <NuevaConsulta />
                    </PrivateRoute>
                }
            />
            <Route
                path="crear-receta"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <CrearReceta />
                    </PrivateRoute>
                }
            />
            <Route
                path="crear-vacunacion"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <CrearVacunacion />
                    </PrivateRoute>
                }
            />
            <Route
                path="crear-cirugia"
                element={
                    <PrivateRoute roles={["doctor"]}>
                        <CrearCirugia />
                    </PrivateRoute>
                }
            />

            {/* Rutas privadas: admin */}
            <Route
                path="dashboard/admin"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <DashboardAdmin />
                    </PrivateRoute>
                }
            />
        </Route>
    )
);