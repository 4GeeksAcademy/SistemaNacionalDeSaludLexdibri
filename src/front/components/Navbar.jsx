import React from "react";
import { NavLink, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Icon } from "./Icon";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  const isLoggedIn = store.isAuthenticated;
  const user = store.user;

  const userRole = user?.role?.toString().trim().toUpperCase();

  const isDoctor = userRole === "DOCTOR";
  const isPatient = userRole === "PATIENT";

  const handleLogout = () => {
    dispatch({
      type: "logout",
    });
  };

  const defaultAvatar =
    "https://th.bing.com/th/id/OIG3.8UOQmAzj8smbYCzlKJ_S?pid=ImgGn";

  return (
    <header
      className="navbar-sns shadow-lg text-white p-3"
      style={{
        background:
          "linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* BARRA SUPERIOR PRINCIPAL */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand-sns text-decoration-none text-white d-flex align-items-center gap-2"
        >
          <span
            className="navbar-brand-plus bg-info text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
            }}
          >
            +
          </span>

          <div
            className="border border-info border-opacity-50 rounded px-2 py-1 bg-dark bg-opacity-50"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <span
              className="fw-bold tracking-wide"
              style={{ fontSize: "0.95rem" }}
            >
              SISTEMA NACIONAL DE SALUD{" "}
              <span className="text-info fw-extrabold">LEXDIBRI</span>
            </span>
          </div>
        </Link>

        {/* PERFIL */}
        <div
          className="dropdown position-relative"
          style={{ zIndex: 1050 }}
        >
          <button
            className={`btn border-0 dropdown-toggle d-flex align-items-center gap-2 px-3 py-1 rounded-pill ${isLoggedIn
              ? "bg-info text-dark fw-semibold"
              : "bg-white bg-opacity-10 text-white"
              }`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={user?.profile_image || defaultAvatar}
              alt="Avatar perfil"
              className="rounded-circle border border-2 border-white shadow-sm"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            <span className="small">
              {isLoggedIn
                ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                : "Sesión no iniciada"}
            </span>
          </button>

          {/* MENÚ DE PERFIL */}
          <ul
            className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary mt-2"
            style={{
              zIndex: 1060,
              backgroundColor: "#1e293b",
              minWidth: "240px",
            }}
          >
            {!isLoggedIn ? (
              <>
                {/* INICIAR SESIÓN */}
                <li>
                  <Link
                    className="dropdown-item py-2 small"
                    to="/login"
                  >
                    <Icon name="LockKeyhole" className="me-2" />Iniciar sesión
                  </Link>
                </li>

                {/* REGISTRARSE */}
                <li>
                  <Link
                    className="dropdown-item py-2 small"
                    to="/register"
                  >
                    <Icon name="Sparkles" className="me-2" />Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* DASHBOARD MÉDICO */}
                {isDoctor && (
                  <li>
                    <Link
                      className="dropdown-item py-2 small"
                      to="/dashboard/medico"
                    >
                      <Icon name="Stethoscope" className="me-2" />Dashboard médico
                    </Link>
                  </li>
                )}

                {/* DASHBOARD PACIENTE */}
                {isPatient && (
                  <li>
                    <Link
                      className="dropdown-item py-2 small"
                      to="/dashboard/paciente"
                    >
                      <Icon name="House" className="me-2" />Dashboard paciente
                    </Link>
                  </li>
                )}

                {/* AJUSTES */}
                <li>
                  <Link
                    className="dropdown-item py-2 small"
                    to="/ajustes"
                  >
                    <Icon name="Settings" className="me-2" />Ajustes
                  </Link>
                </li>
              </>
            )}

            {/* SEPARADOR */}
            <li>
              <hr className="dropdown-divider border-secondary" />
            </li>

            {/* AYUDA Y SOPORTE - PARA TODOS */}
            <li>
              <Link
                className="dropdown-item py-2 small"
                to="/contacto"
              >
                <Icon name="CircleHelp" className="me-2" />Ayuda y soporte
              </Link>
            </li>

            {/* CERRAR SESIÓN */}
            {isLoggedIn && (
              <>
                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>

                <li>
                  <button
                    type="button"
                    className="dropdown-item py-2 small text-danger fw-semibold"
                    onClick={handleLogout}
                  >
                    <Icon name="LogOut" className="me-2" />Cerrar sesión
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
            `navbar-link text-white text-decoration-none ${isActive ? "active text-info fw-bold" : "opacity-75"
            }`
          }
        >
          Especialidades
        </NavLink>

        <NavLink
          to="/diagnostico"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${isActive ? "active text-info fw-bold" : "opacity-75"
            }`
          }
        >
          Diagnóstico y Tecnología
        </NavLink>

        <NavLink
          to="/el-sistema"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${isActive ? "active text-info fw-bold" : "opacity-75"
            }`
          }
        >
          ¿Qué es Lexdibri?
        </NavLink>

        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${isActive ? "active text-info fw-bold" : "opacity-75"
            }`
          }
        >
          Contacto
        </NavLink>

        <NavLink
          to="/urgencias"
          className={({ isActive }) =>
            `navbar-link navbar-link-emergency text-danger fw-bold text-decoration-none ${isActive ? "active" : ""
            }`
          }
        >
          <Icon name="Siren" className="me-1" />Urgencias
        </NavLink>
      </nav>
    </header>
  );
};