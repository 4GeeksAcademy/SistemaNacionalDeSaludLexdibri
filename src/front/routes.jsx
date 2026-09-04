import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Nuevas páginas importadas
import { CuadroMedico } from "./pages/CuadroMedico";
import { Especialidades } from "./pages/Especialidades";
import { Diagnostico } from "./pages/Diagnostico";
import { SaludPublica } from "./pages/SaludPublica";
import { ElSistema } from "./pages/ElSistema";
import { Contacto } from "./pages/Contacto";
import { Urgencias } from "./pages/Urgencias";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >
            <Route index element={<Login />} />

            <Route path="home" element={<Home />} />
            <Route path="registro" element={<Register />} />
            <Route path="demo" element={<Demo />} />
            <Route path="single/:theId" element={<Single />} />

            {/* Rutas vinculadas a sus páginas correspondientes */}
            <Route path="cuadro-medico" element={<CuadroMedico />} />
            <Route path="especialidades" element={<Especialidades />} />
            <Route path="diagnostico" element={<Diagnostico />} />
            <Route path="salud-publica" element={<SaludPublica />} />
            <Route path="el-sistema" element={<ElSistema />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="urgencias" element={<Urgencias />} />
        </Route>
    )
);