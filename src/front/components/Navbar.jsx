import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const { i18n } = useTranslation();

  const isLoggedIn = store.isAuthenticated;
  const user = store.user;

  // Estado del idioma global
  const currentLang = store.language || "es";

  const handleLogout = () => {
    dispatch({
      type: "logout",
    });
  };

  // Función para actualizar el idioma globalmente y persistirlo
  const changeLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    dispatch({
      type: "SET_LANGUAGE",
      payload: newLang,
    });
    localStorage.setItem("language", newLang);
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
            {currentLang === "es" ? "SISTEMA NACIONAL DE SALUD" : "NATIONAL HEALTH SYSTEM"}
            <span className="navbar-brand-lexdibri">
              {" "}LEXDIBRI
            </span>
          </span>
        </Link>

        {/* LADO DERECHO: SELECTOR DE IDIOMA + PERFIL */}
        <div className="d-flex align-items-center gap-2">

          {/* BOTONES / SELECTOR DE IDIOMA */}
          <div className="btn-group btn-group-sm me-2" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`btn ${currentLang === "es" ? "btn-info text-dark fw-bold" : "btn-outline-light"}`}
              onClick={() => changeLanguage("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={`btn ${currentLang === "en" ? "btn-info text-dark fw-bold" : "btn-outline-light"}`}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
          </div>

          {/* PERFIL */}
          <div
            className="dropdown position-relative"
            style={{ zIndex: 1050 }}
          >
            <button
              className={`btn border-0 dropdown-toggle navbar-profile-button ${isLoggedIn
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
                  : (currentLang === "es" ? "Sesión no iniciada" : "Not logged in")}
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
                      🔐 {currentLang === "es" ? "Iniciar sesión" : "Log in"}
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/registro"
                    >
                      ✨ {currentLang === "es" ? "Registrarse" : "Sign up"}
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
                      ❓ {currentLang === "es" ? "Ayuda y soporte" : "Help & support"}
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
                      👤 {currentLang === "es" ? "Mi perfil" : "My profile"}
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/historial"
                    >
                      📋 {currentLang === "es" ? "Mi historial" : "My history"}
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/ajustes"
                    >
                      ⚙️ {currentLang === "es" ? "Ajustes" : "Settings"}
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
                      🚪 {currentLang === "es" ? "Cerrar sesión" : "Log out"}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

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
          {currentLang === "es" ? "Especialidades" : "Specialties"}
        </NavLink>

        <NavLink
          to="/diagnostico"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          {currentLang === "es" ? "Diagnóstico y Tecnología" : "Diagnosis & Technology"}
        </NavLink>

        <NavLink
          to="/el-sistema"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          {currentLang === "es" ? "¿Qué es Lexdibri?" : "What is Lexdibri?"}
        </NavLink>

        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          {currentLang === "es" ? "Contacto" : "Contact"}
        </NavLink>

        <NavLink
          to="/urgencias"
          className={({ isActive }) =>
            `navbar-link navbar-link-emergency ${isActive ? "active" : ""
            }`
          }
        >
          {currentLang === "es" ? "Urgencias 🚨" : "Emergencies 🚨"}
        </NavLink>

      </nav>

    </header>
  );
};