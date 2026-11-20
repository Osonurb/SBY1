"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUniverse } from "@/components/UniverseContext";
import { SilhouetteSVG } from "@/components/SilhouetteSVG";

export function CharacterModal() {
  const router = useRouter();
  const {
    lang,
    modalCharId,
    closeCharacterModal,
    allCharactersIncludingDrafts,
    writings,
    estellaPhase,
    setEstellaPhase,
    registerClue,
  } = useUniverse();

  const [anairaMode, setAnairaMode] = useState<"public" | "tactical">("public");
  const [selectedGallerySrc, setSelectedGallerySrc] = useState<string | null>(null);

  const character = allCharactersIncludingDrafts.find((c) => c.id === modalCharId);

  useEffect(() => {
    setSelectedGallerySrc(null);
  }, [modalCharId]);

  useEffect(() => {
    if (!modalCharId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCharacterModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalCharId, closeCharacterModal]);

  if (!character) return null;

  const isPt = lang === "pt";
  const linkedWritings = writings.filter((w) => w.characterId === character.id);
  const mainBio =
    character.specialType === "estella" && character.phases
      ? `${character.summary[lang]} ${
          isPt
            ? character.phases[estellaPhase].descPt
            : character.phases[estellaPhase].descEn
        }`
      : character.summary[lang];

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCharacterModal();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#10141B] hairline-all shadow-2xl">
        <button
          type="button"
          onClick={closeCharacterModal}
          className="sticky top-4 float-right mr-4 z-10 h-9 w-9 bg-[#0B0E12]/90 hairline-all text-[#F4F1EA] hover:border-[#E2A93B] hover:text-[#E2A93B] flex items-center justify-center font-mono-ed text-sm transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Visual Column */}
          <div className="md:col-span-5">
            {!character.hasVisual ? (
              <div className="classified-bg hairline-all aspect-[4/5] flex flex-col items-center justify-center p-8 text-center">
                <span className="px-3 py-1 bg-[#0B0E12] hairline-all font-mono-ed text-[11px] uppercase tracking-widest text-[#E2A93B] mb-6">
                  {isPt ? "ARQUIVO VISUAL SECRETO" : "CLASSIFIED VISUAL FILE"}
                </span>
                <SilhouetteSVG type={character.silhouette} />
                <p className="mt-6 text-xs text-[#8B95A5] leading-relaxed max-w-xs">
                  {isPt
                    ? "Base visual mantida oficialmente em sigilo nesta fase de lançamento para preservar o mistério da obra."
                    : "Official visual artwork is intentionally kept classified during this launch phase to preserve narrative mystery."}
                </p>
              </div>
            ) : character.specialType === "estella" && character.phases ? (
              <div className="space-y-3">
                <div className="bg-[#0B0E12] hairline-all overflow-hidden aspect-[3/4]">
                  <img
                    src={character.phases[estellaPhase].src}
                    alt={character.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {character.phases.map((ph, idx) => (
                    <button
                      key={ph.agePt}
                      type="button"
                      onClick={() => setEstellaPhase(idx)}
                      className={`py-2 px-2 text-[11px] font-mono-ed uppercase tracking-wider hairline-all transition-colors ${
                        estellaPhase === idx
                          ? "bg-[#29B6D1] text-[#0B0E12] font-bold border-[#29B6D1]"
                          : "text-[#C9C4B8] hover:text-[#F4F1EA]"
                      }`}
                    >
                      {isPt ? ph.agePt : ph.ageEn}
                    </button>
                  ))}
                </div>
              </div>
            ) : character.gallery && character.gallery.length > 1 ? (
              <div className="space-y-3">
                <div className="bg-[#0B0E12] hairline-all overflow-hidden aspect-[4/5]">
                  <img
                    src={selectedGallerySrc || character.gallery[0].src}
                    alt={character.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {character.gallery.map((g) => (
                    <button
                      key={g.src}
                      type="button"
                      onClick={() => setSelectedGallerySrc(g.src)}
                      className="bg-[#0B0E12] hairline-all overflow-hidden aspect-square hover:border-[#E2A93B] transition-colors"
                    >
                      <img
                        src={g.src}
                        alt={g[lang]}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#0B0E12] hairline-all overflow-hidden aspect-[4/5]">
                <img
                  src={character.img}
                  alt={character.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}
          </div>

          {/* Right Dossier Column */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <p
                className="font-mono-ed text-xs uppercase tracking-[0.2em]"
                style={{ color: character.accent }}
              >
                {character.codename}
              </p>
              <h3 className="mt-1 font-serif-ed text-3xl sm:text-4xl text-[#F4F1EA]">
                {character.name}
              </h3>
              <p className="text-sm text-[#8B95A5] mt-1">{character.role[lang]}</p>
            </div>

            <div
              className="py-3 px-4 bg-[#0B0E12] border-l-2"
              style={{ borderColor: character.accent }}
            >
              <p className="font-mono-ed text-[10px] uppercase tracking-widest text-[#8B95A5]">
                {isPt ? "Evidência Narrativa" : "Narrative Evidence"}
              </p>
              <p className="text-sm text-[#F4F1EA] mt-0.5">{character.evidence[lang]}</p>
            </div>

            <p className="text-sm leading-relaxed text-[#C9C4B8]">{mainBio}</p>

            {/* Anaira Duality Toggle */}
            {character.specialType === "anaira" && character.publicMode && character.tacticalMode && (
              <div className="pt-4 hairline-t space-y-3">
                <div className="flex items-center gap-2 font-mono-ed text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAnairaMode("public");
                      registerClue("anaira_dossier");
                    }}
                    className={`px-3 py-1.5 transition-colors ${
                      anairaMode === "public"
                        ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
                        : "hairline-all text-[#B8B4AA]"
                    }`}
                  >
                    {isPt ? "Perfil Público (Influencer)" : "Public Profile (Influencer)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnairaMode("tactical");
                      registerClue("anaira_dossier");
                    }}
                    className={`px-3 py-1.5 transition-colors ${
                      anairaMode === "tactical"
                        ? "bg-[#9E2436] text-[#F4F1EA] font-semibold"
                        : "hairline-all text-[#B8B4AA]"
                    }`}
                  >
                    {isPt ? "Camada Oculta (IS 53 2)" : "Hidden Layer (IS 53 2)"}
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-[#D8D3C8] bg-[#0B0E12] hairline-all p-3.5">
                  {anairaMode === "public"
                    ? character.publicMode[lang]
                    : character.tacticalMode[lang]}
                </p>
              </div>
            )}

            <div className="pt-4 hairline-t">
              <p className="font-mono-ed text-[10px] uppercase tracking-widest text-[#8B95A5]">
                {isPt ? "CITAÇÃO-CHAVE" : "SIGNATURE LINE"}
              </p>
              <p className="mt-1 font-serif-ed italic text-lg text-[#E2A93B]">
                {character.quote[lang]}
              </p>
            </div>

            <div className="pt-4 hairline-t">
              <p className="font-mono-ed text-[10px] uppercase tracking-widest text-[#8B95A5] mb-2.5">
                {isPt ? "CONEXÕES NO UNIVERSO" : "UNIVERSE CONNECTIONS"}
              </p>
              <div className="flex flex-wrap gap-2">
                {character.connections.map((conn) => (
                  <span
                    key={conn}
                    className="px-2.5 py-1 bg-[#0B0E12] hairline-all font-mono-ed text-[11px] text-[#C9C4B8]"
                  >
                    {conn}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Writings from Cloud/Local */}
            <div className="pt-5 hairline-t space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono-ed text-[10px] uppercase tracking-widest text-[#29B6D1]">
                  {isPt ? "TEXTOS & CRÔNICAS DOS REDATORES" : "WRITERS' ROOM CHRONICLES"} (
                  {linkedWritings.length})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCharacterModal();
                    router.push(`/redatores?char=${encodeURIComponent(character.id)}`);
                  }}
                  className="px-3 py-1.5 hairline-all font-mono-ed text-[10px] uppercase tracking-wider text-[#29B6D1] hover:bg-[#29B6D1]/10 transition-colors"
                >
                  {isPt ? "+ Escrever sobre este personagem" : "+ Write about this character"}
                </button>
              </div>

              {linkedWritings.length > 0 ? (
                <div className="space-y-2.5">
                  {linkedWritings.map((w) => (
                    <div key={w.id} className="bg-[#0B0E12] hairline-all p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-serif-ed text-base text-[#F4F1EA]">{w.title}</p>
                        <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] font-mono-ed text-[10px] uppercase">
                          {w.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#B8B4AA] leading-relaxed whitespace-pre-line">
                        {w.body}
                      </p>
                      <p className="font-mono-ed text-[10px] text-[#64748B]">
                        {w.authorName} · {w.era}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B]">
                  {isPt
                    ? "Nenhum texto vinculado ainda. Clique acima para escrever na Sala de Redatores."
                    : "No linked chronicles yet. Click above to write in the Writers' Room."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
