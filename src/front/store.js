export const initialStore = () => {
  return {
    message: null,
    todos: [],
    user: null,
    access_token: localStorage.getItem("access_token"),
    isAuthenticated: !!localStorage.getItem("access_token"),

    // Carga inicial del idioma desde el disco o "es" por defecto
    language: localStorage.getItem("language") || "es",
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login":
      return {
        ...store,
        user: action.payload?.user || null,
        access_token: action.payload?.access_token || null,
        isAuthenticated: true,
      };

    case "logout":
      localStorage.removeItem("access_token");
      return {
        ...store,
        user: null,
        access_token: null,
        isAuthenticated: false,
      };

    case "add_task":
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === action.payload?.id
            ? { ...todo, ...action.payload }
            : todo,
        ),
      };

    case "SET_LANGUAGE":
      return {
        ...store,
        language: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
