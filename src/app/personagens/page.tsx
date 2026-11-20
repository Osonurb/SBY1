"use client";

import Link from "next/link";
import { useUniverse } from "@/components/UniverseContext";
import { CharacterGrid } from "@/components/CharacterGrid";

export default function PersonagensPage() {
  const { lang, loadingData, refreshWorkspace } = useUniverse();
  const isPt = lang === "pt";

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 hairline-b">
        <div>
          <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#8B95A5]">
            {isPt ? "ELENCO & EVIDÊNCIAS NARRATIVAS" : "CAST & NARRATIVE EVIDENCES"}
          </p>
          <h1 className="mt-2 font-serif-ed text-4xl sm:text-5xl text-[#F4F1EA] tracking-tight">
            {isPt ? "Personagens do Universo" : "Characters of the Universe"}
          </h1>
          <p className="mt-3 text-sm text-[#B8B4AA] max-w-2xl leading-relaxed">
            {isPt
              ? "Cada personagem representa uma evidência humana concreta. Personagens sem base visual permanecem como Arquivos Secretos; novas criações aprovadas na Sala de Redatores aparecem automaticamente aqui."
              : "Each character embodies a concrete human principle. Characters without visual bases remain Classified; new characters approved in the Writers' Room appear live here."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono-ed">
          <button
            type="button"
            onClick={() => refreshWorkspace()}
            disabled={loadingData}
            className="px-4 py-2.5 hairline-all text-[#B8B4AA] hover:text-[#F4F1EA] transition-colors disabled:opacity-50"
          >
            {loadingData
              ? isPt
                ? "Sincronizando..."
                : "Syncing..."
              : isPt
                ? "↻ Atualizar"
                : "↻ Refresh"}
          </button>
          <Link
            href="/redatores"
            className="px-4 py-2.5 bg-[#29B6D1] text-[#0B0E12] font-bold uppercase tracking-wider hover:bg-[#49C8E0] transition-colors"
          >
            {isPt ? "+ Criar / Escrever" : "+ Create / Write"}
          </Link>
        </div>
      </div>

      <CharacterGrid showFilters />
    </main>
  );
}
