import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { SEED_WRITING } from "@/data/universe";
import type {
  CharacterItem,
  EditorialStatus,
  SilhouetteType,
  WritingEntry,
  WritingType,
} from "@/lib/types";

const LOCAL_STORAGE_KEY = "sby_cloud_fallback_v1";

interface LocalBundle {
  customCharacters: CharacterItem[];
  writings: WritingEntry[];
}

function readLocal(): LocalBundle {
  if (typeof window === "undefined") {
    return { customCharacters: [], writings: [SEED_WRITING] };
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalBundle>;
      return {
        customCharacters: Array.isArray(parsed.customCharacters) ? parsed.customCharacters : [],
        writings: Array.isArray(parsed.writings) ? parsed.writings : [SEED_WRITING],
      };
    }
  } catch {
    // ignore corrupted local storage
  }
  const initial: LocalBundle = { customCharacters: [], writings: [SEED_WRITING] };
  writeLocal(initial);
  return initial;
}

function writeLocal(bundle: LocalBundle) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    // ignore quota errors
  }
}

interface DbCharacterRow {
  id: string;
  name: string;
  codename: string;
  role_pt: string;
  role_en: string;
  evidence_pt: string;
  evidence_en: string;
  summary_pt: string;
  summary_en: string;
  quote_pt: string;
  quote_en: string;
  connections: string[];
  categories: string[];
  accent: string;
  has_visual: boolean;
  image_url: string | null;
  silhouette: string;
  status: EditorialStatus;
  is_canon: boolean;
  author_id: string | null;
  author_name: string;
}

interface DbWritingRow {
  id: string;
  character_id: string;
  entry_type: WritingType;
  era: string;
  title: string;
  body: string;
  status: EditorialStatus;
  is_canon: boolean;
  author_id: string | null;
  author_name: string;
  updated_at: string;
}

function mapDbCharacter(row: DbCharacterRow): CharacterItem {
  return {
    id: row.id,
    name: row.name,
    codename: row.codename,
    hasVisual: row.has_visual,
    img: row.image_url ?? undefined,
    silhouette: (row.silhouette as SilhouetteType) || "mystery",
    categories: row.categories ?? ["community"],
    accent: row.accent || "#29B6D1",
    role: { pt: row.role_pt, en: row.role_en },
    evidence: { pt: row.evidence_pt, en: row.evidence_en },
    summary: { pt: row.summary_pt, en: row.summary_en },
    quote: { pt: row.quote_pt, en: row.quote_en },
    connections: row.connections ?? ["Universo SBY"],
    isCustom: true,
    status: row.status,
    isCanon: row.is_canon,
    authorId: row.author_id,
    authorName: row.author_name,
  };
}

function mapDbWriting(row: DbWritingRow): WritingEntry {
  return {
    id: row.id,
    characterId: row.character_id,
    entryType: row.entry_type,
    era: row.era,
    title: row.title,
    body: row.body,
    status: row.status,
    isCanon: row.is_canon,
    authorId: row.author_id,
    authorName: row.author_name,
    updatedAt: row.updated_at,
  };
}

export async function fetchWorkspaceData(): Promise<{
  customCharacters: CharacterItem[];
  writings: WritingEntry[];
}> {
  if (isSupabaseConfigured && supabase) {
    const [charRes, writRes] = await Promise.all([
      supabase.from("characters").select("*").order("created_at", { ascending: false }),
      supabase.from("character_writings").select("*").order("updated_at", { ascending: false }),
    ]);

    if (charRes.error) throw new Error(charRes.error.message);
    if (writRes.error) throw new Error(writRes.error.message);

    return {
      customCharacters: ((charRes.data ?? []) as DbCharacterRow[]).map(mapDbCharacter),
      writings: ((writRes.data ?? []) as DbWritingRow[]).map(mapDbWriting),
    };
  }

  return readLocal();
}

export async function uploadCharacterImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const safeExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `characters/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const { error } = await supabase.storage
      .from("sby-media")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("sby-media").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Fallback local: compress to data URL for localStorage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler imagem"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.onload = () => {
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = String(ev.target?.result || "");
    };
    reader.readAsDataURL(file);
  });
}

export interface CreateCharacterPayload {
  name: string;
  codename: string;
  role: string;
  faction: string;
  evidence: string;
  summary: string;
  quote: string;
  connections: string[];
  hasVisual: boolean;
  imageUrl?: string;
  silhouette: SilhouetteType;
  status: EditorialStatus;
  isCanon: boolean;
  authorId: string | null;
  authorName: string;
}

export async function createCustomCharacter(payload: CreateCharacterPayload): Promise<CharacterItem> {
  const categories = Array.from(
    new Set(["community", payload.faction, payload.hasVisual ? "visual" : "secret"])
  );
  const accent =
    payload.faction === "weights"
      ? "#29B6D1"
      : payload.faction === "dandelions"
        ? "#E2A93B"
        : "#9E2436";

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("characters")
      .insert({
        name: payload.name,
        codename: payload.codename,
        role_pt: payload.role,
        role_en: payload.role,
        evidence_pt: payload.evidence,
        evidence_en: payload.evidence,
        summary_pt: payload.summary,
        summary_en: payload.summary,
        quote_pt: payload.quote,
        quote_en: payload.quote,
        connections: payload.connections,
        categories,
        accent,
        has_visual: payload.hasVisual,
        image_url: payload.imageUrl ?? null,
        silhouette: payload.silhouette,
        status: payload.status,
        is_canon: payload.isCanon,
        author_id: payload.authorId,
        author_name: payload.authorName,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapDbCharacter(data as DbCharacterRow);
  }

  const created: CharacterItem = {
    id: `custom_${Date.now()}`,
    isCustom: true,
    name: payload.name,
    codename: payload.codename,
    hasVisual: payload.hasVisual,
    img: payload.imageUrl,
    silhouette: payload.silhouette,
    categories,
    accent,
    role: { pt: payload.role, en: payload.role },
    evidence: { pt: payload.evidence, en: payload.evidence },
    summary: { pt: payload.summary, en: payload.summary },
    quote: { pt: payload.quote, en: payload.quote },
    connections: payload.connections,
    status: payload.status,
    isCanon: payload.isCanon,
    authorId: payload.authorId,
    authorName: payload.authorName,
  };
  const bundle = readLocal();
  bundle.customCharacters.unshift(created);
  writeLocal(bundle);
  return created;
}

export async function updateCharacterStatus(
  id: string,
  status: EditorialStatus,
  isCanon: boolean
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("characters")
      .update({ status, is_canon: isCanon, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const bundle = readLocal();
  const item = bundle.customCharacters.find((c) => c.id === id);
  if (item) {
    item.status = status;
    item.isCanon = isCanon;
    writeLocal(bundle);
  }
}

export async function deleteCustomCharacter(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const bundle = readLocal();
  bundle.customCharacters = bundle.customCharacters.filter((c) => c.id !== id);
  writeLocal(bundle);
}

export interface UpsertWritingPayload {
  id?: string;
  characterId: string;
  entryType: WritingType;
  era: string;
  title: string;
  body: string;
  status: EditorialStatus;
  isCanon: boolean;
  authorId: string | null;
  authorName: string;
}

export async function saveWritingEntry(payload: UpsertWritingPayload): Promise<WritingEntry> {
  if (isSupabaseConfigured && supabase) {
    if (payload.id) {
      const { data, error } = await supabase
        .from("character_writings")
        .update({
          character_id: payload.characterId,
          entry_type: payload.entryType,
          era: payload.era,
          title: payload.title,
          body: payload.body,
          status: payload.status,
          is_canon: payload.isCanon,
        })
        .eq("id", payload.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapDbWriting(data as DbWritingRow);
    }

    const { data, error } = await supabase
      .from("character_writings")
      .insert({
        character_id: payload.characterId,
        entry_type: payload.entryType,
        era: payload.era,
        title: payload.title,
        body: payload.body,
        status: payload.status,
        is_canon: payload.isCanon,
        author_id: payload.authorId,
        author_name: payload.authorName,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapDbWriting(data as DbWritingRow);
  }

  const bundle = readLocal();
  const now = new Date().toISOString();
  if (payload.id) {
    const idx = bundle.writings.findIndex((w) => w.id === payload.id);
    if (idx !== -1) {
      bundle.writings[idx] = {
        ...bundle.writings[idx],
        characterId: payload.characterId,
        entryType: payload.entryType,
        era: payload.era,
        title: payload.title,
        body: payload.body,
        status: payload.status,
        isCanon: payload.isCanon,
        updatedAt: now,
      };
      writeLocal(bundle);
      return bundle.writings[idx];
    }
  }
  const created: WritingEntry = {
    id: `w_${Date.now()}`,
    characterId: payload.characterId,
    entryType: payload.entryType,
    era: payload.era,
    title: payload.title,
    body: payload.body,
    status: payload.status,
    isCanon: payload.isCanon,
    authorId: payload.authorId,
    authorName: payload.authorName,
    updatedAt: now,
  };
  bundle.writings.unshift(created);
  writeLocal(bundle);
  return created;
}

export async function approveWritingEntry(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("character_writings")
      .update({ status: "published", is_canon: true })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const bundle = readLocal();
  const item = bundle.writings.find((w) => w.id === id);
  if (item) {
    item.status = "published";
    item.isCanon = true;
    item.updatedAt = new Date().toISOString();
    writeLocal(bundle);
  }
}

export async function deleteWritingEntry(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("character_writings").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const bundle = readLocal();
  bundle.writings = bundle.writings.filter((w) => w.id !== id);
  writeLocal(bundle);
}
