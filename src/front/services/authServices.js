export const registrarUsuario = async (payload) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al registrar");
    }

    return data;
};