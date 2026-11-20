"use client";

import Link from "next/link";
import { useUniverse } from "@/components/UniverseContext";

function fmt(secs: number) {
  if (!Number.isFinite(secs) || secs < 0) return "00:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MiniPlayer() {
  const {
    lang,
    tracks,
    currentTrackIndex,
    isPlaying,
    hasStartedAudio,
    currentTime,
    duration,
    togglePlay,
    prevTrack,
    nextTrack,
  } = useUniverse();

  if (!hasStartedAudio) return null;
  const track = tracks[currentTrackIndex];
  if (!track) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0D1117]/95 backdrop-blur-md hairline-t">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={track.cover}
            alt={track.title}
            className="h-10 w-10 object-cover object-top hairline-all shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#F4F1EA] truncate">{track.title}</p>
            <p className="font-mono-ed text-[10px] text-[#8B95A5]">
              {fmt(currentTime)} / {duration ? fmt(duration) : track.duration}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={prevTrack}
            className="h-8 w-8 hairline-all text-[#C9C4B8] hover:text-[#F4F1EA] text-xs font-mono-ed"
            aria-label="Previous"
          >
            ⏮
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="h-8 w-8 bg-[#E2A93B] text-[#0B0E12] text-xs font-mono-ed font-bold"
            aria-label="Play or pause"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            type="button"
            onClick={nextTrack}
            className="h-8 w-8 hairline-all text-[#C9C4B8] hover:text-[#F4F1EA] text-xs font-mono-ed"
            aria-label="Next"
          >
            ⏭
          </button>
          <Link
            href="/trilha"
            className="hidden sm:inline-block px-2.5 py-1.5 hairline-all font-mono-ed text-[10px] uppercase tracking-wider text-[#B8B4AA] hover:text-[#F4F1EA]"
          >
            {lang === "pt" ? "Abrir Trilha" : "Open OST"}
          </Link>
        </div>
      </div>
    </div>
  );
}
