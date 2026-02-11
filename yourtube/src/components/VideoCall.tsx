"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VideoCall({ roomId }: { roomId: string }) {
  const camVideo = useRef<HTMLVideoElement>(null);
  const screenVideo = useRef<HTMLVideoElement>(null);

  const peer = useRef<RTCPeerConnection | null>(null);
  const camStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Idle");

 
  useEffect(() => {
    peer.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    socket.emit("join-room", roomId);

    peer.current.ontrack = (e) => {
      screenVideo.current!.srcObject = e.streams[0];
    };

    peer.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
        });
      }
    };

    socket.on("offer", async (offer) => {
      await peer.current!.setRemoteDescription(offer);
      const answer = await peer.current!.createAnswer();
      await peer.current!.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peer.current!.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peer.current!.addIceCandidate(candidate);
    });
  }, [roomId]);

  
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    camStream.current = stream;
    camVideo.current!.srcObject = stream;

    stream.getTracks().forEach((track) =>
      peer.current!.addTrack(track, stream)
    );

    const offer = await peer.current!.createOffer();
    await peer.current!.setLocalDescription(offer);
    socket.emit("offer", { roomId, offer });

    setStatus("Call started");
  };

 
  const shareScreen = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    screenStream.current = screen;
    screenVideo.current!.srcObject = screen;

    const sender = peer.current!
      .getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(screen.getVideoTracks()[0]);

    setStatus("Screen sharing");

    screen.getVideoTracks()[0].onended = () => {
      sender?.replaceTrack(
        camStream.current!.getVideoTracks()[0]
      );
      screenVideo.current!.srcObject = null;
      setStatus("Screen share stopped");
    };
  };

  
  const startRecording = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const mic = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const combined = new MediaStream([
      ...screen.getTracks(),
      ...mic.getTracks(),
    ]);

    recorder.current = new MediaRecorder(combined);
    chunks.current = [];

    recorder.current.ondataavailable = (e) =>
      chunks.current.push(e.data);

    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, {
        type: "video/webm",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "youtube-recording.webm";
      a.click();

      setIsRecording(false);
      setStatus("Recording stopped");
    };

    recorder.current.start();
    setIsRecording(true);
    setStatus("Recording...");
  };

  const stopRecording = () => {
    recorder.current?.stop();
  };

  return (
    <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Video Call</h3>

        {isRecording ? (
          <span className="flex items-center gap-2 text-red-600 text-sm font-medium">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            Recording…
          </span>
        ) : (
          <span className="text-gray-500 text-sm">{status}</span>
        )}
      </div>

      {/* VIDEOS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <video
            ref={camVideo}
            autoPlay
            muted
            className="w-full h-40 bg-black rounded-lg object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            You
          </span>
        </div>

        <div className="relative">
          <video
            ref={screenVideo}
            autoPlay
            className="w-full h-40 bg-black rounded-lg object-cover"
          />
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Screen
          </span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={startCall}
          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Start Call
        </button>

        <button
          onClick={shareScreen}
          className="px-4 py-2 rounded-full bg-gray-200 text-sm hover:bg-gray-300"
        >
          Share Screen
        </button>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded-full bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Record
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}