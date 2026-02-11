"use client";

import { useRef, useState } from "react";
import Comments from "@/components/Comments";

interface Props {
  video: any;
  onNext: () => void;
  onToggleComments: () => void;
}

const TAP_DELAY = 280;

export default function Videoplayer({
  video,
  onNext,
  onToggleComments,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tapTimer = useRef<any>(null);

  const tapCountRef = useRef(0);
  const zoneRef = useRef<"left" | "center" | "right" | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [gestureIcon, setGestureIcon] = useState<string | null>(null);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);

  /* ---------------- GESTURES ---------------- */
  const registerTap = (z: "left" | "center" | "right") => {
    const v = videoRef.current;
    if (!v) return;

    if (tapCountRef.current === 0) zoneRef.current = z;

    tapCountRef.current++;
    clearTimeout(tapTimer.current);

    tapTimer.current = setTimeout(() => {
      const taps = tapCountRef.current;
      const zone = zoneRef.current;

      if (taps === 1 && zone === "center") {
        v.paused ? v.play() : v.pause();
        setGestureIcon(v.paused ? "⏸" : "▶");
      }

      if (taps === 2) {
        if (zone === "right") {
          v.currentTime += 10;
          setGestureIcon("⏩");
        }
        if (zone === "left") {
          v.currentTime -= 10;
          setGestureIcon("⏪");
        }
      }

      if (taps === 3) {
        if (zone === "left") {
          setShowCommentsPanel((p) => !p);
          onToggleComments();
        }

        if (zone === "center") onNext();

        if (zone === "right") window.location.href = "/";
      }

      tapCountRef.current = 0;
      zoneRef.current = null;
      setTimeout(() => setGestureIcon(null), 600);
    }, TAP_DELAY);
  };

  const format = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!video?.videoUrl) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden"
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        playsInline
        onTimeUpdate={() => setCurrent(videoRef.current!.currentTime)}
        onLoadedMetadata={() =>
          setDuration(videoRef.current!.duration)
        }
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onNext}
      />

      {/* TAP ZONES */}
      <div className="absolute inset-0 z-10 flex">
        <div className="flex-1" onClick={() => registerTap("left")} />
        <div className="flex-1" onClick={() => registerTap("center")} />
        <div className="flex-1" onClick={() => registerTap("right")} />
      </div>

      {/* GESTURE ICON */}
      {gestureIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-white text-6xl bg-black/60 px-6 py-4 rounded-full">
            {gestureIcon}
          </div>
        </div>
      )}

      {/* COMMENTS SLIDE PANEL */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-xl transition-transform duration-300 ${
          showCommentsPanel ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "45%" }}
      >
        <div className="p-3 border-b flex justify-between">
          <span>Comments</span>
          <button onClick={() => setShowCommentsPanel(false)}>
            ✕
          </button>
        </div>

        <div className="h-full overflow-y-auto px-4">
          <Comments videoId={video._id} />
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/70 px-4 pb-3 pt-6 text-white">
        <input
          type="range"
          min={0}
          max={duration}
          value={current}
          onChange={(e) =>
            (videoRef.current!.currentTime = Number(e.target.value))
          }
          className="w-full accent-red-600"
        />

        <div className="flex justify-between mt-2">
          <div className="flex gap-4 items-center">
            <button
              onClick={() =>
                videoRef.current!.paused
                  ? videoRef.current!.play()
                  : videoRef.current!.pause()
              }
            >
              {playing ? "⏸" : "▶"}
            </button>

            <span className="text-xs">
              {format(current)} / {format(duration)}
            </span>

            🔊
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                videoRef.current!.volume = v;
              }}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
/*
const Videoplayer = ({ video }: any) => {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        key={video._id}
        src={video.videoUrl}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Videoplayer;

/*
"use client";

import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videos = "/video/vdo.mp4";

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={`/placeholder.svg?height=480&width=854`}
      >
        <source
          src={`${process.env.BACKEND_URL}/${video?.filepath}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
  */
