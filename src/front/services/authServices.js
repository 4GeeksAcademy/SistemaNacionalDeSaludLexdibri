export const registrarUsuario = async (formData) => {
  const {
    role,
    firstName,
    lastName,
    dni,
    email,
    password,
    phone,
    dateOfBirth,
    sex,
    cip,
    bloodType,
    medicalLicense,
    specialtyId,
    yearsExperience,
  } = formData;

  const payload = {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    dni,
    phone,
    date_of_birth: dateOfBirth,
    sex,
    role,
  };

  if (role === "patient") {
    payload.cip = cip;
    payload.blood_type = bloodType;
  } else {
    payload.medical_license = medicalLicense;
    payload.specialty_id = Number(specialtyId);
    payload.years_experience = Number(yearsExperience);
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al registrar");
  }

  return data;
};

export const iniciarSesion = async ({ email, password, tipoUsuario }) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}api/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  // Guardamos el token temporalmente
  localStorage.setItem("access_token", data.access_token);

  try {
    const dashboardResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const dashboardData = await dashboardResponse.json();

    if (!dashboardResponse.ok) {
      throw new Error(
        dashboardData.error || "Error al acceder al dashboard"
      );
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