"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BASE_CHARACTERS, OFFICIAL_TRACKS, VALID_REVEAL_CODES } from "@/data/universe";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { fetchWorkspaceData } from "@/lib/repository";
import type {
  CharacterItem,
  Era,
  Lang,
  TrackItem,
  UserRole,
  WriterProfile,
  WritingEntry,
} from "@/lib/types";

interface ToastState {
  title: string;
  body: string;
}

interface UniverseContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  era: Era;
  setEra: (era: Era) => void;
  revealed: boolean;
  triggerReveal: (code: string) => boolean;
  resetReveal: () => void;
  clues: string[];
  registerClue: (id: string) => void;
  estellaPhase: number;
  setEstellaPhase: (idx: number) => void;
  // Data
  customCharacters: CharacterItem[];
  writings: WritingEntry[];
  allPublishedCharacters: CharacterItem[];
  allCharactersIncludingDrafts: CharacterItem[];
  loadingData: boolean;
  refreshWorkspace: () => Promise<void>;
  // Auth / Writer profile
  profile: WriterProfile;
  setLocalWriterName: (name: string) => void;
  setLocalWriterRole: (role: UserRole) => void;
  signInCloud: (email: string, password: string) => Promise<string | null>;
  signUpCloud: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOutCloud: () => Promise<void>;
  // Modal
  modalCharId: string | null;
  openCharacterModal: (id: string) => void;
  closeCharacterModal: () => void;
  // Persistent Audio Player
  tracks: TrackItem[];
  addLocalTrack: (file: File) => void;
  currentTrackIndex: number;
  isPlaying: boolean;
  hasStartedAudio: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  selectTrack: (idx: number, autoPlay?: boolean) => void;
  togglePlay: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
  seekTo: (pct: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  // Toast
  toast: ToastState | null;
  showToast: (title: string, body: string) => void;
}

const UniverseContext = createContext<UniverseContextValue | null>(null);

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  const [era, setEra] = useState<Era>("yep");
  const [revealed, setRevealed] = useState(false);
  const [clues, setClues] = useState<string[]>([]);
  const [estellaPhase, setEstellaPhaseState] = useState(1);

  const [customCharacters, setCustomCharacters] = useState<CharacterItem[]>([]);
  const [writings, setWritings] = useState<WritingEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [profile, setProfile] = useState<WriterProfile>({
    id: null,
    email: null,
    displayName: "Bruno Moreira e Silva",
    role: isSupabaseConfigured ? "reader" : "admin",
    isCloud: isSupabaseConfigured,
  });

  const [modalCharId, setModalCharId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<TrackItem[]>(OFFICIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);

  const showToast = useCallback((title: string, body: string) => {
    setToast({ title, body });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4600);
  }, []);

  const registerClue = useCallback((id: string) => {
    setClues((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const setEstellaPhase = useCallback(
    (idx: number) => {
      setEstellaPhaseState(idx);
      registerClue("estella_phase");
    },
    [registerClue]
  );

  const refreshWorkspace = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await fetchWorkspaceData();
      setCustomCharacters(data.customCharacters);
      setWritings(data.writings);
    } catch (err) {
      showToast(
        "Erro ao carregar dados",
        err instanceof Error ? err.message : "Falha na conexão."
      );
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  // Sync Supabase Auth session if configured
  const syncCloudProfile = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const authRes = await supabase.auth.getUser();
      const user = authRes?.data?.user ?? null;
      if (!user) {
        setProfile({
          id: null,
          email: null,
          displayName: "Visitante",
          role: "reader",
          isCloud: true,
        });
        return;
      }
      const { data: row } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile({
        id: user.id,
        email: user.email ?? null,
        displayName: row?.display_name || user.email?.split("@")[0] || "Redator",
        role: (row?.role as UserRole) || "writer",
        isCloud: true,
      });
    } catch {
      setProfile({
        id: null,
        email: null,
        displayName: "Visitante",
        role: "reader",
        isCloud: true,
      });
    }
  }, []);

  useEffect(() => {
    void refreshWorkspace();
    if (isSupabaseConfigured && supabase) {
      void syncCloudProfile();
      try {
        const subRes = supabase.auth.onAuthStateChange(() => {
          void syncCloudProfile();
          void refreshWorkspace();
        });
        const subscription = subRes?.data?.subscription;
        return () => {
          try {
            subscription?.unsubscribe();
          } catch {
            // ignore cleanup errors
          }
        };
      } catch {
        // ignore listener errors in restricted environments
      }
    }
  }, [refreshWorkspace, syncCloudProfile]);

  const signInCloud = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return "Supabase não configurado.";
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      await syncCloudProfile();
      await refreshWorkspace();
      return null;
    },
    [syncCloudProfile, refreshWorkspace]
  );

  const signUpCloud = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<string | null> => {
      if (!supabase) return "Supabase não configurado.";
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return error.message;
      await syncCloudProfile();
      await refreshWorkspace();
      return null;
    },
    [syncCloudProfile, refreshWorkspace]
  );

  const signOutCloud = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    await syncCloudProfile();
    await refreshWorkspace();
  }, [syncCloudProfile, refreshWorkspace]);

  const setLocalWriterName = useCallback((name: string) => {
    setProfile((p) => ({ ...p, displayName: name }));
  }, []);

  const setLocalWriterRole = useCallback((role: UserRole) => {
    setProfile((p) => ({ ...p, role }));
  }, []);

  const triggerReveal = useCallback(
    (rawCode: string) => {
      const clean = rawCode.trim().toLowerCase();
      if (!VALID_REVEAL_CODES.includes(clean)) return false;
      setRevealed(true);
      setClues(["anaira_dossier", "estella_phase", "archive_decoded"]);
      showToast(
        lang === "pt"
          ? `CÓDIGO ACEITO: ${clean.toUpperCase()}`
          : `KEY ACCEPTED: ${clean.toUpperCase()}`,
        lang === "pt"
          ? 'A grafia evoluiu para "Yep, A Lot". O Bilhete Rasgado, Pey Tola e Broken Teacher foram desbloqueados.'
          : 'The title shifted to "Yep, A Lot". The Torn Note, Pey Tola, and Broken Teacher are now unlocked.'
      );
      return true;
    },
    [lang, showToast]
  );

  const resetReveal = useCallback(() => {
    setRevealed(false);
    setClues([]);
    showToast(
      lang === "pt" ? "MODO SEM SPOILERS RESTAURADO" : "SPOILER-FREE MODE RESTORED",
      lang === "pt"
        ? 'O site voltou à forma inicial "yep a lot" (caixa baixa).'
        : 'The site returned to its initial "yep a lot" state (lowercase).'
    );
  }, [lang, showToast]);

  const openCharacterModal = useCallback(
    (id: string) => {
      if (id === "anaira") registerClue("anaira_dossier");
      if (id === "estella") registerClue("estella_phase");
      setModalCharId(id);
    },
    [registerClue]
  );

  const closeCharacterModal = useCallback(() => {
    setModalCharId(null);
  }, []);

  // Audio handlers
  const selectTrack = useCallback(
    (idx: number, autoPlay = true) => {
      const target = tracks[idx];
      if (!target || !audioRef.current) return;
      if (idx === currentTrackIndex && autoPlay && !audioRef.current.paused) {
        audioRef.current.pause();
        return;
      }
      setCurrentTrackIndex(idx);
      if (audioRef.current.getAttribute("data-src") !== target.src) {
        audioRef.current.src = target.src;
        audioRef.current.setAttribute("data-src", target.src);
      }
      if (autoPlay) {
        setHasStartedAudio(true);
        audioRef.current.play().catch(() => {});
      }
    },
    [tracks, currentTrackIndex]
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    const current = tracks[currentTrackIndex];
    if (!el || !current) return;
    if (!el.getAttribute("data-src")) {
      el.src = current.src;
      el.setAttribute("data-src", current.src);
    }
    if (el.paused) {
      setHasStartedAudio(true);
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [tracks, currentTrackIndex]);

  const prevTrack = useCallback(() => {
    const idx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    selectTrack(idx, true);
  }, [currentTrackIndex, tracks.length, selectTrack]);

  const nextTrack = useCallback(() => {
    const idx = (currentTrackIndex + 1) % tracks.length;
    selectTrack(idx, true);
  }, [currentTrackIndex, tracks.length, selectTrack]);

  const seekTo = useCallback((pct: number) => {
    const el = audioRef.current;
    if (el && el.duration) {
      el.currentTime = (pct / 100) * el.duration;
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
    setMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const addLocalTrack = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const newTrack: TrackItem = {
        id: `local_${Date.now()}`,
        code: String(tracks.length + 1).padStart(2, "0"),
        title: cleanName,
        src: url,
        cover: "/images/characters/capa_esboco_01a.jpg",
        eraTag: "LOCAL",
        sourceBadge: lang === "pt" ? "ARQUIVO LOCAL" : "LOCAL FILE",
        categories: ["theme"],
        duration: "--:--",
        linkedCharId: "anaira",
        linkedCharLabel: "Universo SBY",
        mood: { pt: "Faixa carregada localmente", en: "Locally loaded track" },
        storyNote: {
          pt: `Prévia carregada do seu dispositivo (${file.name}).`,
          en: `Preview loaded from your device (${file.name}).`,
        },
      };
      setTracks((prev) => [...prev, newTrack]);
      const nextIdx = tracks.length;
      setTimeout(() => {
        if (audioRef.current) {
          setCurrentTrackIndex(nextIdx);
          audioRef.current.src = url;
          audioRef.current.setAttribute("data-src", url);
          setHasStartedAudio(true);
          audioRef.current.play().catch(() => {});
        }
      }, 60);
      showToast(
        lang === "pt" ? "FAIXA ADICIONADA AO PLAYER" : "TRACK ADDED TO PLAYER",
        cleanName
      );
    },
    [tracks.length, lang, showToast]
  );

  const allPublishedCharacters = useMemo(
    () => [
      ...BASE_CHARACTERS,
      ...customCharacters.filter((c) => c.status === "published"),
    ],
    [customCharacters]
  );

  const allCharactersIncludingDrafts = useMemo(
    () => [...BASE_CHARACTERS, ...customCharacters],
    [customCharacters]
  );

  return (
    <UniverseContext.Provider
      value={{
        lang,
        setLang,
        era,
        setEra,
        revealed,
        triggerReveal,
        resetReveal,
        clues,
        registerClue,
        estellaPhase,
        setEstellaPhase,
        customCharacters,
        writings,
        allPublishedCharacters,
        allCharactersIncludingDrafts,
        loadingData,
        refreshWorkspace,
        profile,
        setLocalWriterName,
        setLocalWriterRole,
        signInCloud,
        signUpCloud,
        signOutCloud,
        modalCharId,
        openCharacterModal,
        closeCharacterModal,
        tracks,
        addLocalTrack,
        currentTrackIndex,
        isPlaying,
        hasStartedAudio,
        currentTime,
        duration,
        volume,
        muted,
        selectTrack,
        togglePlay,
        prevTrack,
        nextTrack,
        seekTo,
        setVolume,
        toggleMute,
        toast,
        showToast,
      }}
    >
      {/* Persistent Audio Element Across All Pages */}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => nextTrack()}
      />
      {children}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 max-w-sm bg-[#141922] border border-[#E2A93B]/50 px-5 py-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-[#E2A93B] shrink-0" />
            <div>
              <p className="font-mono-ed text-xs uppercase tracking-widest text-[#E2A93B]">
                {toast.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#D8D3C8]">{toast.body}</p>
            </div>
          </div>
        </div>
      )}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error("useUniverse must be used inside UniverseProvider");
  return ctx;
}
