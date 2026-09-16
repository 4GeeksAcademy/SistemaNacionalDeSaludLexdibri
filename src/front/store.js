
export const initialStore = () => {
  const accessToken = localStorage.getItem("access_token");
  const savedUser = localStorage.getItem("user");

  return {
    message: null,

    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],

    // AUTENTICACIÓN
    user: savedUser ? JSON.parse(savedUser) : null,
    access_token: accessToken,
    isAuthenticated: !!accessToken,
  };
};



export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    // LOGIN
    case "login":
      return {
        ...store,
        user: action.payload.user,
        access_token: action.payload.access_token,
        isAuthenticated: true,
      };

    // LOGOUT

    case "logout":
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      return {
        ...store,
        user: null,
        access_token: null,
        isAuthenticated: false,
      };

    default:
      throw Error("Unknown action.");
  }
}
