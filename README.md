# yep a lot / Yep, A Lot — Site Oficial (Universo SBY)

Aplicação web de produção em **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase** para o universo **SBY** (*Sound Name* → *Broken Net* → *Yep, A Lot*), criado por **Bruno Moreira e Silva**.

## O que já está pronto

- **Arquitetura multipágina modular (fácil de reorganizar sem perder dados na nuvem):**
  - `/` — Home com abertura sem spoilers (`yep a lot`), alternância de era (`Broken Net` / `yep a lot`), ecossistema *My Drive in Your Heart* / *Yep, A University* e **Arquivo Secreto** (`IS 53 2`, `PEARL`, `Pey Tola`) que revela **`Yep, A Lot`**, o Bilhete Rasgado e Broken Teacher.
  - `/personagens` — Galeria oficial com as **15 artes do acervo**, alternância de fases de Estella (`9`, `16` e `30 anos`), dualidade de Anaira (*Influencer* / *IS 53 2*), **Arquivos Secretos** para personagens sem base visual (*Lumem Adulto/Novo*, *Lumer*, *Racso*, *O Professor*) e exibição automática de personagens aprovados pela Sala de Redatores.
  - `/trilha` — **Sound Name — Trilha Sonora Oficial** com as **5 músicas reais em MP3 (`public/audio/`)** e **mini-player global persistente** que continua tocando ao navegar entre páginas.
  - `/redatores` — **Sala de Redatores** com login real via Supabase Auth, criação de novos personagens (com upload de imagem no Supabase Storage ou modo Secreto), escrita de crônicas vinculadas a qualquer personagem, aprovação de cânone por **Admin**, histórico automático de revisões no banco e exportação de backup `.json`.
- **Bilíngue completo (`PT | EN`)** com troca instantânea no topo.

---

## Como ativar o banco na nuvem (Supabase) em 5 minutos

### 1. Crie seu projeto gratuito no Supabase
Acesse [supabase.com](https://supabase.com), crie um novo projeto e aguarde o provisionamento.

### 2. Crie as tabelas, segurança (RLS) e Storage
1. No painel do Supabase, vá em **SQL Editor → New Query**.
2. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   - Isso cria automaticamente `profiles`, `characters`, `character_writings`, `writing_revisions` (histórico de edições), regras de segurança **Row Level Security** e o bucket público `sby-media`.

### 3. Configure as variáveis de ambiente
Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha com a **Project URL** e a **anon public key** (em *Supabase → Project Settings → API*):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

> Sem `.env.local`, o site roda normalmente em **Modo Local (`localStorage`)** para prévia rápida.

### 4. Torne sua conta Admin (para aprovar o Cânone)
1. Cadastre-se pela página `/redatores` com seu e-mail.
2. No **SQL Editor** do Supabase, rode:

```sql
update public.profiles
set role = 'admin', display_name = 'Bruno Moreira e Silva'
where id = (select id from auth.users where email = 'SEU_EMAIL_AQUI');
```

---

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy gratuito na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Importe o repositório em [vercel.com](https://vercel.com).
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Clique em **Deploy**. Sempre que quiser reorganizar páginas ou mudar o visual no futuro, basta atualizar o código e fazer novo deploy — **todos os personagens e textos no Supabase permanecem 100% preservados**.
