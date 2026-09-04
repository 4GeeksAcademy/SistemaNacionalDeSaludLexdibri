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

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >
            {/* LOGIN como vista principal por defecto */}
            <Route index element={<Login />} />

            {/* RESTO DE LAS RUTAS */}
            <Route path="home" element={<Home />} />
            <Route path="registro" element={<Register />} />
            <Route path="demo" element={<Demo />} />
            <Route path="single/:theId" element={<Single />} />

            {/* Rutas secundarias del Navbar */}
            <Route path="cuadro-medico" element={<h1>Cuadro Médico</h1>} />
            <Route path="especialidades" element={<h1>Especialidades</h1>} />
            <Route path="diagnostico" element={<h1>Diagnóstico y Tecnología</h1>} />
            <Route path="salud-publica" element={<h1>Salud Pública</h1>} />
            <Route path="el-sistema" element={<h1>El Sistema</h1>} />
            <Route path="contacto" element={<h1>Contacto</h1>} />
            <Route path="urgencias" element={<h1>Urgencias</h1>} />
        </Route>
    )
);