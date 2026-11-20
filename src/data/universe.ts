import type { CharacterItem, TrackItem, WritingEntry } from "@/lib/types";

export const BASE_CHARACTERS: CharacterItem[] = [
  {
    id: "anaira",
    name: "Anaira",
    codename: "anairA · IS 53 2 · Dandelion",
    hasVisual: true,
    categories: ["visual", "dandelions"],
    accent: "#9E2436",
    img: "/images/characters/anaira_batalha.jpg",
    gallery: [
      {
        src: "/images/characters/anaira_batalha.jpg",
        pt: "Campo de batalha (Estilo Anime)",
        en: "Battlefield (Anime Key Art)",
      },
      {
        src: "/images/characters/anaira_hoshiko_treinamento.jpg",
        pt: "Com Hoshiko na Creche das IS'",
        en: "With Hoshiko at the IS' Nursery",
      },
      {
        src: "/images/characters/anaira_hoshiko_heranca.jpg",
        pt: "Herança em um Mundo Hostil",
        en: "Inheritance in a Hostile World",
      },
    ],
    specialType: "anaira",
    role: {
      pt: "Influenciadora Pública / Agente IS 53 2",
      en: "Public Influencer / IS 53 2 Operative",
    },
    evidence: {
      pt: "Pertencimento quebrado, têmpera e amor que aprende a confiar",
      en: "Broken belonging, steel tempering & love learning to trust",
    },
    summary: {
      pt: "Treinada desde a infância pela Supervisora nas 66 Casas das Dandelions. Carrega nas mãos marcas das lágrimas de sua mãe biológica — um poder silencioso que um dia salvará um Weight.",
      en: "Trained from childhood by the Supervisor across the 66 Dandelion Houses. Her hands bear marks from her biological mother's tears — a quiet power destined to save a Weight.",
    },
    publicMode: {
      pt: "CAMADA PÚBLICA (INFLUENCER): Criadora de conteúdo seguida por multidões, compartilhando ideias coerentes sobre superação e disciplina — sob o roteiro invisível da Creche das IS'.",
      en: "PUBLIC LAYER (INFLUENCER): A charismatic digital creator followed by crowds for sharp advice on growth and discipline — quietly orchestrated by the IS' Nursery.",
    },
    tacticalMode: {
      pt: "CAMADA OCULTA (IS 53 2): Infiltrada de elite capaz de amplificar o azar de Racso e neutralizar uma equipe inteira. Sua virada começa quando decide não envenenar Lumem.",
      en: "HIDDEN LAYER (IS 53 2): Elite operative capable of amplifying Racso's bad-luck aura to take down an entire squad. Her turning point begins when she refuses to poison Lumem.",
    },
    quote: { pt: '"I\'ll be your dandelion."', en: '"I\'ll be your dandelion."' },
    connections: ["Equipe PEARL", "Hoshiko Marangori", "Лаура / Supervisora", "Lumem"],
  },
  {
    id: "estella",
    name: "Estella Marangoli",
    codename: "Pearl · Stella Maran Go",
    hasVisual: true,
    categories: ["visual", "weights"],
    accent: "#29B6D1",
    img: "/images/characters/estella_16_drones.jpg",
    specialType: "estella",
    phases: [
      {
        agePt: "9 anos · Pipa",
        ageEn: "Age 9 · Kite",
        src: "/images/characters/estella_9_pipa.jpg",
        descPt:
          "A criança Weight que carregou o peso do mundo como se fosse uma folha de papel — fazendo a humanidade prosperar em inteligência enquanto corria com sua pipa.",
        descEn:
          "The child Weight who carried the world's burden like a sheet of paper — sparking an era of human brilliance while running with her kite.",
      },
      {
        agePt: "16 anos · Drones",
        ageEn: "Age 16 · Drones",
        src: "/images/characters/estella_16_drones.jpg",
        descPt:
          "Investigadora incansável, criadora de IAs próprias e drones sensores capazes de detectar a energia liberada pelas lágrimas de Anaira.",
        descEn:
          "Relentless investigator who builds her own AI systems and sensor drones capable of detecting the energy released by Anaira's tears.",
      },
      {
        agePt: "30 anos · Pearl",
        ageEn: "Age 30 · Pearl",
        src: "/images/characters/estella_30_formal.jpg",
        descPt:
          "Psicóloga, palestrante e pesquisadora da Yep, A University. Suas palavras de afirmação são fundamentadas em fatos — doces como favo de mel e precisas como bisturi.",
        descEn:
          "Psychologist, speaker, and Yep, A University researcher. Her words of affirmation are grounded in observation — sweet as honeycomb, razor-sharp in clarity.",
      },
    ],
    role: {
      pt: "Discípula do Professor · Ex-Weight · Pesquisadora",
      en: "Professor's Disciple · Former Weight · Researcher",
    },
    evidence: {
      pt: "Aumento de repertório e leitura do presente",
      en: "Continuous repertoire growth & reading the present",
    },
    summary: {
      pt: "Enquanto Lumem enxerga o futuro, Estella decodifica o presente com metacognição, ciência e domínio de linguagens. Irmã gêmea de Hoshiko e mente brilhante da Equipe PEARL.",
      en: "While Lumem sees the future, Estella decodes the present through metacognition, science, and linguistics. Twin sister of Hoshiko and the analytical heart of Team PEARL.",
    },
    quote: { pt: '"Me ensina a te vencer?"', en: '"Will you teach me how to beat you?"' },
    connections: ["O Professor", "Hoshiko Marangori", "Equipe PEARL", "Yep, A University"],
  },
  {
    id: "hoshiko",
    name: "Hoshiko Marangori",
    codename: "星子 マランゴリ · Dualidade",
    hasVisual: true,
    categories: ["visual", "dandelions"],
    accent: "#9E2436",
    img: "/images/characters/anaira_hoshiko_treinamento.jpg",
    gallery: [
      {
        src: "/images/characters/anaira_hoshiko_treinamento.jpg",
        pt: "Treinamento com Anaira",
        en: "Training alongside Anaira",
      },
      {
        src: "/images/characters/anaira_hoshiko_heranca.jpg",
        pt: "Herança em um Mundo Hostil",
        en: "Inheritance in a Hostile World",
      },
    ],
    role: {
      pt: "Pupila de Anaira · Irmã Gêmea de Estella",
      en: "Anaira's Protégée · Estella's Twin Sister",
    },
    evidence: {
      pt: "Espelho trágico, escolhas divergentes e redenção",
      en: "Tragic mirror, diverging paths & redemption",
    },
    summary: {
      pt: "Cresceu ao lado de Anaira em um ambiente hostil enquanto sua irmã gêmea Estella era lapidada pelo Professor. Duas origens distintas para o mesmo sangue — até seus caminhos colidirem em torno de Lumer.",
      en: "Raised alongside Anaira in a harsh environment while her twin sister Estella was mentored by the Professor. Two opposing worlds for the same bloodline — until their paths collide around Lumer.",
    },
    quote: {
      pt: '"Duas irmãs. Uma missão que não deveria existir."',
      en: '"Two sisters. A mission that should never have existed."',
    },
    connections: ["Estella Marangoli", "Anaira", "Lumer", "Creche das IS'"],
  },
  {
    id: "supervisora",
    name: "Supervisora",
    codename: "Pekka Robozona · Comando IS'",
    hasVisual: true,
    categories: ["visual", "dandelions"],
    accent: "#64748B",
    img: "/images/characters/supervisora_pekka.jpg",
    role: { pt: "Comandante da Creche das IS'", en: "Commander of the IS' Nursery" },
    evidence: {
      pt: "Sacrifício silencioso e firmeza de propósito",
      en: "Silent sacrifice & unyielding purpose",
    },
    summary: {
      pt: "A mulher severa que nunca precisou parecer gentil. Lida inicialmente como antagonista implacável, esconde uma história profunda de perdão, lealdade ao Professor e proteção a um custo altíssimo.",
      en: "The stern woman who never needed to appear gentle. Initially perceived as a ruthless antagonist, she carries a deep story of forgiveness, loyalty to the Professor, and costly protection.",
    },
    quote: {
      pt: '"Nem tudo o que fere foi feito para destruir."',
      en: '"Not everything that hurts was built to destroy."',
    },
    connections: ["O Professor", "Anaira", "66 Casas das Dandelions"],
  },
  {
    id: "laura",
    name: "Лаура (Laura)",
    codename: "Λάουρα · Lauren · 66 Casas",
    hasVisual: true,
    categories: ["visual", "dandelions"],
    accent: "#E2A93B",
    img: "/images/characters/laura_mentora.jpg",
    gallery: [
      {
        src: "/images/characters/laura_mentora.jpg",
        pt: "Лаура — Mentora (~50 anos)",
        en: "Laura — Mentor (~50 years old)",
      },
      {
        src: "/images/characters/dandelions_casas.jpg",
        pt: "As 66 Casas das Dandelions",
        en: "The 66 Dandelion Houses",
      },
    ],
    role: {
      pt: "Mentora de Anaira · Arquiteta das 66 Casas",
      en: "Anaira's Mentor · Architect of the 66 Houses",
    },
    evidence: {
      pt: "Gestão estratégica e têmpera humana",
      en: "Strategic stewardship & human tempering",
    },
    summary: {
      pt: "Conhecida em múltiplos idiomas (Grego, Russo, Inglês), estruturou a rede global das 66 Casas das Dandelions inspirada em Isaías — guiando processos difíceis como a têmpera do aço.",
      en: "Known across languages (Greek, Russian, English), she structured the global network of 66 Dandelion Houses modeled on Isaiah — guiding hardship like the tempering of steel.",
    },
    quote: {
      pt: '"O aço só revela sua força na forma como é resfriado."',
      en: '"Steel only reveals its strength in the way it is cooled."',
    },
    connections: ["Anaira", "66 Casas das IS'", "Supervisora"],
  },
  {
    id: "filha_prof",
    name: "Filha do Professor",
    codename: "As 3 Realidades · 4ª Linha",
    hasVisual: true,
    categories: ["visual", "weights"],
    accent: "#29B6D1",
    img: "/images/characters/filha_professor.jpg",
    gallery: [
      {
        src: "/images/characters/filha_professor.jpg",
        pt: "Retrato Oficial — Energia & Tempestade",
        en: "Official Portrait — Storm & Lightning",
      },
      {
        src: "/images/characters/trio_universo.jpg",
        pt: "Encontro de núcleos com Estella e Dandelion",
        en: "Crossroads with Estella & Dandelion",
      },
    ],
    role: {
      pt: "Detentora das 3 Memórias do Futuro",
      en: "Bearer of 3 Future Realities",
    },
    evidence: {
      pt: "Clarividência acumulada (270 anos de lapidação)",
      en: "Accumulated foresight (270 years of refinement)",
    },
    summary: {
      pt: "Recebeu em sua mente três realidades consecutivas de 90 anos cada, lapidando e corrigindo eventos até habitar a quarta realidade. Carrega um peso que quase ninguém consegue imaginar.",
      en: "Received three consecutive 90-year futures in her mind, refining and correcting catastrophes until living in the fourth reality. She carries knowledge almost no one can fathom.",
    },
    quote: {
      pt: '"Eu já vi três versões do fim deste mundo."',
      en: '"I have already seen three versions of this world\'s end."',
    },
    connections: ["O Professor", "Supervisora", "Estella Marangoli"],
  },
  {
    id: "pdp",
    name: "PDP",
    codename: "Professor do Professor · Weight",
    hasVisual: true,
    categories: ["visual", "weights"],
    accent: "#29B6D1",
    img: "/images/characters/pdp_weight_bicicleta.jpg",
    role: {
      pt: "Mentor do Professor · O Weight de Bicicleta",
      en: "The Professor's Mentor · The Cycling Weight",
    },
    evidence: {
      pt: "Velocidade, legado e paradoxo de retorno",
      en: "Momentum, legacy & the paradox of return",
    },
    summary: {
      pt: "O lendário Weight que corria de bicicleta e cuja energia moldou toda uma era antes de Estella. Seu retorno posterior à condição Weight abre um dos maiores paradoxos científicos do universo.",
      en: "The legendary cycling Weight whose kinetic energy shaped an entire era before Estella. His later return to the Weight mantle opens one of the universe's greatest scientific paradoxes.",
    },
    quote: {
      pt: '"O planeta espelha quem escolhe continuar em movimento."',
      en: '"The planet mirrors the one who refuses to stop moving."',
    },
    connections: ["O Professor", "Estella Marangoli", "Lumer"],
  },
  {
    id: "dandelions",
    name: "As Dandelions",
    codename: "66 Casas · Códigos de Isaías",
    hasVisual: true,
    categories: ["visual", "dandelions"],
    accent: "#E2A93B",
    img: "/images/characters/dandelions_casas.jpg",
    role: { pt: "Rede Global das IS'", en: "Global Network of the IS'" },
    evidence: {
      pt: "Resiliência coletiva — sementes ao vento",
      en: "Collective resilience — seeds on the wind",
    },
    summary: {
      pt: "Distribuídas em 66 casas pelo planeta, cada integrante recebe um código ligado a um versículo de Isaías. Pequenas individualmente, mas capazes de reescrever sistemas inteiros quando dispersas.",
      en: "Distributed across 66 houses worldwide, each member carries a codename linked to a verse in Isaiah. Small alone, yet capable of reshaping entire systems when scattered.",
    },
    quote: {
      pt: '"Crescer onde parecia impossível. Espalhar novos começos."',
      en: '"Growing where it seemed impossible. Scattering new beginnings."',
    },
    connections: ["Лаура (Laura)", "Supervisora", "Anaira (IS 53 2)"],
  },
  {
    id: "broken_teacher",
    name: "Broken Teacher",
    codename: "Sinal #00 · O Desconector",
    hasVisual: true,
    requiresReveal: true,
    categories: ["visual", "weights"],
    accent: "#9E2436",
    img: "/images/characters/broken_teacher.jpg",
    role: {
      pt: "Advogado, Promotor & Arquiteto da Queda",
      en: "Lawyer, Prosecutor & Architect of the Collapse",
    },
    evidence: {
      pt: "Domínio psicológico absoluto e imprevisibilidade",
      en: "Absolute psychological mastery & unpredictability",
    },
    summary: {
      pt: "O único personagem capaz de reduzir o Professor a um mero 'teacher'. Desce de data centers fora da Terra apenas para testar a própria hipocrisia, controlando até quem tenta feri-lo.",
      en: "The only figure capable of reducing the Professor to a mere 'teacher'. Descends from off-world data centers just to test his own hypocrisy, choreographing even those who strike him.",
    },
    quote: {
      pt: '"Estou um pouco hipócrita hoje."',
      en: '"I am feeling a little hypocritical today."',
    },
    connections: ["O Professor", "Estella Marangoli", "Broken Net"],
  },
  {
    id: "lumem_adulto",
    name: "Lumem (Adulto)",
    codename: "PEARL [L] · ARQUIVO SECRETO",
    hasVisual: false,
    silhouette: "prophet",
    categories: ["secret", "weights"],
    accent: "#E2A93B",
    role: {
      pt: "Protagonista · Profeta & Apostólico",
      en: "Protagonist · Prophet & Apostolic",
    },
    evidence: {
      pt: "Visão do futuro, solidão escolhida e amor sacrificial",
      en: "Prophetic foresight, chosen solitude & sacrificial love",
    },
    summary: {
      pt: "Vê o futuro das pessoas independentemente de quem elas parecem ser hoje. Come peras na frente da Equipe PEARL até que todos compreendam seu próprio valor. Seu visual oficial permanece em sigilo.",
      en: "Sees people's futures regardless of who they appear to be today. Eats pears in front of Team PEARL until everyone recognizes their own worth. His official visual remains classified.",
    },
    quote: {
      pt: '"You\'ll be my dandelion. I\'ll wait for your love."',
      en: '"You\'ll be my dandelion. I\'ll wait for your love."',
    },
    connections: ["Equipe PEARL", "Anaira", "Estella", "O Professor"],
  },
  {
    id: "lumem_novo",
    name: "Novo Lumem",
    codename: "ITERAÇÃO 02 · ARQUIVO SECRETO",
    hasVisual: false,
    silhouette: "youth",
    categories: ["secret"],
    accent: "#E2A93B",
    role: {
      pt: "Sucessor & Receptor de Legado",
      en: "Successor & Heir of Legacy",
    },
    evidence: {
      pt: "Continuidade, aprendizado e identidade própria",
      en: "Continuity, growth & forging a new identity",
    },
    summary: {
      pt: "Jovem e inexperiente, precisa ser guiado por Anaira e pela Equipe PEARL para unir o legado do primeiro Lumem à sua própria força. Visual oficial bloqueado para evitar spoilers.",
      en: "Young and untested, guided by Anaira and Team PEARL to bridge the first Lumem's legacy with his own emerging identity. Official visual locked to avoid spoilers.",
    },
    quote: {
      pt: '"Um novo começo construído sobre memórias que não morreram."',
      en: '"A new beginning built on memories that refused to die."',
    },
    connections: ["Anaira", "Lumem (Adulto)", "Equipe PEARL"],
  },
  {
    id: "lumer",
    name: "Lumer",
    codename: "WEIGHT CLASSE-S · ARQUIVO SECRETO",
    hasVisual: false,
    silhouette: "runner",
    categories: ["secret", "weights"],
    accent: "#29B6D1",
    role: {
      pt: "O Maior Weight Que Já Existiu",
      en: "The Greatest Weight Who Ever Lived",
    },
    evidence: {
      pt: "Honra, fidelidade e o peso do amor pelo mundo",
      en: "Honor, loyalty & carrying the weight of love for the world",
    },
    summary: {
      pt: "Passa de uma vida sem propósito à corrida sobrenatural que sustenta a prosperidade da Terra: quando corre, o planeta floresce; quando desacelera, o mundo entra em declínio. Visual reservado.",
      en: "Transforms from an aimless life into the supernatural runner sustaining Earth's prosperity: when he runs, the planet thrives; when he slows, the world declines. Visual reserved.",
    },
    quote: {
      pt: '"Você carregará o peso da eternidade do amor em suas pernas."',
      en: '"You will carry the weight of eternity\'s love in your legs."',
    },
    connections: ["Anaira (Lágrimas)", "Hoshiko", "O Professor", "Lumem"],
  },
  {
    id: "racso",
    name: "Racso",
    codename: "PEARL [R] · ARQUIVO SECRETO",
    hasVisual: false,
    silhouette: "luck",
    categories: ["secret"],
    accent: "#E2A93B",
    role: { pt: "Integrante da Equipe PEARL", en: "Team PEARL Member" },
    evidence: {
      pt: "Comédia, aura de sorte/azar e amadurecimento",
      en: "Comedy, luck/misfortune aura & personal maturity",
    },
    summary: {
      pt: "Carrega uma aura involuntária que redistribui sorte e azar segundo suas emoções — quando se apaixona, entrega toda a sorte a quem ama. Evolui da água para o vinho ao longo da saga.",
      en: "Carries an involuntary aura redistributing luck and misfortune based on his emotions — when he falls in love, he gives all his luck away. Undergoes a remarkable evolution.",
    },
    quote: {
      pt: '"A sorte abre portas — mas só o caráter sabe cuidar do que entra."',
      en: '"Luck opens doors — only character knows how to steward what walks in."',
    },
    connections: ["Equipe PEARL", "Estella Marangoli", "Anaira"],
  },
  {
    id: "professor",
    name: "O Professor",
    codename: "ARQUITETO · ARQUIVO SECRETO",
    hasVisual: false,
    silhouette: "mentor",
    categories: ["secret", "weights"],
    accent: "#64748B",
    role: {
      pt: '"Técnico em Mecânica de Pessoas"',
      en: '"Human Mechanics Engineer"',
    },
    evidence: {
      pt: "Discernimento, propósito sem dependência e formação",
      en: "Discernment, purpose without dependency & mentorship",
    },
    summary: {
      pt: "Não busca aprovação nem vencer discussões — busca formar pessoas capazes de continuar andando mesmo quando o núcleo muda. Criador da filosofia dos Elétrons Livres vs. Presos.",
      en: "Does not seek approval or winning arguments — he forges people able to keep moving even when leadership changes. Creator of the Free vs. Bound Electrons philosophy.",
    },
    quote: {
      pt: '"Eu não estou tentando construir minha reputação. Estou tentando construir Lumem."',
      en: '"I am not trying to build my reputation. I am trying to build Lumem."',
    },
    connections: ["Estella Marangoli", "PDP", "Filha do Professor", "Supervisora"],
  },
  {
    id: "outros_secretos",
    name: "Registros Ocultos",
    codename: "PEY TOLA · JOHN COCK · +",
    hasVisual: false,
    silhouette: "mystery",
    categories: ["secret"],
    accent: "#9E2436",
    role: {
      pt: "Personagens em Sigilo Narrativo",
      en: "Characters Under Narrative Embargo",
    },
    evidence: {
      pt: "Mistérios reservados às próximas edições",
      en: "Mysteries reserved for upcoming editions",
    },
    summary: {
      pt: "Dossiê reservado para figuras ainda sem base visual pública — incluindo John Cock, Han Well, Po, Dimitri, o Profeta e os segredos finais de Pey Tola.",
      en: "Reserved dossier for figures whose official visuals remain under wraps — including John Cock, Han Well, Po, Dimitri, the Prophet, and the final secrets of Pey Tola.",
    },
    quote: {
      pt: '"Nem toda história pode ser contada na primeira página."',
      en: '"Not every story can be told on page one."',
    },
    connections: ["Arco Lumer", "Broken Net", "yep a lot"],
  },
];

export const OFFICIAL_TRACKS: TrackItem[] = [
  {
    id: "t1",
    code: "01",
    title: "Is53 2 (Yep, A Lot) — Anaira e Lumem",
    src: "/audio/is53_2_anaira_e_lumem.mp3",
    cover: "/images/characters/anaira_batalha.jpg",
    eraTag: "IS 53 2",
    sourceBadge: "OST OFICIAL",
    categories: ["theme", "anaira"],
    duration: "01:32",
    linkedCharId: "anaira",
    linkedCharLabel: "Anaira (IS 53 2)",
    mood: {
      pt: "Tema Principal · Dueto Narrativo",
      en: "Main Theme · Narrative Duet",
    },
    storyNote: {
      pt: "Dueto central que conecta o codinome IS 53 2 à promessa entre Anaira e Lumem ao longo da transição de Broken Net para Yep, A Lot.",
      en: "Central duet linking codename IS 53 2 to the promise between Anaira and Lumem across the transition from Broken Net to Yep, A Lot.",
    },
  },
  {
    id: "t2",
    code: "02",
    title: "Yep A Lot — Tema Principal (Nova Versão)",
    src: "/audio/yep_a_lot_tema.mp3",
    cover: "/images/characters/capa_esboco_01a.jpg",
    eraTag: "VOLUME 1",
    sourceBadge: "OST OFICIAL",
    categories: ["theme"],
    duration: "02:19",
    linkedCharId: "lumem_adulto",
    linkedCharLabel: "Lumem (Arquivo Secreto)",
    mood: {
      pt: "Abertura Oficial · Universo SBY",
      en: "Official Theme · SBY Universe",
    },
    storyNote: {
      pt: "Assinatura sonora oficial do Volume 1 — traduz a atmosfera energética e misteriosa do código espalhado pelo planeta.",
      en: "Official sonic signature from Volume 1 — capturing the kinetic, mysterious atmosphere of the code scattered across the globe.",
    },
  },
  {
    id: "t3",
    code: "03",
    title: "Sweet Dandelion — Child Anaira",
    src: "/audio/sweet_dandelion_child_anaira.mp3",
    cover: "/images/characters/anaira_hoshiko_treinamento.jpg",
    eraTag: "DANDELION",
    sourceBadge: "OST OFICIAL",
    categories: ["anaira"],
    duration: "03:34",
    linkedCharId: "anaira",
    linkedCharLabel: "Anaira & Hoshiko",
    mood: {
      pt: "Origem · Infância & Tatuagem de Lágrimas",
      en: "Origin · Childhood & Tear Marks",
    },
    storyNote: {
      pt: "Evoca a infância perdida de Anaira, a proteção silenciosa da mãe biológica e o florescer da filosofia do dente-de-leão nas 66 Casas.",
      en: "Evokes Anaira's lost childhood, her biological mother's silent sacrifice, and the resilience of the Dandelion philosophy across the 66 Houses.",
    },
  },
  {
    id: "t4",
    code: "04",
    title: "Is53 2 (Yep, A Lot) — Broadway Edition",
    src: "/audio/is53_2_broadway.mp3",
    cover: "/images/characters/dandelions_casas.jpg",
    eraTag: "BROADWAY",
    sourceBadge: "OST OFICIAL",
    categories: ["dramatic"],
    duration: "03:34",
    linkedCharId: "estella",
    linkedCharLabel: "Estella (Pearl)",
    mood: {
      pt: "Arranjo Teatral · Equipe PEARL",
      en: "Theatrical Arrangement · Team PEARL",
    },
    storyNote: {
      pt: "Arranjo grandioso em estilo Broadway que expande o tema Is53 2 para o palco da Equipe PEARL e da era Sound Name.",
      en: "Grand Broadway-style arrangement expanding the Is53 2 motif for the full stage of Team PEARL and the Sound Name era.",
    },
  },
  {
    id: "t5",
    code: "05",
    title: "Yep A Lot x Is53 2 — Romantic Drama",
    src: "/audio/yep_a_lot_romantic_drama.mp3",
    cover: "/images/characters/anaira_hoshiko_heranca.jpg",
    eraTag: "DRAMA",
    sourceBadge: "OST OFICIAL",
    categories: ["dramatic", "anaira"],
    duration: "03:43",
    linkedCharId: "hoshiko",
    linkedCharLabel: "Herança & Dualidade",
    mood: {
      pt: 'Pertencimento · "O Amanhã Vai Ser Melhor"',
      en: 'Belonging · "Tomorrow Will Be Better"',
    },
    storyNote: {
      pt: "Fusão dramática entre os motivos de Yep A Lot e Is53 2 — trilha ideal para os momentos de virada emocional e reconciliação.",
      en: "Dramatic fusion of the Yep A Lot and Is53 2 motifs — built for emotional turning points and moments of belonging.",
    },
  },
];

export const SEED_WRITING: WritingEntry = {
  id: "w_seed_1",
  characterId: "lumem_adulto",
  entryType: "scene",
  era: "Broken Net",
  title: "A Pera na Mesa da Equipe PEARL",
  body: "Lumem colocou cinco peras sobre a mesa sem fazer discurso. Ninguém estendeu a mão no primeiro minuto. Racso fez uma careta, Estella analisou o gesto em silêncio e Anaira apenas observou quem pegaria primeiro. Quando, semanas depois, todos passaram a comer a fruta sem perceber, o leitor já sabia o que eles ainda iam descobrir: o grupo finalmente enxergava o próprio valor.",
  status: "published",
  isCanon: true,
  authorName: "Bruno Moreira e Silva",
  updatedAt: "2026-11-20T00:00:00.000Z",
};

export const VALID_REVEAL_CODES = [
  "is 53 2",
  "is53 2",
  "is53",
  "pearl",
  "pey tola",
  "peytola",
  "yep a lot",
  "yep, a lot",
  "dandelion",
];
