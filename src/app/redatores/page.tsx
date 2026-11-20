"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUniverse } from "@/components/UniverseContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  approveWritingEntry,
  createCustomCharacter,
  deleteCustomCharacter,
  deleteWritingEntry,
  saveWritingEntry,
  updateCharacterStatus,
  uploadCharacterImage,
} from "@/lib/repository";
import type { EditorialStatus, SilhouetteType, WritingType } from "@/lib/types";

function WritersRoomInner() {
  const searchParams = useSearchParams();
  const {
    lang,
    profile,
    setLocalWriterName,
    setLocalWriterRole,
    signInCloud,
    signUpCloud,
    signOutCloud,
    allCharactersIncludingDrafts,
    customCharacters,
    writings,
    refreshWorkspace,
    openCharacterModal,
    showToast,
  } = useUniverse();

  const isPt = lang === "pt";
  const isAdmin = profile.role === "admin";
  const canWrite = !isSupabaseConfigured || Boolean(profile.id);

  // Auth form state (when Supabase is configured)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  // Workspace tabs
  const [tab, setTab] = useState<"write" | "create">("write");

  // Writing editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryCharId, setEntryCharId] = useState("anaira");
  const [entryType, setEntryType] = useState<WritingType>("scene");
  const [entryEra, setEntryEra] = useState("Yep, A Lot");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryBody, setEntryBody] = useState("");
  const [entryStatus, setEntryStatus] = useState<EditorialStatus>("review");
  const [savingEntry, setSavingEntry] = useState(false);

  // Feed filters
  const [filterChar, setFilterChar] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // New Character form state
  const [cName, setCName] = useState("");
  const [cCode, setCCode] = useState("");
  const [cRole, setCRole] = useState("");
  const [cFaction, setCFaction] = useState("dandelions");
  const [cEvidence, setCEvidence] = useState("");
  const [cSummary, setCSummary] = useState("");
  const [cQuote, setCQuote] = useState("");
  const [cConnections, setCConnections] = useState("");
  const [cVisualMode, setCVisualMode] = useState<"secret" | "upload">("secret");
  const [cSilhouette, setCSilhouette] = useState<SilhouetteType>("prophet");
  const [cImageFile, setCImageFile] = useState<File | null>(null);
  const [cImagePreview, setCImagePreview] = useState<string | null>(null);
  const [savingChar, setSavingChar] = useState(false);

  useEffect(() => {
    const preChar = searchParams.get("char");
    if (preChar) {
      setEntryCharId(preChar);
      setTab("write");
    }
  }, [searchParams]);

  useEffect(() => {
    setEntryStatus(isAdmin ? "published" : "review");
  }, [isAdmin]);

  const wordCount = entryBody.trim() ? entryBody.trim().split(/\s+/).length : 0;

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      const err =
        authMode === "signin"
          ? await signInCloud(authEmail, authPass)
          : await signUpCloud(authEmail, authPass, authName || authEmail.split("@")[0]);
      if (err) {
        setAuthError(err);
      } else {
        setAuthEmail("");
        setAuthPass("");
        setAuthName("");
        showToast(
          isPt ? "CONECTADO AO SUPABASE" : "CONNECTED TO SUPABASE",
          isPt ? "Sessão de redator ativa na nuvem." : "Cloud writer session active."
        );
      }
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSaveWriting(e: React.FormEvent) {
    e.preventDefault();
    if (!entryTitle.trim() || !entryBody.trim()) return;
    setSavingEntry(true);
    try {
      const finalStatus: EditorialStatus =
        !isAdmin && entryStatus === "published" ? "review" : entryStatus;
      await saveWritingEntry({
        id: editingId ?? undefined,
        characterId: entryCharId,
        entryType,
        era: entryEra,
        title: entryTitle.trim(),
        body: entryBody.trim(),
        status: finalStatus,
        isCanon: isAdmin && finalStatus === "published",
        authorId: profile.id,
        authorName: profile.displayName || "Redator",
      });
      await refreshWorkspace();
      showToast(
        editingId
          ? isPt
            ? "TEXTO ATUALIZADO"
            : "ENTRY UPDATED"
          : isPt
            ? "TEXTO SALVO"
            : "ENTRY SAVED",
        entryTitle.trim()
      );
      setEditingId(null);
      setEntryTitle("");
      setEntryBody("");
    } catch (err) {
      showToast("ERRO", err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSavingEntry(false);
    }
  }

  async function handleCreateCharacter(e: React.FormEvent) {
    e.preventDefault();
    if (!cName.trim() || !cCode.trim()) return;
    setSavingChar(true);
    try {
      let uploadedUrl: string | undefined;
      if (cVisualMode === "upload" && cImageFile) {
        uploadedUrl = await uploadCharacterImage(cImageFile);
      }
      const status: EditorialStatus = isAdmin ? "published" : "review";
      await createCustomCharacter({
        name: cName.trim(),
        codename: cCode.trim(),
        role: cRole.trim(),
        faction: cFaction,
        evidence: cEvidence.trim(),
        summary: cSummary.trim(),
        quote: cQuote.trim() || '"..."',
        connections: cConnections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hasVisual: Boolean(uploadedUrl),
        imageUrl: uploadedUrl,
        silhouette: cSilhouette,
        status,
        isCanon: isAdmin,
        authorId: profile.id,
        authorName: profile.displayName || "Redator",
      });
      await refreshWorkspace();
      showToast(
        status === "published"
          ? isPt
            ? "PERSONAGEM PUBLICADO NA GALERIA"
            : "CHARACTER PUBLISHED"
          : isPt
            ? "PERSONAGEM ENVIADO PARA REVISÃO"
            : "SUBMITTED FOR REVIEW",
        cName.trim()
      );
      setCName("");
      setCCode("");
      setCRole("");
      setCEvidence("");
      setCSummary("");
      setCQuote("");
      setCConnections("");
      setCImageFile(null);
      setCImagePreview(null);
      setCVisualMode("secret");
    } catch (err) {
      showToast("ERRO", err instanceof Error ? err.message : "Falha ao criar personagem");
    } finally {
      setSavingChar(false);
    }
  }

  function handleExportBackup() {
    const payload = {
      project: "yep a lot / SBY Universe",
      exportedAt: new Date().toISOString(),
      source: isSupabaseConfigured ? "supabase" : "local",
      customCharacters,
      writings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yep_a_lot_backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast(isPt ? "BACKUP EXPORTADO" : "BACKUP EXPORTED", "yep_a_lot_backup.json");
  }

  const filteredWritings = writings.filter((w) => {
    if (filterChar !== "all" && w.characterId !== filterChar) return false;
    if (filterStatus !== "all" && w.status !== filterStatus) return false;
    return true;
  });

  const statusBadge = (status?: EditorialStatus) => {
    if (status === "published") {
      return (
        <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] font-mono-ed text-[10px] uppercase">
          {isPt ? "Publicado · Cânone" : "Published · Canon"}
        </span>
      );
    }
    if (status === "review") {
      return (
        <span className="px-2 py-0.5 bg-[#E2A93B]/15 border border-[#E2A93B]/40 text-[#E2A93B] font-mono-ed text-[10px] uppercase">
          {isPt ? "Em Revisão" : "In Review"}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-[#64748B]/20 border border-[#64748B]/40 text-[#CBD5E1] font-mono-ed text-[10px] uppercase">
        {isPt ? "Rascunho" : "Draft"}
      </span>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 hairline-b">
        <div>
          <p className="font-mono-ed text-xs uppercase tracking-[0.2em] text-[#29B6D1]">
            {isPt
              ? "SALA DE REDATORES · NUVEM SUPABASE"
              : "WRITERS' ROOM · SUPABASE CLOUD"}
          </p>
          <h1 className="mt-2 font-serif-ed text-4xl sm:text-5xl text-[#F4F1EA] tracking-tight">
            {isPt ? "Oficina de Personagens & Escrita" : "Character Studio & Writing"}
          </h1>
          <p className="mt-3 text-sm text-[#B8B4AA] max-w-2xl leading-relaxed">
            {isPt
              ? "Escreva cenas e crônicas sobre qualquer personagem do universo SBY ou cadastre novos personagens. Todo o conteúdo salvo fica desacoplado do layout visual — pronto para reorganizar o site sem perder nada."
              : "Write scenes and chronicles for any SBY character or create new ones. All saved content stays cleanly decoupled from the site layout."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportBackup}
          className="px-4 py-2.5 hairline-all font-mono-ed text-xs text-[#C9C4B8] hover:border-[#29B6D1] hover:text-[#29B6D1] transition-colors self-start"
        >
          {isPt ? "↓ Exportar Backup (.json)" : "↓ Export Backup (.json)"}
        </button>
      </div>

      {/* Connection & Auth Bar */}
      {isSupabaseConfigured ? (
        <div className="bg-[#12161D] hairline-all p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono-ed text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <span className="text-[#34D399] uppercase tracking-wider">
                {isPt ? "CONECTADO AO SUPABASE (NUVEM ATIVA)" : "SUPABASE CLOUD CONNECTED"}
              </span>
            </div>
            {profile.id && (
              <div className="flex items-center gap-3 font-mono-ed text-xs">
                <span className="text-[#F4F1EA]">
                  {profile.displayName}{" "}
                  <span className="text-[#E2A93B]">[{profile.role.toUpperCase()}]</span>
                </span>
                <button
                  type="button"
                  onClick={() => signOutCloud()}
                  className="px-3 py-1 hairline-all text-[#E56B7A] hover:border-[#E56B7A]"
                >
                  {isPt ? "Sair" : "Sign out"}
                </button>
              </div>
            )}
          </div>

          {!profile.id && (
            <form
              onSubmit={handleAuthSubmit}
              className="pt-4 hairline-t grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
            >
              {authMode === "signup" && (
                <div className="md:col-span-3 space-y-1">
                  <label className="block font-mono-ed text-[10px] uppercase text-[#8B95A5]">
                    {isPt ? "Nome de Redator" : "Writer Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="studio-input w-full px-3 py-2 text-xs"
                    placeholder="Seu nome"
                  />
                </div>
              )}
              <div className={authMode === "signup" ? "md:col-span-3 space-y-1" : "md:col-span-4 space-y-1"}>
                <label className="block font-mono-ed text-[10px] uppercase text-[#8B95A5]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="redator@exemplo.com"
                />
              </div>
              <div className={authMode === "signup" ? "md:col-span-3 space-y-1" : "md:col-span-4 space-y-1"}>
                <label className="block font-mono-ed text-[10px] uppercase text-[#8B95A5]">
                  {isPt ? "Senha" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="••••••"
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="submit"
                  disabled={authBusy}
                  className="flex-1 py-2 bg-[#E2A93B] text-[#0B0E12] font-mono-ed text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {authMode === "signin"
                    ? isPt
                      ? "Entrar"
                      : "Sign In"
                    : isPt
                      ? "Criar Conta"
                      : "Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                  className="px-3 py-2 hairline-all font-mono-ed text-[10px] text-[#C9C4B8]"
                >
                  {authMode === "signin"
                    ? isPt
                      ? "Cadastrar"
                      : "Register"
                    : isPt
                      ? "Login"
                      : "Login"}
                </button>
              </div>
              {authError && (
                <p className="md:col-span-12 text-xs font-mono-ed text-[#E56B7A]">
                  {authError}
                </p>
              )}
            </form>
          )}
        </div>
      ) : (
        <div className="bg-[#12161D] hairline-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-ed text-[11px] uppercase tracking-widest text-[#8B95A5]">
              {isPt ? "REDATOR (MODO LOCAL):" : "WRITER (LOCAL MODE):"}
            </span>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setLocalWriterName(e.target.value)}
              className="studio-input px-3 py-1.5 text-xs font-mono-ed w-52"
            />
            <div className="flex items-center hairline-all p-0.5 text-[11px] font-mono-ed">
              <button
                type="button"
                onClick={() => setLocalWriterRole("admin")}
                className={`px-2.5 py-1 transition-colors ${
                  isAdmin ? "bg-[#E2A93B] text-[#0B0E12] font-bold" : "text-[#8B95A5]"
                }`}
              >
                {isPt ? "Admin (Cânone)" : "Admin (Canon)"}
              </button>
              <button
                type="button"
                onClick={() => setLocalWriterRole("writer")}
                className={`px-2.5 py-1 transition-colors ${
                  !isAdmin ? "bg-[#29B6D1] text-[#0B0E12] font-bold" : "text-[#8B95A5]"
                }`}
              >
                {isPt ? "Redator Convidado" : "Guest Writer"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono-ed text-[#E2A93B]">
            <span className="h-2 w-2 rounded-full bg-[#E2A93B]" />
            <span>
              {isPt
                ? "Configure .env.local para ativar Supabase em nuvem"
                : "Add .env.local keys to enable Supabase Cloud"}
            </span>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#F4F1EA]/10 pb-4 text-xs font-mono-ed">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-2.5 uppercase tracking-wider transition-colors ${
            tab === "write"
              ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
              : "hairline-all text-[#B8B4AA] hover:text-[#F4F1EA]"
          }`}
        >
          {isPt ? "✎ Escrever sobre Personagens" : "✎ Write About Characters"}
        </button>
        <button
          type="button"
          onClick={() => setTab("create")}
          className={`px-4 py-2.5 uppercase tracking-wider transition-colors ${
            tab === "create"
              ? "bg-[#F4F1EA] text-[#0B0E12] font-semibold"
              : "hairline-all text-[#B8B4AA] hover:text-[#F4F1EA]"
          }`}
        >
          {isPt ? "+ Criar Novo Personagem" : "+ Create New Character"}
        </button>
      </div>

      {/* TAB 1: WRITE */}
      {tab === "write" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSaveWriting}
            className="lg:col-span-5 bg-[#12161D] hairline-all p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif-ed text-xl text-[#F4F1EA]">
                {editingId
                  ? isPt
                    ? "Editando Texto"
                    : "Editing Entry"
                  : isPt
                    ? "Novo Texto / Crônica"
                    : "New Chronicle / Entry"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEntryTitle("");
                    setEntryBody("");
                  }}
                  className="font-mono-ed text-[11px] text-[#E56B7A] hover:underline"
                >
                  {isPt ? "Cancelar" : "Cancel"}
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                {isPt ? "Personagem vinculado" : "Linked character"}
              </label>
              <select
                value={entryCharId}
                onChange={(e) => setEntryCharId(e.target.value)}
                className="studio-input w-full px-3 py-2.5 text-xs"
              >
                {allCharactersIncludingDrafts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isCustom ? (isPt ? "[Redator]" : "[Writer]") : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Formato" : "Format"}
                </label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as WritingType)}
                  className="studio-input w-full px-3 py-2.5 text-xs"
                >
                  <option value="scene">{isPt ? "Cena / Capítulo" : "Scene / Chapter"}</option>
                  <option value="dossier">{isPt ? "Dossiê / Biografia" : "Dossier"}</option>
                  <option value="dialogue">{isPt ? "Diálogo" : "Dialogue"}</option>
                  <option value="lore">{isPt ? "Nota de Enredo" : "Lore Note"}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Era SBY" : "SBY Era"}
                </label>
                <select
                  value={entryEra}
                  onChange={(e) => setEntryEra(e.target.value)}
                  className="studio-input w-full px-3 py-2.5 text-xs"
                >
                  <option value="Sound Name">Sound Name</option>
                  <option value="Broken Net">Broken Net</option>
                  <option value="Yep, A Lot">yep a lot / Yep, A Lot</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                {isPt ? "Título do texto" : "Title"}
              </label>
              <input
                type="text"
                required
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                placeholder={isPt ? "Ex: A conversa na Casa 53" : "Ex: Conversation at House 53"}
                className="studio-input w-full px-3 py-2.5 text-xs placeholder-[#64748B]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Conteúdo escrito" : "Written content"}
                </label>
                <span className="font-mono-ed text-[10px] text-[#8B95A5]">
                  {wordCount} {isPt ? "palavras" : "words"}
                </span>
              </div>
              <textarea
                rows={7}
                required
                value={entryBody}
                onChange={(e) => setEntryBody(e.target.value)}
                placeholder={
                  isPt
                    ? "Escreva cenas, reflexões psicológicas ou diálogos..."
                    : "Write scenes, psychological notes, or dialogues..."
                }
                className="studio-input w-full px-3 py-2.5 text-xs leading-relaxed placeholder-[#64748B] resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                {isPt ? "Status editorial" : "Editorial status"}
              </label>
              <select
                value={entryStatus}
                onChange={(e) => setEntryStatus(e.target.value as EditorialStatus)}
                className="studio-input w-full px-3 py-2.5 text-xs"
              >
                <option value="draft">{isPt ? "Rascunho privado" : "Private draft"}</option>
                <option value="review">
                  {isPt ? "Enviar para revisão do cânone" : "Submit for canon review"}
                </option>
                {isAdmin && (
                  <option value="published">
                    {isPt ? "Publicado · Cânone Oficial" : "Published · Official Canon"}
                  </option>
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={savingEntry || !canWrite}
              className="w-full py-3 bg-[#29B6D1] text-[#0B0E12] text-xs font-mono-ed font-bold uppercase tracking-widest hover:bg-[#49C8E0] transition-colors disabled:opacity-50"
            >
              {!canWrite
                ? isPt
                  ? "Faça login acima para salvar na nuvem"
                  : "Sign in above to save to cloud"
                : savingEntry
                  ? isPt
                    ? "Salvando..."
                    : "Saving..."
                  : editingId
                    ? isPt
                      ? "Atualizar Texto"
                      : "Update Entry"
                    : isPt
                      ? "Salvar Texto"
                      : "Save Entry"}
            </button>
          </form>

          {/* Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-mono-ed text-xs uppercase tracking-widest text-[#8B95A5]">
                {filteredWritings.length} {isPt ? "TEXTOS SALVOS" : "SAVED ENTRIES"}
              </p>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterChar}
                  onChange={(e) => setFilterChar(e.target.value)}
                  className="studio-input px-3 py-1.5 text-xs font-mono-ed"
                >
                  <option value="all">
                    {isPt ? "Todos os personagens" : "All characters"}
                  </option>
                  {allCharactersIncludingDrafts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="studio-input px-3 py-1.5 text-xs font-mono-ed"
                >
                  <option value="all">{isPt ? "Todos os status" : "All statuses"}</option>
                  <option value="published">{isPt ? "Publicado" : "Published"}</option>
                  <option value="review">{isPt ? "Em Revisão" : "In Review"}</option>
                  <option value="draft">{isPt ? "Rascunho" : "Draft"}</option>
                </select>
              </div>
            </div>

            {filteredWritings.length === 0 ? (
              <div className="bg-[#12161D] hairline-all p-8 text-center text-xs text-[#8B95A5]">
                {isPt
                  ? "Nenhum texto encontrado para este filtro."
                  : "No entries match this filter."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWritings.map((w) => {
                  const ch = allCharactersIncludingDrafts.find(
                    (c) => c.id === w.characterId
                  );
                  return (
                    <article
                      key={w.id}
                      className="bg-[#12161D] hairline-all p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openCharacterModal(w.characterId)}
                            className="px-2.5 py-0.5 bg-[#0B0E12] hairline-all font-mono-ed text-[10px] uppercase tracking-wider text-[#29B6D1] hover:border-[#29B6D1]"
                          >
                            {ch ? ch.name : w.characterId}
                          </button>
                          <span className="font-mono-ed text-[10px] text-[#8B95A5] uppercase">
                            {w.entryType} · {w.era}
                          </span>
                        </div>
                        {statusBadge(w.status)}
                      </div>

                      <h3 className="font-serif-ed text-xl text-[#F4F1EA]">{w.title}</h3>
                      <p className="text-xs leading-relaxed text-[#C9C4B8] whitespace-pre-line">
                        {w.body}
                      </p>

                      <div className="pt-3 hairline-t flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-ed text-[#8B95A5]">
                        <span>{w.authorName}</span>
                        <div className="flex items-center gap-3">
                          {isAdmin && w.status !== "published" && (
                            <button
                              type="button"
                              onClick={async () => {
                                await approveWritingEntry(w.id);
                                await refreshWorkspace();
                                showToast(
                                  isPt ? "APROVADO PARA O CÂNONE" : "APPROVED",
                                  w.title
                                );
                              }}
                              className="text-[#34D399] hover:underline"
                            >
                              {isPt ? "✓ Aprovar Cânone" : "✓ Approve"}
                            </button>
                          )}
                          {canWrite && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(w.id);
                                setEntryCharId(w.characterId);
                                setEntryType(w.entryType);
                                setEntryEra(w.era);
                                setEntryTitle(w.title);
                                setEntryBody(w.body);
                                setEntryStatus(w.status);
                              }}
                              className="text-[#E2A93B] hover:underline"
                            >
                              {isPt ? "Editar" : "Edit"}
                            </button>
                          )}
                          {canWrite && (
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteWritingEntry(w.id);
                                await refreshWorkspace();
                              }}
                              className="text-[#E56B7A] hover:underline"
                            >
                              {isPt ? "Excluir" : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: CREATE CHARACTER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleCreateCharacter}
            className="lg:col-span-6 bg-[#12161D] hairline-all p-6 space-y-4"
          >
            <h2 className="font-serif-ed text-xl text-[#F4F1EA]">
              {isPt ? "Ficha de Novo Personagem SBY" : "New SBY Character Sheet"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Nome" : "Name"}
                </label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="Ex: Kaelen Vance"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Codinome / Casa" : "Codename / House"}
                </label>
                <input
                  type="text"
                  required
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="Ex: IS 41 10 · Casa 41"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Papel na História" : "Story Role"}
                </label>
                <input
                  type="text"
                  required
                  value={cRole}
                  onChange={(e) => setCRole(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="Ex: Arquivista das 66 Casas"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Núcleo" : "Faction"}
                </label>
                <select
                  value={cFaction}
                  onChange={(e) => setCFaction(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                >
                  <option value="dandelions">66 Casas / IS&apos; (Dandelions)</option>
                  <option value="weights">Weights & Enigmas</option>
                  <option value="community">Equipe PEARL / Expandido</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                {isPt ? "Evidência Narrativa" : "Narrative Evidence"}
              </label>
              <input
                type="text"
                required
                value={cEvidence}
                onChange={(e) => setCEvidence(e.target.value)}
                className="studio-input w-full px-3 py-2 text-xs"
                placeholder="Ex: Coragem silenciosa diante do desconhecido"
              />
            </div>

            <div className="p-4 bg-[#0B0E12] hairline-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono-ed text-[11px] uppercase tracking-wider text-[#E2A93B]">
                  {isPt ? "IDENTIDADE VISUAL" : "VISUAL IDENTITY"}
                </span>
                <div className="flex items-center hairline-all p-0.5 text-[11px] font-mono-ed">
                  <button
                    type="button"
                    onClick={() => setCVisualMode("secret")}
                    className={`px-2.5 py-1 ${
                      cVisualMode === "secret"
                        ? "bg-[#E2A93B] text-[#0B0E12] font-bold"
                        : "text-[#8B95A5]"
                    }`}
                  >
                    {isPt ? "Arquivo Secreto" : "Classified File"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCVisualMode("upload")}
                    className={`px-2.5 py-1 ${
                      cVisualMode === "upload"
                        ? "bg-[#29B6D1] text-[#0B0E12] font-bold"
                        : "text-[#8B95A5]"
                    }`}
                  >
                    {isPt ? "Enviar Imagem" : "Upload Image"}
                  </button>
                </div>
              </div>

              {cVisualMode === "secret" ? (
                <select
                  value={cSilhouette}
                  onChange={(e) => setCSilhouette(e.target.value as SilhouetteType)}
                  className="studio-input w-full px-3 py-1.5 text-xs"
                >
                  <option value="prophet">Profeta / Protagonista</option>
                  <option value="runner">Weight / Movimento</option>
                  <option value="mentor">Mentor / Estrategista</option>
                  <option value="luck">Sorte / Anomalia</option>
                  <option value="mystery">Mistério / Oculto</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setCImageFile(f);
                      setCImagePreview(f ? URL.createObjectURL(f) : null);
                    }}
                    className="text-xs text-[#C9C4B8] w-full"
                  />
                  {cImagePreview && (
                    <img
                      src={cImagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover hairline-all"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                {isPt ? "Resumo / Biografia" : "Summary / Biography"}
              </label>
              <textarea
                rows={4}
                required
                value={cSummary}
                onChange={(e) => setCSummary(e.target.value)}
                className="studio-input w-full px-3 py-2 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Citação-Chave" : "Signature Quote"}
                </label>
                <input
                  type="text"
                  value={cQuote}
                  onChange={(e) => setCQuote(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono-ed text-[11px] uppercase tracking-wider text-[#8B95A5]">
                  {isPt ? "Conexões (vírgula)" : "Connections (comma)"}
                </label>
                <input
                  type="text"
                  value={cConnections}
                  onChange={(e) => setCConnections(e.target.value)}
                  className="studio-input w-full px-3 py-2 text-xs"
                  placeholder="Anaira, Estella"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingChar || !canWrite}
              className="w-full py-3 bg-[#E2A93B] text-[#0B0E12] text-xs font-mono-ed font-bold uppercase tracking-widest hover:bg-[#F2C363] transition-colors disabled:opacity-50"
            >
              {!canWrite
                ? isPt
                  ? "Faça login acima para criar na nuvem"
                  : "Sign in above to create in cloud"
                : savingChar
                  ? isPt
                    ? "Salvando..."
                    : "Saving..."
                  : isPt
                    ? "Criar Personagem"
                    : "Create Character"}
            </button>
          </form>

          <div className="lg:col-span-6 space-y-4">
            <p className="font-mono-ed text-xs uppercase tracking-widest text-[#8B95A5]">
              {customCharacters.length}{" "}
              {isPt ? "PERSONAGENS CRIADOS POR REDATORES" : "WRITER-CREATED CHARACTERS"}
            </p>
            {customCharacters.length === 0 ? (
              <div className="bg-[#12161D] hairline-all p-8 text-center text-xs text-[#8B95A5]">
                {isPt
                  ? "Nenhum personagem novo criado ainda. Use a ficha ao lado para criar o primeiro!"
                  : "No custom characters yet. Use the form on the left to create one!"}
              </div>
            ) : (
              <div className="space-y-4">
                {customCharacters.map((c) => (
                  <div key={c.id} className="bg-[#12161D] hairline-all p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {c.hasVisual && c.img ? (
                          <img
                            src={c.img}
                            alt={c.name}
                            className="h-12 w-12 object-cover hairline-all shrink-0"
                          />
                        ) : (
                          <div className="h-12 w-12 classified-bg hairline-all flex items-center justify-center font-mono-ed text-[10px] text-[#E2A93B] shrink-0">
                            SEC
                          </div>
                        )}
                        <div className="min-w-0">
                          <p
                            className="font-mono-ed text-[10px] uppercase tracking-wider"
                            style={{ color: c.accent }}
                          >
                            {c.codename}
                          </p>
                          <h3 className="font-serif-ed text-xl text-[#F4F1EA] truncate">
                            {c.name}
                          </h3>
                        </div>
                      </div>
                      {statusBadge(c.status)}
                    </div>
                    <p className="text-xs text-[#C9C4B8] leading-relaxed">
                      {c.summary[lang]}
                    </p>
                    <div className="pt-3 hairline-t flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-ed text-[#8B95A5]">
                      <span>{c.authorName || "Redator"}</span>
                      <div className="flex items-center gap-3">
                        {isAdmin && c.status !== "published" && (
                          <button
                            type="button"
                            onClick={async () => {
                              await updateCharacterStatus(c.id, "published", true);
                              await refreshWorkspace();
                              showToast(
                                isPt ? "PUBLICADO NA GALERIA" : "PUBLISHED",
                                c.name
                              );
                            }}
                            className="text-[#34D399] hover:underline"
                          >
                            {isPt ? "✓ Publicar na Galeria" : "✓ Publish"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEntryCharId(c.id);
                            setTab("write");
                          }}
                          className="text-[#29B6D1] hover:underline"
                        >
                          {isPt ? "✎ Escrever" : "✎ Write"}
                        </button>
                        {canWrite && (
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteCustomCharacter(c.id);
                              await refreshWorkspace();
                            }}
                            className="text-[#E56B7A] hover:underline"
                          >
                            {isPt ? "Excluir" : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function RedatoresPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-5 py-20 font-mono-ed text-xs text-[#8B95A5]">
          Carregando Sala de Redatores...
        </div>
      }
    >
      <WritersRoomInner />
    </Suspense>
  );
}
