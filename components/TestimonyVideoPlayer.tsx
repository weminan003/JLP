"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type TestimonyVideoPlayerProps = {
  videoSrc: string;
  title: string;
  orientation?: "portrait" | "landscape";
};

/** Format seconds → M:SS */
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/** ─── Icon components ───────────────────────────────────────────────────── */
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </>
    )}
  </svg>
);

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

/** ─── Component ─────────────────────────────────────────────────────────── */
export const TestimonyVideoPlayer = ({
  videoSrc,
  title,
  orientation = "landscape",
}: TestimonyVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  /** Auto-play on mount */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;

    const attempt = () => {
      const p = video.play();
      if (p instanceof Promise) p.catch(() => {});
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      attempt();
    } else {
      video.addEventListener("loadeddata", attempt, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", attempt);
      video.pause();
    };
  }, [videoSrc]);

  /** Sync video events → state */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  /** Auto-hide controls after 3s of inactivity while playing */
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, []);

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    resetHideTimer();
  }, [resetHideTimer]);

  const handleToggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    video.muted = val === 0;
  }, []);

  /** Seek by clicking/dragging the progress bar */
  const seekFromEvent = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video || !video.duration) return;
    const { left, width } = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - left) / width, 0), 1);
    video.currentTime = ratio * video.duration;
    setCurrentTime(video.currentTime);
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    seekFromEvent(e.clientX);
  }, [seekFromEvent]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    seekFromEvent(e.clientX);

    const onMouseMove = (ev: MouseEvent) => seekFromEvent(ev.clientX);
    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [seekFromEvent]);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative flex h-full w-full items-center justify-center bg-black"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (videoRef.current && !videoRef.current.paused) {
          setControlsVisible(false);
        }
      }}
      onClick={handleTogglePlay}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleTogglePlay();
        }
      }}
    >
      {/* ── Video element ─────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        className={`h-full w-full ${
          orientation === "portrait" ? "object-cover object-center" : "object-contain"
        }`}
        playsInline
        preload="auto"
        src={videoSrc}
        aria-label={title}
      />

      {/* ── Buffering spinner ─────────────────────────────────────────────── */}
      {isBuffering ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : null}

      {/* ── Centre play/pause flash ───────────────────────────────────────── */}
      {!isPlaying && !isBuffering ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 sm:h-20 sm:w-20"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <PlayIcon />
          </div>
        </div>
      ) : null}

      {/* ── Gradient behind controls ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300"
        style={{ opacity: controlsVisible || !isPlaying ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-4 pb-4 pt-2 transition-opacity duration-300 sm:px-5 sm:pb-5"
        style={{ opacity: controlsVisible || !isPlaying ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group/bar relative h-1 w-full cursor-pointer rounded-full bg-white/20 transition-all duration-150 hover:h-1.5"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            const video = videoRef.current;
            if (!video) return;
            if (e.key === "ArrowRight") video.currentTime = Math.min(video.currentTime + 5, video.duration);
            if (e.key === "ArrowLeft") video.currentTime = Math.max(video.currentTime - 5, 0);
          }}
        >
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white transition-all"
            style={{ width: `${progress}%`, transition: isDragging ? "none" : "width 0.1s linear" }}
          />
          {/* Scrubber thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 shadow-md transition-all group-hover/bar:opacity-100"
            style={{ left: `calc(${progress}% - 6px)` }}
            aria-hidden="true"
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            tabIndex={0}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Volume */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            tabIndex={0}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <VolumeIcon muted={isMuted} />
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white sm:w-20"
          />

          {/* Time */}
          <span className="ml-1 font-mono text-[11px] tabular-nums text-white/70 sm:text-[12px]">
            {formatTime(currentTime)}
            <span className="text-white/35"> / </span>
            {formatTime(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Toggle fullscreen"
            tabIndex={0}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
