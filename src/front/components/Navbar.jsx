import React from "react";
import { NavLink, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  const isLoggedIn = store.isAuthenticated;
  const user = store.user;

  const handleLogout = () => {
    dispatch({
      type: "logout",
    });
  };

  return (
    <header className="navbar-sns">

      {/* BARRA SUPERIOR PRINCIPAL */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand-sns text-decoration-none text-white"
        >
          <span className="navbar-brand-plus">+</span>

          <span className="navbar-brand-text">
            SISTEMA NACIONAL DE SALUD
            <span className="navbar-brand-lexdibri">
              {" "}LEXDIBRI
            </span>
          </span>
        </Link>

        {/* PERFIL */}
        <div
          className="dropdown position-relative"
          style={{ zIndex: 1050 }}
        >
          <button
            className={`btn border-0 dropdown-toggle navbar-profile-button ${
              isLoggedIn
                ? "bg-info text-dark"
                : "bg-white bg-opacity-10 text-white"
            }`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={
                user?.profile_image || "../../public/rigo-baby.jpg"
              }
              alt="Foto de perfil"
              className="navbar-profile-image"
            />

            <span className="navbar-profile-name">
              {isLoggedIn
                ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                : "Sesión no iniciada"}
            </span>
          </button>

          {/* MENÚ DE PERFIL */}
          <ul
            className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary"
            style={{
              zIndex: 1060,
              backgroundColor: "#1e293b",
              minWidth: "220px",
            }}
          >
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/login"
                  >
                    🔐 Iniciar sesión
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/registro"
                  >
                    ✨ Registrarse
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/contacto"
                  >
                    ❓ Ayuda y soporte
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/profile"
                  >
                    👤 Mi perfil
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/historial"
                  >
                    📋 Mi historial
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item py-2"
                    to="/ajustes"
                  >
                    ⚙️ Ajustes
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>

                <li>
                  <button
                    className="dropdown-item py-2 text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* NAVEGACIÓN SECUNDARIA */}
      <nav className="d-flex gap-3 gap-md-4 small flex-wrap pt-2 border-top border-white border-opacity-10">

        <NavLink
          to="/especialidades"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          Especialidades
        </NavLink>

        <NavLink
          to="/diagnostico"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          Diagnóstico y Tecnología
        </NavLink>

        <NavLink
          to="/el-sistema"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          ¿Qué es Lexdibri?
        </NavLink>

        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          Contacto
        </NavLink>

        <NavLink
          to="/urgencias"
          className={({ isActive }) =>
            `navbar-link navbar-link-emergency ${
              isActive ? "active" : ""
            }`
          }
        >
          Urgencias 🚨
        </NavLink>

      </nav>

    </header>
  );
};