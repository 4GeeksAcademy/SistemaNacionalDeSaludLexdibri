import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiCall = ({ roomName, displayName, onConferenceLeft }) => {
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
          if (!onConferenceLeft) return;

          api.addListener("videoConferenceLeft", onConferenceLeft);
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