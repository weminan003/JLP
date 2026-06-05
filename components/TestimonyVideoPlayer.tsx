"use client";

import { useEffect, useRef } from "react";

type TestimonyVideoPlayerProps = {
  videoSrc: string;
  title: string;
  orientation?: "portrait" | "landscape";
};

/**
 * Fullscreen testimony player — native HTML5 for reliable autoplay after user click.
 */
export const TestimonyVideoPlayer = ({
  videoSrc,
  title,
  orientation = "landscape",
}: TestimonyVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;

    const handlePlay = () => {
      const playAttempt = video.play();
      if (playAttempt instanceof Promise) {
        playAttempt.catch(() => {
          /* User can press play in native controls */
        });
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handlePlay();
    } else {
      video.addEventListener("loadeddata", handlePlay, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", handlePlay);
      video.pause();
    };
  }, [videoSrc]);

  return (
    <video
      ref={videoRef}
      className={`h-full w-full bg-black ${
        orientation === "portrait" ? "object-cover object-center" : "object-contain"
      }`}
      controls
      autoPlay
      playsInline
      preload="auto"
      src={videoSrc}
      aria-label={title}
    />
  );
};
