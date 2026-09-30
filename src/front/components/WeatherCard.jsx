import React, { useEffect, useState } from "react";
import { Icon } from "./Icon";

export const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Ubicación actual");
  const [coords, setCoords] = useState(null);

  // Mapeo de códigos WMO de Open-Meteo
  const getWeatherInfo = (code) => {
    if (code === 0) return { icon: "Sun", text: "Despejado", color: "text-warning" };
    if (code === 1 || code === 2) return { icon: "CloudSun", text: "Parcialmente nublado", color: "text-warning" };
    if (code === 3) return { icon: "Cloud", text: "Nublado", color: "text-secondary" };
    if (code === 45 || code === 48) return { icon: "CloudFog", text: "Niebla", color: "text-secondary" };
    if (code >= 51 && code <= 57) return { icon: "CloudDrizzle", text: "Llovizna", color: "text-info" };
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: "CloudRain", text: "Lluvia", color: "text-primary" };
    if (code >= 71 && code <= 77) return { icon: "CloudSnow", text: "Nieve", color: "text-light" };
    if (code >= 95) return { icon: "CloudLightning", text: "Tormenta", color: "text-danger" };
    return { icon: "Sun", text: "Soleado", color: "text-warning" };
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString.replace(/-/g, "/"));
    return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase().replace(".", "");
  };

  // 1. OBTENER Y OBSERVAR UBICACIÓN EN TIEMPO REAL
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    // Escucha constante de cambios de posición GPS
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.warn("Geolocalización denegada o con error:", error.message);
        // Fallback predeterminado si el usuario niega el permiso (ej. Madrid)
        setCoords({ lat: 40.4168, lon: -3.7038 });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. CONSULTAR DATOS METEOROLÓGICOS Y ACTUALIZAR CADA 5 MINUTOS
  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        if (!res.ok) throw new Error("Error en la respuesta de clima");
        const data = await res.json();

        // Geocodificación inversa
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}`
          );
          const geoData = await geoRes.json();
          const cityName =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.village ||
            geoData.address?.state ||
            "Tu ubicación";
          setCity(cityName);
        } catch {
          setCity("Tu ubicación");
        }

        setWeatherData(data);
      } catch (err) {
        console.error("Error al cargar clima:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresco automático de clima cada 5 minutos (300.000 ms)
    const intervalId = setInterval(fetchWeather, 300000);

    return () => clearInterval(intervalId);
  }, [coords]);

  if (loading) {
    return (
      <div className="card bg-dark bg-opacity-75 text-white p-4 rounded-4 shadow-lg border border-secondary text-center">
        <Icon name="LoaderCircle" className="text-info spinner-border me-2" size={24} />
        <span>Obteniendo ubicación en tiempo real...</span>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="card bg-dark bg-opacity-75 text-white p-4 rounded-4 shadow-lg border border-secondary text-center">
        <Icon name="CloudOff" className="text-secondary mb-2" size={32} />
        <p className="m-0">No se pudo sincronizar la información meteorológica.</p>
      </div>
    );
  }

  const currentInfo = getWeatherInfo(weatherData.current.weather_code);
  const todayDate = new Date().toLocaleDateString("es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="card text-white rounded-4 shadow-lg border-0 overflow-hidden"
      style={{
        maxWidth: "450px",
        width: "100%",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* SECCIÓN SUPERIOR: CLIMA ACTUAL */}
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-1">
            <Icon name="MapPin" size={18} className="text-info" />
            <span className="fw-semibold text-capitalize">{city}</span>
          </div>
          <span className="small text-light opacity-75">{todayDate}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center my-3">
          <div>
            <h1 className="display-3 fw-bold mb-0">
              {Math.round(weatherData.current.temperature_2m)}°C
            </h1>
            <p className="fs-5 text-light opacity-90 mb-0">{currentInfo.text}</p>
          </div>
          <div>
            <Icon name={currentInfo.icon} size={70} className={currentInfo.color} />
          </div>
        </div>

        <div className="d-flex gap-4 mt-4 pt-3 border-top border-white border-opacity-10 small">
          <div className="d-flex align-items-center gap-2">
            <Icon name="Droplets" size={16} className="text-info" />
            <span>{weatherData.current.relative_humidity_2m}% Humedad</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Icon name="Wind" size={16} className="text-info" />
            <span>{Math.round(weatherData.current.wind_speed_10m)} km/h Viento</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: PRONÓSTICO EXTENDIDO (5 DÍAS) */}
      <div
        className="px-2 py-3 d-flex justify-content-between text-center border-top border-white border-opacity-20"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
      >
        {weatherData.daily.time.slice(0, 5).map((time, index) => {
          const dayCode = weatherData.daily.weather_code ? weatherData.daily.weather_code[index] : 0;
          const dayInfo = getWeatherInfo(dayCode);
          const maxTemp = Math.round(weatherData.daily.temperature_2m_max[index]);
          const minTemp = Math.round(weatherData.daily.temperature_2m_min[index]);

          return (
            <div key={time} className="d-flex flex-column align-items-center flex-fill px-1">
              <span className="small fw-semibold opacity-75 mb-1" style={{ fontSize: "0.75rem" }}>
                {index === 0 ? "HOY" : getDayName(time)}
              </span>
              <Icon name={dayInfo.icon} size={24} className={`my-1 ${dayInfo.color}`} />
              <span className="small fw-bold" style={{ fontSize: "0.8rem" }}>
                {maxTemp}°<span className="opacity-50 fw-normal">/{minTemp}°</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};