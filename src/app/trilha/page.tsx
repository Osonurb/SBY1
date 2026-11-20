"use client";

import { useState } from "react";
import { useUniverse } from "@/components/UniverseContext";

function fmt(secs: number) {
  if (!Number.isFinite(secs) || secs < 0) return "00:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TrilhaPage() {
  const {
    lang,
    tracks,
    addLocalTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    selectTrack,
    togglePlay,
    prevTrack,
    nextTrack,
    seekTo,
    setVolume,
    toggleMute,
    openCharacterModal,
  } = useUniverse();

  const [filter, setFilter] = useState("all");
  const isPt = lang === "pt";
  const activeTrack = tracks[currentTrackIndex] ?? tracks[0];
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const filtered = tracks
    .map((tr, realIdx) => ({ tr, realIdx }))
    .filter(({ tr }) => filter === "all" || tr.categories.includes(filter));

  const filterButtons = [
    { key: "all", label: isPt ? `Todas (${tracks.length})` : `All (${tracks.length})` },
    { key: "theme", label: isPt ? "Temas Principais" : "Main Themes" },
    { key: "anaira", label: "Anaira & Dandelion" },
    { key: "dramatic", label: "Broadway & Drama" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 hairline-b">
        <div>
          <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#E2A93B]">
            {isPt
              ? "SOUND NAME · TRILHA SONORA OFICIAL"
              : "SOUND NAME · OFFICIAL SOUNDTRACK"}
          </p>
          <h1 className="mt-2 font-serif-ed text-4xl sm:text-5xl text-[#F4F1EA] tracking-tight">
            {isPt ? "As músicas originais do universo" : "Original music from the universe"}
          </h1>
          <p className="mt-3 text-sm text-[#B8B4AA] max-w-2xl leading-relaxed">
            {isPt
              ? "O player é persistente: dê play aqui e continue ouvindo enquanto explora os Personagens ou escreve na Sala de Redatores."
              : "The player is persistent: press play here and keep listening while browsing Characters or writing in the Writers' Room."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono-ed">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilter(btn.key)}
              className={`px-3.5 py-2 transition-colors ${
                filter === btn.key
                  ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
                  : "hairline-all text-[#B8B4AA] hover:text-[#F4F1EA]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Studio Deck */}
        {activeTrack && (
          <div className="lg:col-span-5 bg-[#12161D] hairline-all overflow-hidden">
            <div className="relative aspect-[16/10] bg-[#090B0F] overflow-hidden hairline-b">
              <img
                src={activeTrack.cover}
                alt={activeTrack.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161D] via-[#12161D]/25 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#0B0E12]/90 hairline-all font-mono-ed text-[10px] uppercase tracking-widest text-[#E2A93B]">
                  {activeTrack.sourceBadge}
                </span>
                <span className="px-2.5 py-1 bg-[#0B0E12]/90 hairline-all font-mono-ed text-[10px] uppercase tracking-widest text-[#C9C4B8]">
                  {activeTrack.eraTag}
                </span>
              </div>
              <div
                className={`absolute bottom-3 right-4 flex items-end gap-1 h-5 ${
                  isPlaying ? "playing" : ""
                }`}
              >
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="font-mono-ed text-[11px] uppercase tracking-widest text-[#29B6D1]">
                  {activeTrack.mood[lang]}
                </p>
                <h2 className="mt-1 font-serif-ed text-2xl text-[#F4F1EA] leading-snug">
                  {activeTrack.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#B8B4AA]">
                  {activeTrack.storyNote[lang]}
                </p>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progressPct}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="audio-range w-full"
                  aria-label="Seek"
                />
                <div className="flex items-center justify-between font-mono-ed text-[11px] text-[#8B95A5]">
                  <span>{fmt(currentTime)}</span>
                  <span>{duration ? fmt(duration) : activeTrack.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevTrack}
                    className="h-10 w-10 hairline-all text-[#C9C4B8] hover:text-[#F4F1EA] flex items-center justify-center font-mono-ed text-xs"
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="h-11 px-5 bg-[#E2A93B] text-[#0B0E12] hover:bg-[#F2C363] flex items-center justify-center gap-2 font-mono-ed text-xs font-bold uppercase tracking-widest"
                  >
                    <span>{isPlaying ? "❚❚" : "▶"}</span>
                    <span>
                      {isPlaying ? (isPt ? "Pausar" : "Pause") : isPt ? "Ouvir" : "Play"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={nextTrack}
                    className="h-10 w-10 hairline-all text-[#C9C4B8] hover:text-[#F4F1EA] flex items-center justify-center font-mono-ed text-xs"
                  >
                    ⏭
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-xs font-mono-ed text-[#8B95A5] hover:text-[#F4F1EA]"
                  >
                    {muted ? "MUTE" : "VOL"}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="audio-range w-20"
                    aria-label="Volume"
                  />
                </div>
              </div>

              <div className="pt-4 hairline-t flex items-center justify-between gap-3 text-xs">
                <span className="font-mono-ed text-[11px] text-[#8B95A5]">
                  {isPt ? "CONEXÃO NARRATIVA:" : "NARRATIVE LINK:"}
                </span>
                <button
                  type="button"
                  onClick={() => openCharacterModal(activeTrack.linkedCharId)}
                  className="font-mono-ed text-[11px] text-[#E2A93B] hover:underline"
                >
                  {activeTrack.linkedCharLabel} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Playlist */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#12161D] hairline-all divide-y divide-[#F4F1EA]/10">
            {filtered.map(({ tr, realIdx }) => {
              const isCurrent = realIdx === currentTrackIndex;
              const isPlayingThis = isCurrent && isPlaying;
              return (
                <div
                  key={tr.id}
                  onClick={() => selectTrack(realIdx, true)}
                  className={`p-4 sm:px-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isCurrent ? "bg-[#19202B]" : "hover:bg-[#F4F1EA]/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      className={`h-10 w-10 shrink-0 flex items-center justify-center hairline-all font-mono-ed text-xs ${
                        isPlayingThis
                          ? "bg-[#E2A93B] text-[#0B0E12] border-[#E2A93B]"
                          : isCurrent
                            ? "border-[#E2A93B] text-[#E2A93B]"
                            : "text-[#F4F1EA]"
                      }`}
                    >
                      {isPlayingThis ? "❚❚" : "▶"}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-ed text-[10px] text-[#8B95A5]">
                          {tr.code}
                        </span>
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrent ? "text-[#E2A93B]" : "text-[#F4F1EA]"
                          }`}
                        >
                          {tr.title}
                        </p>
                      </div>
                      <p className="text-xs text-[#8B95A5] mt-0.5 truncate">
                        {tr.mood[lang]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono-ed text-xs text-[#8B95A5]">
                    <span className="hidden sm:inline-block px-2 py-0.5 hairline-all text-[10px] text-[#B8B4AA]">
                      {tr.eraTag}
                    </span>
                    <span>{tr.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#12161D] hairline-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono-ed text-[11px] uppercase tracking-widest text-[#29B6D1]">
                {isPt ? "TESTADOR DE NOVAS FAIXAS" : "PROJECT TRACK TESTER"}
              </p>
              <p className="text-xs text-[#B8B4AA] leading-relaxed">
                {isPt
                  ? "Carregue outro áudio (.mp3, .wav ou .flac) do seu computador para testar no player. Para publicar definitivamente, adicione o .mp3 em public/audio/."
                  : "Load another audio file (.mp3, .wav, or .flac) from your device to preview it live. To publish permanently, place the .mp3 in public/audio/."}
              </p>
            </div>
            <label className="shrink-0 cursor-pointer px-4 py-2.5 hairline-all font-mono-ed text-xs uppercase tracking-wider text-[#F4F1EA] hover:border-[#29B6D1] hover:text-[#29B6D1] transition-colors text-center">
              <span>{isPt ? "+ Carregar Áudio" : "+ Load Audio"}</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addLocalTrack(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
