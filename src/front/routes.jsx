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
import {Register} from "./pages/Register"

export const router = createBrowserRouter(
    createRoutesFromElements(

        <>
            

            {/* RESTO DE LA APLICACIÓN */}
            <Route
                path="/"
                element={<Layout />}
                errorElement={<h1>Not found!</h1>}
            >
                <Route path="/home" element={<Home />} />

                <Route
                    path="/single/:theId"
                    element={<Single />}
                />

                <Route
                    path="/demo"
                    element={<Demo />}
                />
                <Route path="/registro" element={<Register />} />
                {/* LOGIN - aparece primero */}
                <Route path="/" element={<Login />} />
            </Route>
        </>
    )
);