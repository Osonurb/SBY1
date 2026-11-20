"use client";

import { useUniverse } from "@/components/UniverseContext";

export function Footer() {
  const { lang, revealed } = useUniverse();

  return (
    <footer className="hairline-t bg-[#07090C] py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8B95A5]">
        <div className="space-y-1">
          <p
            className={`brand-mark text-base text-[#F4F1EA] font-semibold ${
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
          </p>
          <p>
            {lang === "pt"
              ? "Universo SBY por Bruno Moreira e Silva · Next.js + Supabase."
              : "SBY Universe by Bruno Moreira e Silva · Next.js + Supabase."}
          </p>
        </div>
        <div className="font-mono-ed text-[11px] uppercase tracking-widest text-[#64748B]">
          SOUND NAME · BROKEN NET · {revealed ? "YEP, A LOT" : "YEP A LOT"}
        </div>
      </div>
    </footer>
  );
}
