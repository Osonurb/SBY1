import type { Metadata } from "next";
import "./globals.css";
import { UniverseProvider } from "@/components/UniverseContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MiniPlayer } from "@/components/MiniPlayer";
import { CharacterModal } from "@/components/CharacterModal";

export const metadata: Metadata = {
  title: "yep a lot — Universo SBY",
  description:
    "yep a lot — Universo transmídia SBY (Sound Name, Broken Net, Yep, A Lot). Personagens, trilha sonora oficial, sala de redatores e arquivos secretos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="pb-20 min-h-screen flex flex-col">
        <div className="film-grain" aria-hidden="true" />
        <UniverseProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <MiniPlayer />
          <CharacterModal />
        </UniverseProvider>
      </body>
    </html>
  );
}
