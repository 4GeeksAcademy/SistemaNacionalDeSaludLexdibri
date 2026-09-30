import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Icon } from "./Icon";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const isLoggedIn = store.isAuthenticated;
  const user = store.user;

  const userRole = user?.role?.toString().trim().toUpperCase();

  const isDoctor = userRole === "DOCTOR";
  const isPatient = userRole === "PATIENT";

  const handleLogout = () => {
    dispatch({
      type: "logout",
    });

    navigate("/login", { replace: true });
  };

  const defaultAvatar =
    "https://th.bing.com/th/id/OIG3.8UOQmAzj8smbYCzlKJ_S?pid=ImgGn";


  /* =========================================================
     CLIMA
     ========================================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("La geolocalización no está disponible.");
      setWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
          );

          if (!response.ok) {
            throw new Error("Error al obtener el clima");
          }

          const data = await response.json();

          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          });
        } catch (error) {
          console.error("Error obteniendo el clima:", error);
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        console.error(
          "No se pudo obtener la ubicación:",
          error.message
        );

        setWeatherLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);


  /* =========================================================
     ICONO Y TEXTO DEL CLIMA
     ========================================================= */

  const getWeatherInfo = (code) => {
    if (code === 0) {
      return {
        icon: "Sun",
        text: "Despejado",
      };
    }

    if (code === 1 || code === 2) {
      return {
        icon: "CloudSun",
        text: "Parcialmente nublado",
      };
    }

    if (code === 3) {
      return {
        icon: "Cloud",
        text: "Nublado",
      };
    }

    if (code === 45 || code === 48) {
      return {
        icon: "CloudFog",
        text: "Niebla",
      };
    }

    if (
      code === 51 ||
      code === 53 ||
      code === 55 ||
      code === 56 ||
      code === 57
    ) {
      return {
        icon: "CloudDrizzle",
        text: "Llovizna",
      };
    }

    if (
      code === 61 ||
      code === 63 ||
      code === 65 ||
      code === 66 ||
      code === 67
    ) {
      return {
        icon: "CloudRain",
        text: "Lluvia",
      };
    }

    if (
      code === 71 ||
      code === 73 ||
      code === 75 ||
      code === 77
    ) {
      return {
        icon: "CloudSnow",
        text: "Nieve",
      };
    }

    if (code === 80 || code === 81 || code === 82) {
      return {
        icon: "CloudRain",
        text: "Chubascos",
      };
    }

    if (code === 95 || code === 96 || code === 99) {
      return {
        icon: "CloudLightning",
        text: "Tormenta",
      };
    }

    return {
      icon: "Cloud",
      text: "Clima",
    };
  };

  const weatherInfo = weather
    ? getWeatherInfo(weather.code)
    : null;


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

      {/* =====================================================
          BARRA SUPERIOR PRINCIPAL
          ===================================================== */}

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
              <span className="text-info fw-extrabold">
                LEXDIBRI
              </span>
            </span>
          </div>
        </Link>


        {/* =================================================
            CLIMA + PERFIL (agrupados a la derecha)
            ================================================= */}

        <div className="d-flex align-items-center gap-2">

          {/* CLIMA */}
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-dark bg-opacity-50 border border-info border-opacity-25"
            title={weatherInfo?.text || "Clima"}
            style={{
              backdropFilter: "blur(4px)",
              minWidth: "110px",
              justifyContent: "center",
            }}
          >
            {weatherLoading ? (
              <>
                <Icon
                  name="LoaderCircle"
                  className="text-info"
                  size={18}
                />

                <span className="small">
                  Cargando...
                </span>
              </>
            ) : weather ? (
              <>
                <Icon
                  name="Flame"
                  className="text-info"
                  size={21}
                />

                <span className="small fw-semibold">
                  {weather.temperature}°C
                </span>
              </>
            ) : (
              <>
                <Icon
                  name="CloudOff"
                  className="text-secondary"
                  size={18}
                />

                <span className="small">
                  Sin clima
                </span>
              </>
            )}
          </div>


          {/* PERFIL */}
          <div
            className="dropdown position-relative"
            style={{ zIndex: 1050 }}
          >
            <button
              className={`btn border-0 dropdown-toggle d-flex align-items-center gap-2 px-3 py-1 rounded-pill ${
                isLoggedIn
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
                  ? `${user?.first_name || ""} ${
                      user?.last_name || ""
                    }`.trim()
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
                      <Icon
                        name="LockKeyhole"
                        className="me-2"
                      />
                      Iniciar sesión
                    </Link>
                  </li>

                  {/* REGISTRARSE */}
                  <li>
                    <Link
                      className="dropdown-item py-2 small"
                      to="/register"
                    >
                      <Icon
                        name="Sparkles"
                        className="me-2"
                      />
                      Registrarse
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
                        <Icon
                          name="Stethoscope"
                          className="me-2"
                        />
                        Dashboard médico
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
                        <Icon
                          name="Hospital"
                          className="me-2"
                        />
                        Dashboard paciente
                      </Link>
                    </li>
                  )}
                </>
              )}


              {/* SEPARADOR */}
              <li>
                <hr className="dropdown-divider border-secondary" />
              </li>


              {/* AYUDA Y SOPORTE */}
              <li>
                <Link
                  className="dropdown-item py-2 small"
                  to="/contacto"
                >
                  <Icon
                    name="CircleHelp"
                    className="me-2"
                  />
                  Ayuda y soporte
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
                      <Icon
                        name="LogOut"
                        className="me-2"
                      />
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}

            </ul>
          </div>

        </div>
      </div>


      {/* =====================================================
          NAVEGACIÓN SECUNDARIA
          ===================================================== */}

      <nav className="d-flex gap-3 gap-md-4 small flex-wrap pt-2 border-top border-white border-opacity-10">

        <NavLink
          to="/especialidades"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${
              isActive
                ? "active text-info fw-bold"
                : "opacity-75"
            }`
          }
        >
          Especialidades
        </NavLink>


        <NavLink
          to="/diagnostico"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${
              isActive
                ? "active text-info fw-bold"
                : "opacity-75"
            }`
          }
        >
          Diagnóstico y Tecnología
        </NavLink>


        <NavLink
          to="/el-sistema"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${
              isActive
                ? "active text-info fw-bold"
                : "opacity-75"
            }`
          }
        >
          ¿Qué es Lexdibri?
        </NavLink>


        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            `navbar-link text-white text-decoration-none ${
              isActive
                ? "active text-info fw-bold"
                : "opacity-75"
            }`
          }
        >
          Contacto
        </NavLink>


        <NavLink
          to="/urgencias"
          className={({ isActive }) =>
            `navbar-link navbar-link-emergency text-danger fw-bold text-decoration-none ${
              isActive ? "active" : ""
            }`
          }
        >
          <Icon
            name="Siren"
            className="me-1"
          />
          Urgencias
        </NavLink>

      </nav>
    </header>
  );
};

export default Navbar;