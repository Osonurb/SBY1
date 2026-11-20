"use client";

import Link from "next/link";
import { useUniverse } from "@/components/UniverseContext";
import { CharacterGrid } from "@/components/CharacterGrid";
import { SecretArchive } from "@/components/SecretArchive";
import { assetPath } from "@/lib/assets";

export default function HomePage() {
  const { lang, era, revealed, clues, openCharacterModal } = useUniverse();
  const isPt = lang === "pt";
  const clueCount = Math.min(clues.length, 3);

  return (
    <main>
      {/* HERO */}
      <section className="relative hairline-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 font-mono-ed text-xs uppercase tracking-[0.2em] text-[#8B95A5]">
                <span>
                  {era === "broken"
                    ? isPt
                      ? "OBRA 02 · BROKEN NET (−10 ANOS)"
                      : "WORK 02 · BROKEN NET (−10 YEARS)"
                    : revealed
                      ? isPt
                        ? "OBRA 01 · REVELAÇÃO DO CÓDIGO"
                        : "WORK 01 · CODE REVEALED"
                      : isPt
                        ? "UNIVERSO SBY · FASE INICIAL"
                        : "SBY UNIVERSE · INITIAL PHASE"}
                </span>
                <span className="h-px w-8 bg-[#F4F1EA]/25" />
                <span className="text-[#E2A93B]">
                  {revealed
                    ? isPt
                      ? "CAMADA REVELADA"
                      : "LAYER REVEALED"
                    : isPt
                      ? "SEM SPOILERS"
                      : "SPOILER-FREE"}
                </span>
              </div>

              <h1
                className={`brand-mark text-6xl sm:text-7xl lg:text-8xl font-semibold text-[#F4F1EA] leading-[0.95] ${
                  revealed ? "revealed" : ""
                }`}
              >
                {revealed ? (
                  <>
                    Yep<span className="text-[#E2A93B]">,</span> A Lot
                  </>
                ) : (
                  "yep a lot"
                )}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#C9C4B8] max-w-xl">
                {era === "broken"
                  ? isPt
                    ? "Dez anos antes do desfecho: a internet caiu, as 66 Casas das Dandelions moldam destinos nas sombras e uma equipe improvável aprende o valor de uma simples pera."
                    : "Ten years before the climax: the internet has collapsed, the 66 Dandelion Houses shape destinies in the shadows, and an unlikely team learns the value of a simple pear."
                  : revealed
                    ? isPt
                      ? "Cada ocorrência espalhada pelo mundo formava um mapa. Entre o sacrifício de um Weight, as lágrimas da Dandelion e o enigma de Pey Tola, o título finalmente revela seu peso."
                      : "Every occurrence scattered across the globe formed a map. Between a Weight's sacrifice, the Dandelion's tears, and Pey Tola's riddle, the title finally reveals its true weight."
                    : isPt
                      ? "Uma expressão comum demais para parecer importante — até você perceber que ela atravessa músicas, cidades desconectadas e vidas inteiras. Explore os personagens e ouça a trilha original do universo."
                      : "An expression far too casual to seem important — until you realize it echoes across songs, disconnected cities, and entire lives. Explore the characters and listen to the official soundtrack."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/personagens"
                  className="px-6 py-3 bg-[#F4F1EA] text-[#0B0E12] text-xs font-semibold uppercase tracking-widest hover:bg-[#E2A93B] transition-colors"
                >
                  {isPt ? "Explorar Personagens" : "Explore Characters"}
                </Link>
                <Link
                  href="/trilha"
                  className="px-5 py-3 hairline-all text-[#E2A93B] text-xs font-mono-ed uppercase tracking-widest hover:bg-[#E2A93B]/10 transition-colors"
                >
                  {isPt ? "▶ Trilha Oficial" : "▶ Official OST"}
                </Link>
                <Link
                  href="/redatores"
                  className="px-5 py-3 hairline-all text-[#29B6D1] text-xs font-mono-ed uppercase tracking-widest hover:bg-[#29B6D1]/10 transition-colors"
                >
                  {isPt ? "✎ Sala de Redatores" : "✎ Writers' Room"}
                </Link>
              </div>

              <div className="pt-6 hairline-t max-w-xl">
                <div className="flex items-center justify-between text-xs font-mono-ed text-[#8B95A5] mb-2">
                  <span>
                    {isPt
                      ? "PISTAS DESCOBERTAS NA EXPLORAÇÃO"
                      : "CLUES DISCOVERED WHILE EXPLORING"}
                  </span>
                  <span className="text-[#E2A93B]">{clueCount} / 3</span>
                </div>
                <div className="h-1 w-full bg-[#1C222D] overflow-hidden">
                  <div
                    className="h-full bg-[#E2A93B] transition-all duration-500"
                    style={{ width: `${(clueCount / 3) * 100}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-[#8B95A5] leading-relaxed">
                  {revealed
                    ? isPt
                      ? "Revelação concluída: Yep, A Lot, o Bilhete Rasgado, Pey Tola e Broken Teacher estão liberados."
                      : "Revelation complete: Yep, A Lot, the Torn Note, Pey Tola, and Broken Teacher are now unlocked."
                    : isPt
                      ? "Dica: investigue as camadas de Anaira, alterne as idades de Estella ou decodifique o Arquivo Oculto abaixo."
                      : "Tip: inspect Anaira's dual layers, switch Estella's age phases, or decode the Hidden Archive below."}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative bg-[#12161D] hairline-all p-2.5">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0D1016]">
                  <img
                    src={
                      era === "broken"
                        ? assetPath("/images/characters/anaira_hoshiko_treinamento.jpg")
                        : assetPath("/images/characters/anaira_batalha.jpg")
                    }
                    alt="Anaira — IS 53 2 / Dandelion"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E12] via-[#0B0E12]/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono-ed text-[11px] uppercase tracking-[0.2em] text-[#E2A93B]">
                        {era === "broken"
                          ? "BROKEN NET · CRECHE DAS IS'"
                          : "IS 53 2 · DANDELION"}
                      </p>
                      <p className="font-serif-ed text-2xl text-[#F4F1EA] mt-0.5">
                        {era === "broken" ? "Anaira & Hoshiko" : "Anaira"}
                      </p>
                      <p className="text-xs text-[#C9C4B8] mt-1">
                        {era === "broken"
                          ? isPt
                            ? "Antes da separação das gêmeas"
                            : "Before the twins' paths diverged"
                          : isPt
                            ? "A garota dos cabelos vermelho-vinho"
                            : "The girl with crimson-wine hair"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCharacterModal("anaira")}
                      className="shrink-0 px-3 py-2 bg-[#0B0E12]/80 hairline-all text-[11px] font-mono-ed uppercase tracking-wider text-[#F4F1EA] hover:border-[#E2A93B] hover:text-[#E2A93B] transition-colors"
                    >
                      {isPt ? "Dossiê" : "Dossier"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 ACTS OF SBY */}
      <section className="hairline-b bg-[#0E1218]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 hairline-b">
            <div>
              <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#8B95A5]">
                {isPt ? "01 · CRONOLOGIA DO UNIVERSO SBY" : "01 · SBY UNIVERSE CHRONOLOGY"}
              </p>
              <h2 className="mt-2 font-serif-ed text-3xl sm:text-4xl text-[#F4F1EA] tracking-tight">
                {isPt
                  ? "Três eras. Duas perspectivas simultâneas."
                  : "Three eras. Two simultaneous perspectives."}
              </h2>
            </div>
            <p className="text-sm text-[#B8B4AA] max-w-md leading-relaxed">
              {isPt
                ? "A narrativa foi concebida para ser descoberta em camadas: eventos do passado e do futuro se espelham, transformando o sentido de cada gesto, música e símbolo."
                : "The narrative unfolds in layers: past and future mirror each other, transforming the meaning of every gesture, song, and symbol."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F4F1EA]/10 pt-2">
            <article className="py-8 md:pr-8 space-y-4">
              <div className="flex items-center justify-between font-mono-ed text-xs text-[#8B95A5]">
                <span>ATO 01</span>
                <span className="text-[#29B6D1]">
                  {isPt ? "ORIGEM MUSICAL" : "MUSICAL ORIGIN"}
                </span>
              </div>
              <h3 className="font-serif-ed text-2xl text-[#F4F1EA]">Sound Name</h3>
              <p className="text-sm text-[#B8B4AA] leading-relaxed">
                {isPt
                  ? "Cada cidadão recebe um instrumento musical ao nascer e só obtém registro civil após sua primeira composição. A arte molda mentes, mas também inaugura novas disputas de poder."
                  : "Every citizen receives a musical instrument at birth and only earns civil registration after their first composition. Art sharpens minds — and sparks new struggles for power."}
              </p>
            </article>

            <article className="py-8 md:px-8 space-y-4">
              <div className="flex items-center justify-between font-mono-ed text-xs text-[#8B95A5]">
                <span>ATO 02 · −10 ANOS</span>
                <span className="text-[#9E2436]">
                  {isPt ? "A DESCONEXÃO" : "THE DISCONNECTION"}
                </span>
              </div>
              <h3 className="font-serif-ed text-2xl text-[#F4F1EA]">Broken Net</h3>
              <p className="text-sm text-[#B8B4AA] leading-relaxed">
                {isPt
                  ? "Após a queda da internet, o mundo volta a depender do contato humano real. Surgem as 66 Casas das Dandelions, a Equipe PEARL e o segredo dos Weights."
                  : "After the global collapse of the internet, humanity returns to real bonds. The 66 Dandelion Houses rise alongside Team PEARL and the secret of the Weights."}
              </p>
            </article>

            <article className="py-8 md:pl-8 space-y-4">
              <div className="flex items-center justify-between font-mono-ed text-xs text-[#8B95A5]">
                <span>ATO 03 · PRESENTE</span>
                <span className="text-[#E2A93B]">{isPt ? "O CÓDIGO" : "THE CODE"}</span>
              </div>
              <h3
                className={`brand-mark text-2xl font-semibold text-[#F4F1EA] ${
                  revealed ? "revealed" : ""
                }`}
              >
                {revealed ? (
                  <>
                    Yep<span className="text-[#E2A93B]">,</span> A Lot
                  </>
                ) : (
                  "yep a lot"
                )}
              </h3>
              <p className="text-sm text-[#B8B4AA] leading-relaxed">
                {isPt
                  ? "Uma expressão aparentemente banal espalhada pelo mundo inteiro. Quando tudo parece perdido, reunir cada ocorrência dessa frase revela o verdadeiro peso da jornada."
                  : "An ordinary expression scattered across the entire planet. When everything seems lost, gathering every occurrence reveals the true weight of the journey."}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CHARACTERS PREVIEW */}
      <section className="hairline-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
            <div>
              <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#8B95A5]">
                {isPt ? "02 · DESTAQUES DO ELENCO" : "02 · FEATURED CAST"}
              </p>
              <h2 className="mt-2 font-serif-ed text-3xl sm:text-4xl text-[#F4F1EA]">
                {isPt ? "Personagens & Arquivos Secretos" : "Characters & Classified Files"}
              </h2>
            </div>
            <Link
              href="/personagens"
              className="px-5 py-2.5 hairline-all font-mono-ed text-xs uppercase tracking-wider text-[#E2A93B] hover:bg-[#E2A93B]/10 transition-colors self-start"
            >
              {isPt ? "Ver elenco completo →" : "View full cast →"}
            </Link>
          </div>

          <CharacterGrid limit={6} showFilters={false} />
        </div>
      </section>

      {/* MY DRIVE & YEP A UNIVERSITY */}
      <section className="bg-[#F4F1EA] text-[#14171D]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="bg-[#14171D] p-3 shadow-2xl">
                <img
                  src={assetPath("/images/characters/capa_esboco_01a.jpg")}
                  alt="Capa Esboço de História 0.1.A"
                  className="w-full h-auto block"
                />
              </div>
              <p className="mt-3 font-mono-ed text-[11px] uppercase tracking-widest text-[#525866]">
                EDIÇÃO 0.1.A · BRUNO MOREIRA E SILVA · UNIVERSO SBY
              </p>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#8B1E2D]">
                  {isPt ? "03 · ECOSSISTEMA TRANSMÍDIA" : "03 · TRANSMEDIA ECOSYSTEM"}
                </p>
                <h2 className="mt-2 font-serif-ed text-3xl sm:text-4xl text-[#14171D] tracking-tight">
                  {isPt ? "Do livro físico ao mundo real" : "From physical books to the real world"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                <div className="space-y-3 pt-4 border-t border-[#14171D]/20">
                  <p className="font-mono-ed text-xs uppercase tracking-widest text-[#8B1E2D]">
                    MY DRIVE IN YOUR HEART
                  </p>
                  <h3 className="font-serif-ed text-xl text-[#14171D]">
                    {isPt
                      ? "Livro físico + Pen-Drive Audiobook"
                      : "Physical Book + Audiobook Flash Drive"}
                  </h3>
                  <p className="text-sm text-[#3F4552] leading-relaxed">
                    {isPt
                      ? "Edições impressas acompanhadas de pen-drive colecionável com audiolivro e trilhas — abraçando o compartilhamento orgânico como semente de dente-de-leão."
                      : "Printed editions paired with a collectible flash drive carrying the audiobook and score — embracing organic sharing like dandelion seeds."}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#14171D]/20">
                  <p className="font-mono-ed text-xs uppercase tracking-widest text-[#0F766E]">
                    YEP, A UNIVERSITY · FEATS
                  </p>
                  <h3 className="font-serif-ed text-xl text-[#14171D]">
                    {isPt
                      ? "Ficção conectada a obras reais"
                      : "Fiction connected to real-world books"}
                  </h3>
                  <p className="text-sm text-[#3F4552] leading-relaxed">
                    {isPt
                      ? 'Inspirada na pesquisa de Estella (Stella Maran Go) sobre Espelhamento e repertório, a plataforma conecta livros reais — como "A Arte do Flop" — diretamente aos personagens.'
                      : 'Inspired by Estella (Stella Maran Go)\'s research on Mirroring, the platform bridges real books — such as "A Arte do Flop" — directly with character arcs.'}
                  </p>
                </div>
              </div>

              <blockquote className="border-l-2 border-[#8B1E2D] pl-5 py-1">
                <p className="font-serif-ed italic text-lg sm:text-xl text-[#14171D]">
                  {isPt
                    ? '"Uma organização saudável não precisa prender todas as pessoas ao seu núcleo — precisa plantar uma semente de propósito que continue viva mesmo nos elétrons livres."'
                    : '"A healthy organization does not need to trap everyone at its core — it must plant a seed of purpose that stays alive even in free electrons."'}
                </p>
                <footer className="mt-2 font-mono-ed text-xs uppercase tracking-widest text-[#525866]">
                  {isPt
                    ? "ARQUIVO DO PROFESSOR · ENGENHARIA DE PESSOAS"
                    : "THE PROFESSOR'S ARCHIVE · HUMAN ENGINEERING"}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* SECRET ARCHIVE */}
      <SecretArchive />
    </main>
  );
}
