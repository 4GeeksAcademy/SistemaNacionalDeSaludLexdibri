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

  // MÉDICO
  if (role === "doctor") {
    payload.medical_license = medicalLicense;
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}api/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Error al registrar",
    );
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

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "No se pudo comprobar el teléfono.",
    );
  }

  if (typeof data.exists !== "boolean") {
    throw new Error("La respuesta al comprobar el teléfono no es válida.");
  }

  return data;
};

export const comprobarEmailRegistro = async (email, signal) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/registration/check-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      signal,
    },
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "No se pudo comprobar el correo electrónico.",
    );
  }

  if (typeof data.exists !== "boolean") {
    throw new Error("La respuesta al comprobar el correo electrónico no es válida.");
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

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // ERRORES DEL LOGIN
  if (!response.ok) {
    let mensaje;

    if (response.status === 429) {
      mensaje =
        data.message ||
        "Has realizado demasiados intentos de inicio de sesión. Espera unos minutos antes de volver a intentarlo.";
    } else if (response.status === 401) {
      mensaje =
        data.message ||
        (data.error && data.error !== "unauthorized"
          ? data.error
          : "Correo o contraseña incorrectos.");
    } else if (response.status === 503) {
      mensaje =
        data.message ||
        (data.error && data.error !== "service_unavailable"
          ? data.error
          : "El servicio no está disponible temporalmente. Inténtalo más tarde.");
    } else {
      mensaje =
        data.message ||
        (data.error && data.error !== "too_many_requests"
          ? data.error
          : "No se pudo iniciar sesión. Inténtalo de nuevo.");
    }

    throw new Error(mensaje);
  }

  // VALIDAR QUE EL BACKEND DEVOLVIÓ UN TOKEN
  if (!data.access_token) {
    throw new Error("El servidor no ha devuelto un token de acceso válido.");
  }

  // GUARDAMOS EL TOKEN TEMPORALMENTE
  localStorage.setItem("access_token", data.access_token);

  try {
    // CONSULTAR EL DASHBOARD
    const dashboardResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    let dashboardData;

    try {
      dashboardData = await dashboardResponse.json();
    } catch {
      dashboardData = {};
    }

    if (!dashboardResponse.ok) {
      throw new Error(
        dashboardData.message ||
        dashboardData.error ||
        "Error al acceder al dashboard.",
      );
    }

    // COMPROBAR EL ROL DEL USUARIO
    let rolEsperado;

    if (tipoUsuario === "medico") {
      rolEsperado = "doctor";
    } else if (tipoUsuario === "admin") {
      rolEsperado = "admin";
    } else {
      rolEsperado = "patient";
    }

    if (dashboardData.dashboard !== rolEsperado) {
      if (tipoUsuario === "medico") {
        throw new Error("Esta cuenta no corresponde a un médico.");
      }

      if (tipoUsuario === "admin") {
        throw new Error("Esta cuenta no corresponde a un administrador.");
      }

      throw new Error("Esta cuenta no corresponde a un paciente.");
    }

    // DEVOLVER LOS DATOS DEL LOGIN
    return {
      ...data,
      dashboard: dashboardData.dashboard,
    };
  } catch (error) {
    // ELIMINAR EL TOKEN SI FALLA LA VALIDACIÓN DEL DASHBOARD
    localStorage.removeItem("access_token");
    throw error;
  }
};
