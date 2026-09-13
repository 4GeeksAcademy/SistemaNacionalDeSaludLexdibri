import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiCall = () => {
    return (
        <JitsiMeeting
            domain="meet.jit.si"
            roomName="teleconsulta-prueba-123"
            userInfo={{
                displayName: "Usuario de prueba"
            }}
            getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "100%";
                iframeRef.style.width = "100%";
            }}
        />
    );
};

export default JitsiCall;