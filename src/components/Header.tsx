"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUniverse } from "@/components/UniverseContext";

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, era, setEra, revealed, resetReveal } = useUniverse();

  const navItems = [
    { href: "/", pt: "Início", en: "Home" },
    { href: "/personagens", pt: "Personagens", en: "Characters" },
    { href: "/trilha", pt: "Trilha Oficial", en: "Official OST" },
    { href: "/redatores", pt: "Redatores", en: "Writers' Room", accent: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E12]/90 backdrop-blur-md hairline-b">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2.5 focus:outline-none">
          <span
            className={`brand-mark text-xl sm:text-2xl font-semibold text-[#F4F1EA] ${
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
          </span>
          <span className="hidden sm:inline-block font-mono-ed text-[11px] uppercase tracking-widest text-[#8B95A5]">
            SBY
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  active
                    ? "text-[#F4F1EA] font-semibold"
                    : item.accent
                      ? "text-[#29B6D1] hover:text-[#F4F1EA]"
                      : "text-[#B8B4AA] hover:text-[#F4F1EA]"
                }`}
              >
                {lang === "pt" ? item.pt : item.en}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center hairline-all p-0.5 text-[11px] font-mono-ed">
            <button
              type="button"
              onClick={() => setEra("broken")}
              className={`px-2.5 py-1 transition-colors ${
                era === "broken"
                  ? "bg-[#F4F1EA] text-[#0B0E12] font-medium"
                  : "text-[#8B95A5] hover:text-[#F4F1EA]"
              }`}
            >
              Broken Net
            </button>
            <button
              type="button"
              onClick={() => setEra("yep")}
              className={`px-2.5 py-1 transition-colors ${
                era === "yep"
                  ? "bg-[#F4F1EA] text-[#0B0E12] font-medium"
                  : "text-[#8B95A5] hover:text-[#F4F1EA]"
              }`}
            >
              {revealed ? "Yep, A Lot" : "yep a lot"}
            </button>
          </div>

          <div className="flex items-center hairline-all p-0.5 text-[11px] font-mono-ed">
            <button
              type="button"
              onClick={() => setLang("pt")}
              className={`px-2.5 py-1 transition-colors ${
                lang === "pt"
                  ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
                  : "text-[#8B95A5] hover:text-[#F4F1EA]"
              }`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition-colors ${
                lang === "en"
                  ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
                  : "text-[#8B95A5] hover:text-[#F4F1EA]"
              }`}
            >
              EN
            </button>
          </div>

          {revealed && (
            <button
              type="button"
              onClick={resetReveal}
              className="px-2.5 py-1.5 hairline-all text-[11px] font-mono-ed text-[#E2A93B] hover:bg-[#E2A93B]/10 transition-colors"
            >
              {lang === "pt" ? "Ocultar" : "Hide"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden hairline-t px-5 py-2 flex items-center justify-between gap-2 text-[11px] font-mono-ed uppercase tracking-wider overflow-x-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 py-1 ${
                active
                  ? "text-[#E2A93B] font-semibold"
                  : item.accent
                    ? "text-[#29B6D1]"
                    : "text-[#B8B4AA]"
              }`}
            >
              {lang === "pt" ? item.pt : item.en}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
