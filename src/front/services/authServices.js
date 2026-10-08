export const registrarUsuario = async (formData) => {
  const {
    role,
    dni,
    email,
    password,
    phone,
    medicalLicense,
    turnstileToken,
  } = formData;

  const payload = {
    email,
    password,
    dni,
    phone,
    role,
    turnstile_token: turnstileToken,
  };

  // =====================================================
  // MÉDICO
  // =====================================================

  if (role === "doctor") {
    payload.medical_license = medicalLicense;
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al registrar");
  }

  return data;
};

export const comprobarTelefonoRegistro = async (phone, signal) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/registration/check-phone`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
      signal,
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "No se pudo comprobar el teléfono.");
  }
  if (typeof data.exists !== "boolean") {
    throw new Error("La respuesta al comprobar el teléfono no es válida.");
  }
  return data;
};

export const iniciarSesion = async ({
  email,
  password,
  tipoUsuario,
  turnstileToken,
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        turnstile_token: turnstileToken,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  // Guardamos el token temporalmente
  localStorage.setItem("access_token", data.access_token);

  try {
    const dashboardResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    const dashboardData = await dashboardResponse.json();

    if (!dashboardResponse.ok) {
      throw new Error(dashboardData.error || "Error al acceder al dashboard");
    }

    let rolEsperado;

    if (tipoUsuario === "medico") {
      rolEsperado = "doctor";
    } else if (tipoUsuario === "admin") {
      rolEsperado = "admin";
    } else {
      rolEsperado = "patient";
    }

    if (dashboardData.dashboard !== rolEsperado) {
      localStorage.removeItem("access_token");

      if (tipoUsuario === "medico") {
        throw new Error("Esta cuenta no corresponde a un médico");
      }

      if (tipoUsuario === "admin") {
        throw new Error("Esta cuenta no corresponde a un administrador");
      }

      throw new Error("Esta cuenta no corresponde a un paciente");
    }

    return {
      ...data,
      dashboard: dashboardData.dashboard,
    };
  } catch (error) {
    localStorage.removeItem("access_token");
    throw error;
  }
};
