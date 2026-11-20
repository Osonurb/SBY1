"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0B0E12] text-[#F4F1EA] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#12161D] border border-[#F4F1EA]/15 p-6 space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#E2A93B]">
            SBY · DIAGNÓSTICO GLOBAL
          </p>
          <h1 className="text-2xl font-serif">Ocorreu um erro no cliente</h1>
          <p className="text-xs font-mono text-[#E56B7A] bg-[#0B0E12] p-3 break-words">
            {error?.message || "Erro desconhecido."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-[#E2A93B] text-[#0B0E12] text-xs font-mono font-bold uppercase tracking-wider"
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
