"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 space-y-5">
      <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#E2A93B]">
        SBY · DIAGNÓSTICO DE SESSÃO
      </p>
      <h1 className="font-serif-ed text-3xl text-[#F4F1EA]">
        Ocorreu um erro inesperado na interface
      </h1>
      <p className="text-xs font-mono-ed text-[#E56B7A] bg-[#12161D] hairline-all p-4 break-words">
        {error?.message || "Erro desconhecido no cliente."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 bg-[#E2A93B] text-[#0B0E12] text-xs font-mono-ed font-bold uppercase tracking-widest"
      >
        Tentar novamente
      </button>
    </main>
  );
}
