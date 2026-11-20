"use client";

import { useState } from "react";
import Link from "next/link";
import { useUniverse } from "@/components/UniverseContext";
import { SilhouetteSVG } from "@/components/SilhouetteSVG";

interface CharacterGridProps {
  limit?: number;
  showFilters?: boolean;
}

export function CharacterGrid({ limit, showFilters = true }: CharacterGridProps) {
  const {
    lang,
    revealed,
    allPublishedCharacters,
    writings,
    profile,
    estellaPhase,
    setEstellaPhase,
    openCharacterModal,
  } = useUniverse();

  const [filter, setFilter] = useState("all");
  const isPt = lang === "pt";

  const filtered = allPublishedCharacters.filter(
    (c) => filter === "all" || c.categories.includes(filter)
  );
  const items = limit ? filtered.slice(0, limit) : filtered;

  const filterButtons = [
    { key: "all", label: isPt ? `Todos (${allPublishedCharacters.length})` : `All (${allPublishedCharacters.length})` },
    { key: "visual", label: isPt ? "Acervo Visual" : "Visual Archive" },
    { key: "secret", label: isPt ? "Arquivos Secretos" : "Classified Files", gold: true },
    { key: "dandelions", label: isPt ? "66 Casas / IS'" : "66 Houses / IS'" },
    { key: "weights", label: isPt ? "Weights & Enigmas" : "Weights & Enigmas" },
    { key: "community", label: isPt ? "Redatores" : "Writers", cyan: true },
  ];

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="flex flex-wrap gap-2 text-xs font-mono-ed">
          {filterButtons.map((btn) => {
            const active = filter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setFilter(btn.key)}
                className={`px-3.5 py-2 transition-colors ${
                  active
                    ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
                    : btn.gold
                      ? "hairline-all text-[#E2A93B] hover:bg-[#E2A93B]/10"
                      : btn.cyan
                        ? "hairline-all text-[#29B6D1] hover:bg-[#29B6D1]/10"
                        : "hairline-all text-[#B8B4AA] hover:text-[#F4F1EA]"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-[#12161D] hairline-all p-10 text-center space-y-3">
          <p className="text-sm text-[#B8B4AA]">
            {isPt
              ? "Nenhum personagem publicado nesta categoria ainda."
              : "No published characters in this category yet."}
          </p>
          <Link
            href="/redatores"
            className="inline-block px-4 py-2 hairline-all font-mono-ed text-xs text-[#29B6D1] hover:border-[#29B6D1]"
          >
            {isPt
              ? "+ Criar personagem na Sala de Redatores"
              : "+ Create a character in the Writers' Room"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => {
            const isVeiled = Boolean(c.requiresReveal && !revealed);
            const writingsCount = writings.filter(
              (w) =>
                w.characterId === c.id &&
                (w.status === "published" || profile.role === "admin")
            ).length;

            const descText =
              c.specialType === "estella" && c.phases
                ? isPt
                  ? c.phases[estellaPhase].descPt
                  : c.phases[estellaPhase].descEn
                : isVeiled
                  ? isPt
                    ? "Identidade e motivação bloqueadas até a revelação tipográfica do universo."
                    : "Identity and motive locked until the universe's typographic revelation."
                  : c.summary[lang];

            return (
              <article
                key={c.id}
                onClick={() => {
                  if (isVeiled) {
                    const el = document.getElementById("archive");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    return;
                  }
                  openCharacterModal(c.id);
                }}
                className="char-card cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {!c.hasVisual ? (
                    <div className="relative aspect-[4/3] classified-bg flex flex-col items-center justify-center p-6 hairline-b overflow-hidden">
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B0E12]/90 hairline-all font-mono-ed text-[10px] uppercase tracking-widest text-[#E2A93B]">
                        {isPt ? "ARQUIVO VISUAL SECRETO" : "CLASSIFIED VISUAL FILE"}
                      </div>
                      {c.isCustom && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-[#29B6D1]/20 border border-[#29B6D1]/40 font-mono-ed text-[10px] text-[#29B6D1] uppercase">
                          {isPt ? "REDATOR" : "WRITER"}
                        </div>
                      )}
                      <SilhouetteSVG type={c.silhouette} />
                      <div className="mt-3 font-mono-ed text-[10px] uppercase tracking-[0.25em] text-[#64748B]">
                        [ VISUAL REDACTED · SBY ]
                      </div>
                    </div>
                  ) : isVeiled ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0C10] hairline-b">
                      <img
                        src={c.img}
                        alt={c.name}
                        className="w-full h-full object-cover object-top blur-md opacity-25 scale-110"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-[#0B0E12]/60">
                        <span className="px-2.5 py-1 bg-[#9E2436]/90 text-[#F4F1EA] font-mono-ed text-[10px] uppercase tracking-widest">
                          {isPt ? "SINAL CORROMPIDO" : "CORRUPTED SIGNAL"}
                        </span>
                        <p className="mt-3 font-mono-ed text-xs text-[#C9C4B8]">
                          {isPt
                            ? "Decodifique o Arquivo Oculto na Home para liberar"
                            : "Decode the Hidden Archive on Home to unlock"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0C10] hairline-b">
                      <img
                        src={
                          c.specialType === "estella" && c.phases
                            ? c.phases[estellaPhase].src
                            : c.img
                        }
                        alt={c.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12161D] via-transparent to-transparent opacity-80" />
                      {c.isCustom && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-[#0B0E12]/85 border border-[#29B6D1]/50 font-mono-ed text-[10px] text-[#29B6D1] uppercase">
                          {isPt ? "REDATOR" : "WRITER"}
                        </div>
                      )}
                      {c.specialType === "estella" && c.phases && (
                        <div className="absolute bottom-3 left-3 right-3 flex gap-1 bg-[#0B0E12]/85 backdrop-blur-sm p-1 hairline-all">
                          {c.phases.map((p, idx) => (
                            <button
                              key={p.agePt}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEstellaPhase(idx);
                              }}
                              className={`flex-1 py-1 text-[10px] font-mono-ed uppercase tracking-wider transition-colors ${
                                estellaPhase === idx
                                  ? "bg-[#29B6D1] text-[#0B0E12] font-bold"
                                  : "text-[#C9C4B8] hover:text-[#F4F1EA]"
                              }`}
                            >
                              {isPt ? p.agePt : p.ageEn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono-ed text-[11px] uppercase tracking-wider truncate"
                        style={{ color: c.accent }}
                      >
                        {c.codename}
                      </span>
                      {writingsCount > 0 && (
                        <span className="shrink-0 font-mono-ed text-[10px] text-[#29B6D1]">
                          ✎ {writingsCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif-ed text-2xl text-[#F4F1EA] group-hover:text-[#E2A93B] transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-[#8B95A5] mt-0.5">{c.role[lang]}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-[#C9C4B8] line-clamp-3">
                      {descText}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 hairline-t flex items-center justify-between text-[11px] font-mono-ed">
                  <span className="text-[#8B95A5] truncate pr-3">
                    {isPt ? "Evidência" : "Evidence"}:{" "}
                    <span className="text-[#D8D3C8]">{c.evidence[lang].split(",")[0]}</span>
                  </span>
                  <span className="shrink-0 text-[#E2A93B]">
                    {isVeiled
                      ? isPt
                        ? "Requer revelação →"
                        : "Requires reveal →"
                      : isPt
                        ? "Abrir dossiê →"
                        : "Open dossier →"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
