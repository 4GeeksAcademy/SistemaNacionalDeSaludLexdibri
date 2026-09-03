export const registrarUsuario = async (payload) => {
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

export const iniciarSesion = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }
  localStorage.setItem("access_token", data.access_token);
  return data;
};
export const getDashboard = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}api/dashboard`,
    { method: "GET", headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error al acceder al dashboard");
  }
  return data;
};
