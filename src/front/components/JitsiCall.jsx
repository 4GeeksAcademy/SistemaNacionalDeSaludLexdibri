import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiCall = () => {
  return (
    <div style={{ height: "600px", width: "100%" }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName="teleconsulta-prueba-123"
        userInfo={{
          displayName: "Usuario de prueba",
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
      />
    </div>
  );
};

export default JitsiCall;