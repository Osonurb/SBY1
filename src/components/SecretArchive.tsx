"use client";

import { useState } from "react";
import { useUniverse } from "@/components/UniverseContext";

export function SecretArchive() {
  const { lang, revealed, triggerReveal, resetReveal } = useUniverse();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const isPt = lang === "pt";

  const handleDecode = (input?: string) => {
    const val = input ?? code;
    const ok = triggerReveal(val);
    if (!ok) {
      setError(true);
    } else {
      setError(false);
      setCode(val);
    }
  };

  return (
    <section id="archive" className="hairline-t bg-[#080A0E]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#E2A93B]">
            {isPt
              ? "ARQUIVO INTERATIVO & CÓDIGO OCULTO"
              : "INTERACTIVE ARCHIVE & HIDDEN CODE"}
          </p>
          <h2 className="mt-2 font-serif-ed text-3xl sm:text-4xl text-[#F4F1EA] tracking-tight">
            {revealed
              ? isPt
                ? "A pontuação mudou. O código foi despertado."
                : "The punctuation shifted. The code is awake."
              : isPt
                ? "Algumas verdades só aparecem quando você procura."
                : "Some truths only surface when you look closely."}
          </h2>
          <p className="mt-3 text-sm text-[#B8B4AA] leading-relaxed">
            {revealed
              ? isPt
                ? "Você revelou a forma definitiva do título (Yep, A Lot) e liberou os artefatos secretos de Broken Net e da Equipe PEARL."
                : "You unlocked the true form of the title (Yep, A Lot) and decrypted the classified artifacts of Broken Net and Team PEARL."
              : isPt
                ? "No início da jornada, o título aparece apenas como yep a lot — sem maiúsculas e sem vírgula. Insira uma das chaves do universo abaixo para decodificar a segunda camada do site."
                : "At the beginning of the journey, the title appears strictly as yep a lot — lowercase and unpunctuated. Enter one of the universe keys below to unlock the second layer."}
          </p>
        </div>

        {!revealed ? (
          <div className="mt-8 bg-[#10141B] hairline-all p-6 sm:p-8 max-w-3xl space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDecode();
                }}
                placeholder={
                  isPt
                    ? "Digite um código (ex: IS 53 2, PEARL, Pey Tola)..."
                    : "Enter a key (e.g. IS 53 2, PEARL, Pey Tola)..."
                }
                className="flex-1 studio-input px-4 py-3 text-sm font-mono-ed placeholder-[#64748B]"
              />
              <button
                type="button"
                onClick={() => handleDecode()}
                className="px-6 py-3 bg-[#E2A93B] text-[#0B0E12] text-xs font-mono-ed font-bold uppercase tracking-widest hover:bg-[#F2C363] transition-colors shrink-0"
              >
                {isPt ? "Decodificar" : "Decode"}
              </button>
            </div>

            {error && (
              <p className="text-xs font-mono-ed text-[#E56B7A]">
                {isPt
                  ? "Código não reconhecido. Tente IS 53 2, PEARL ou Pey Tola."
                  : "Unrecognized key. Try IS 53 2, PEARL, or Pey Tola."}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono-ed text-[#8B95A5] mr-1">
                {isPt ? "Chaves rápidas (demo):" : "Quick keys (demo):"}
              </span>
              {["IS 53 2", "PEARL", "Pey Tola"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleDecode(chip)}
                  className="px-2.5 py-1 hairline-all font-mono-ed text-[#D8D3C8] hover:border-[#E2A93B] hover:text-[#E2A93B] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <div className="bg-[#12171F] border border-[#E2A93B]/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#E2A93B]">
                  {isPt
                    ? "CAMADA DESBLOQUEADA · REVELAÇÃO TIPOGRÁFICA"
                    : "LAYER UNLOCKED · TYPOGRAPHIC REVELATION"}
                </p>
                <p className="mt-1 font-serif-ed text-2xl sm:text-3xl text-[#F4F1EA]">
                  <span className="line-through text-[#64748B] font-sans text-xl mr-3">
                    yep a lot
                  </span>
                  → Yep<span className="text-[#E2A93B]">,</span> A Lot
                </p>
              </div>
              <button
                type="button"
                onClick={resetReveal}
                className="px-4 py-2.5 hairline-all text-xs font-mono-ed uppercase tracking-wider text-[#C9C4B8] hover:text-[#F4F1EA] transition-colors self-start sm:self-center"
              >
                {isPt ? "Voltar ao modo sem spoilers" : "Return to spoiler-free mode"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#12161D] hairline-all overflow-hidden flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-[#0B0E12]">
                  <img
                    src="/images/characters/bilhete_enigma.jpg"
                    alt="Bilhete rasgado"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2.5 flex-1">
                  <p className="font-mono-ed text-[11px] uppercase tracking-widest text-[#E2A93B]">
                    {isPt ? "ARTEFATO 01 · PISTA DO FUTURO" : "ARTIFACT 01 · CLUE FROM THE FUTURE"}
                  </p>
                  <h3 className="font-serif-ed text-xl text-[#F4F1EA]">
                    {isPt ? "O Bilhete Rasgado" : "The Torn Note"}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#B8B4AA]">
                    {isPt
                      ? 'Encontrado intencionalmente por Estella, Anaira ou Racso: "Lumem é morto pelo professor. Good professor. Porque?" — um enigma que redefine a lealdade de toda a Equipe PEARL.'
                      : 'Intentionally discovered by Estella, Anaira, or Racso: "Lumem is killed by the professor. Good professor. Why?" — a riddle reshaping Team PEARL\'s loyalties.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#12161D] hairline-all p-6 flex flex-col justify-between space-y-6 classified-bg">
                <div className="space-y-3">
                  <p className="font-mono-ed text-[11px] uppercase tracking-widest text-[#29B6D1]">
                    {isPt ? "ARTEFATO 02 · CHAVE NARRATIVA" : "ARTIFACT 02 · NARRATIVE KEY"}
                  </p>
                  <h3 className="font-serif-ed text-2xl text-[#F4F1EA]">Pey Tola</h3>
                  <p className="text-xs leading-relaxed text-[#C9C4B8]">
                    {isPt
                      ? "Por trás da escolha aparentemente improvável da equipe — unindo uma infiltrada das Dandelions, um jovem de sorte instável e a discípula do Professor — existe uma assinatura oculta ligada ao código espalhado pelo mundo."
                      : "Behind the seemingly impossible roster of the team — uniting a Dandelion infiltrator, a boy with volatile luck, and the Professor's disciple — lies a hidden signature tied to the global code."}
                  </p>
                </div>
                <div className="pt-4 hairline-t space-y-2 font-mono-ed text-[11px] text-[#8B95A5]">
                  <div className="flex justify-between">
                    <span>STATUS</span>
                    <span className="text-[#E2A93B]">ATIVADO / ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PROTOCOLO</span>
                    <span>PEARL · 66 CASAS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isPt ? "SIGNIFICADO" : "MEANING"}</span>
                    <span>{isPt ? "RESERVADO AO CLÍMAX" : "RESERVED FOR CLIMAX"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#12161D] hairline-all overflow-hidden flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-[#0B0E12]">
                  <img
                    src="/images/characters/broken_teacher.jpg"
                    alt="Broken Teacher"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 space-y-2.5 flex-1">
                  <p className="font-mono-ed text-[11px] uppercase tracking-widest text-[#9E2436]">
                    {isPt ? "ARTEFATO 03 · SINAL DESCRIPTOGRAFADO" : "ARTIFACT 03 · DECRYPTED SIGNAL"}
                  </p>
                  <h3 className="font-serif-ed text-xl text-[#F4F1EA]">Broken Teacher</h3>
                  <p className="text-xs leading-relaxed text-[#B8B4AA]">
                    {isPt
                      ? "O único estrategista capaz de colocar o próprio Professor contra a parede — e o responsável pela quebra da internet. Seu perfil completo foi liberado na página de Personagens."
                      : "The only strategist capable of cornering the Professor himself — and the architect behind the global internet collapse. His full profile is now unlocked on the Characters page."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
