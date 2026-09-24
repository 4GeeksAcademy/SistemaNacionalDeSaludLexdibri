import React, { useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiCall = ({
  roomName,
  displayName,
  onConferenceJoined,
  onConferenceLeft,
  onConferenceError,
  onConferenceLoading,
}) => {
  useEffect(() => {
    // Cuando Jitsi empieza a cargarse/entrar
    onConferenceLoading?.();
  }, [onConferenceLoading]);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        userInfo={{
          displayName: displayName,
        }}
        configOverwrite={{
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        }}
        onApiReady={(api) => {
          api.addListener("videoConferenceJoined", () => {
            console.log("Jitsi: conectado");
            onConferenceJoined?.();
          });

          api.addListener("videoConferenceLeft", () => {
            console.log("Jitsi: desconectado");
            onConferenceLeft?.();
          });

          api.addListener("errorOccurred", (error) => {
            console.error("Jitsi: error", error);
            onConferenceError?.(error);
          });
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