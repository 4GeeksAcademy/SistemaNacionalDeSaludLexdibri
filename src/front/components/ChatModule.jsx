import React, { useState } from "react";

export const ChatModule = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  const [conversations] = useState([
    { id: 1, doctor: "Dr. Carlos Morales", specialty: "Medicina General", lastMessage: "Hemos recibido los resultados de tus análisis.", time: "10:42 AM", unread: true },
    { id: 2, doctor: "Dra. Elena Ramos", specialty: "Cardiología", lastMessage: "Recuerda mantener el registro de tensión.", time: "Ayer", unread: false }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "doctor", text: "Hola, ¿cómo te encuentras de las molestias?", time: "10:30 AM" },
    { id: 2, sender: "patient", text: "Hola Dr., mucho mejor. Ya no tengo fiebre.", time: "10:35 AM" },
    { id: 3, sender: "doctor", text: "Hemos recibido los resultados de tus análisis. Todo está dentro de la normalidad.", time: "10:42 AM" }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages([
      ...messages,
      { id: Date.now(), sender: "patient", text: messageText, time: "Ahora" }
    ]);
    setMessageText("");
  };

  return (
    <div className="container py-3">
      <div 
        className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 shadow-lg text-white overflow-hidden"
        style={{ backdropFilter: "blur(12px)", minHeight: "500px" }}
      >
        <div className="row g-0 h-100">
          
          {/* Columna Izquierda: Lista de Conversaciones */}
          <div className="col-12 col-md-4 border-end border-white border-opacity-10 p-3">
            <h5 className="fw-bold mb-3 text-info">💬 Mensajería Segura</h5>
            <div className="list-group list-group-flush bg-transparent">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`list-group-item list-group-item-action border-0 rounded-3 p-2 mb-2 text-white bg-transparent ${
                    activeChat === chat.id ? "bg-white bg-opacity-10 border border-info border-opacity-50" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold small">{chat.doctor}</span>
                    <span className="text-white-50 extra-small">{chat.time}</span>
                  </div>
                  <p className="mb-1 text-white-50 extra-small text-truncate">{chat.lastMessage}</p>
                  <span className="badge bg-info bg-opacity-25 text-info border border-info extra-small">{chat.specialty}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Pantalla de Chat Activo */}
          <div className="col-12 col-md-8 d-flex flex-column justify-content-between p-3">
            
            {/* Cabecera del Chat */}
            <div className="border-bottom border-white border-opacity-10 pb-2 mb-3 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-0 text-white">Dr. Carlos Morales</h6>
                <span className="text-white-50 small">Medicina General — Centro de Salud Manuel Becerra</span>
              </div>
              <span className="badge bg-success bg-opacity-25 text-success border border-success">En línea</span>
            </div>

            {/* Mensajes */}
            <div className="d-flex flex-column gap-2 overflow-auto mb-3 pe-2" style={{ maxHeight: "320px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex flex-column ${msg.sender === "patient" ? "align-items-end" : "align-items-start"}`}
                >
                  <div
                    className={`p-2 px-3 rounded-3 small max-w-75 ${
                      msg.sender === "patient"
                        ? "bg-primary text-white"
                        : "bg-white bg-opacity-10 text-white border border-white border-opacity-25"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-white-50 extra-small mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Formulario de Envío */}
            <form onSubmit={handleSendMessage} className="d-flex gap-2">
              <input
                type="text"
                className="form-control bg-white bg-opacity-10 border-white border-opacity-25 text-white placeholder-white-50 rounded-3"
                placeholder="Escribe un mensaje seguro..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className="btn btn-info px-4 rounded-3 text-dark fw-semibold">
                Enviar
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
};