# Revisão de Domínio, Mercado e Regulação — Student Management System

> **Propósito:** auditar o sistema sob duas lentes que o roadmap de engenharia não cobre por
> construção — (a) as **capacidades que o segmento de gestão escolar particular BR** exige e (b) as
> **implicações de mundo real** (dado sensível de menor, lei) dos relacionamentos e permissões — e
> apontar o **delta** frente ao `docs/roadmap.md`, propondo um horizonte de produto v2.0.
>
> **Data:** 2026-07-10.
>
> **Natureza:** este documento é **COMPLEMENTAR** ao [`roadmap.md`](roadmap.md) — **não o substitui**.
> O `roadmap.md` continua sendo o artefato-âncora de engenharia (fundação → ciclo acadêmico →
> hardening → cutover). Aqui tratamos do que está **fora** do escopo que aquele roadmap assumiu ao
> ancorar-se no princípio *"os models que já existem são a especificação"* (roadmap.md:16).

## Escopo e suposições (decisões do dono)

Para não assumir em silêncio, as fronteiras abaixo foram decididas explicitamente e valem para todo o
documento:

1. **Financeiro** — modelar contrato/mensalidade/inadimplência/bolsa no schema, **delegando a cobrança**
   (boleto/PIX/conciliação/NF) a um **gateway externo** (Asaas/Pagar.me/isaac). O sistema não se torna
   meio de pagamento.
2. **Multi-tenant** — **multi-unidade da mesma rede/mantenedora**, com isolamento de dados por unidade
   via `staff_units`. **Não** é SaaS multi-escola (um tenant por cliente).
3. **Portal da família/aluno** — direção de produto **posterior ao núcleo** administrativo/acadêmico
   (depende de nota, frequência e financeiro existirem primeiro).
4. **Maturidade atual** — o sistema é acadêmico/portfólio e **ainda não opera com dados reais de alunos
   menores** (o núcleo acadêmico Tier 3–5 sequer tem superfície HTTP — roadmap.md:152-154). Logo, os
   requisitos legais do §3 são apresentados como **pré-condição para operar de verdade**, não como
   violação em produção. Estado operacional de produção fica deliberadamente **fora** deste documento.

---

## §1 — Estado sob a lente de domínio

Capacidades que uma escola particular BR espera de um sistema de gestão, cruzadas com o que existe no
código. `Tem` = superfície HTTP+UI utilizável · `Parcial` = modelado mas sem HTTP/UI, ou rígido ·
`Falta` = inexistente.

| Capacidade do segmento | Estado | Evidência (arquivo:linha) |
|---|---|---|
| Cadastro de alunos/responsáveis/staff (secretaria) | **Tem** | `backend/src/controllers/StudentController.js`, `GuardianController.js`, `StaffController.js`; UI em `frontend/src/pages/{Student,Staff,Guardian}` |
| Vínculo aluno↔responsável (N:N, resp. financeiro/emergência) | **Tem** (dado) | `backend/src/models/StudentGuardian.js:15,24,28` (`relationship_type`, `is_financial_resp`, `is_emergency_contact`) |
| Estrutura acadêmica (unidades, turmas, disciplinas, lotação) | **Parcial** (model, sem HTTP/UI) | models `Unit`/`UnitClass`/`Subject`/`StaffUnit` sem controller/rota (roadmap.md:152-154) — Fase 3A |
| Matrícula (enrollment) | **Parcial** (model, sem HTTP/UI) | `backend/src/models/StudentClass.js:15,20` (`enrollment_date`, `enrollment_status`) — Fase 3B |
| Alocação professor×turma×disciplina | **Parcial** (model, sem HTTP/UI) | `backend/src/models/ClassAllocation.js` — Fase 3B |
| Lançamento de notas | **Parcial / rígido** | `backend/src/models/StudentGrade.js:15-46` — `grade_1..grade_4` DECIMAL fixos; sem período/config |
| Frequência | **Parcial** (model, sem HTTP/UI) | `backend/src/models/Attendance.js:15,20` (`date`, `attendance_status`) — Fase 3C |
| Calendário / ano letivo / bimestre (entidade) | **Falta** | apenas `unit_classes.school_year` varchar livre — `backend/src/models/UnitClass.js:51` |
| Boletim / histórico escolar / declaração / certificado | **Falta** | nenhuma entidade; notas soltas por disciplina em `StudentGrade` |
| Config de avaliação (pesos, média de aprovação, conceitos) | **Falta** | notas fixas; faixa 0–10 só na validação do model (`StudentGrade.js:15-54`) |
| Financeiro / mensalidade / inadimplência / bolsa | **Falta** | só flags `access_levels.manage_finance` (`AccessLevel.js:20`) e `student_guardians.is_financial_resp` (`StudentGuardian.js:24`) |
| Comunicação com responsáveis (comunicados, confirmação de leitura) | **Falta** | nenhuma tabela de mensageria/notificação |
| Documentos / anexos (RG, laudo, contrato, foto) | **Falta** | tabela `photos` foi dropada (`migrations/20260624113330-drop-photos-table.js`); só `avatar_url` string |
| Ocorrências / disciplina | **Falta** | apenas o valor `'suspended'` nos ENUMs de `status` |
| Saúde estruturada (alergias, medicação, contato médico) | **Falta** (texto livre) | `students.blood_type`/`medical_notes` (`Student.js:94,104`), `staff.medical_notes` (`Staff.js:120`) |
| Portal da família/aluno (family-facing) | **Falta** (só login) | login autentica `users` (`TokenController.js:46`); escopo por papel em `StudentController.js:170-175,288-308`; sem UI própria |
| Isolamento multi-unidade (tenancy em runtime) | **Falta** | nenhum controller filtra query por unidade (grep `unit_id`/`staff_units` em `controllers/` = 0) — roadmap H1 |
| Conformidade LGPD-menores (consentimento, finalidade, audit log, direitos) | **Falta** | nenhuma tabela de consentimento/auditoria/RIPD |
| Reporte Censo Escolar / Educacenso (INEP) | **Falta** | sem `inep_code`, sem campos exigidos (cor/raça, deficiência), sem exportação |

**Leitura:** o sistema cobre bem a **camada cadastral de atores** (pessoas + endereços + credenciais).
Todo o **ciclo acadêmico operacional** (turmas→matrícula→alocação→nota→frequência) está modelado mas
sem HTTP/UI — é a Fase 3 do roadmap. E toda a **camada de produto de mercado** (financeiro,
comunicação, boletim, portal) e a **camada regulatória** (LGPD-menores, Censo) **não existem** — é o
delta deste documento (§4).

---

## §2 — Benchmark de mercado BR

Players reais do segmento e o que oferecem, para extrair o padrão de features e o gap do nosso sistema.

| Player | O que oferece (relevante ao gap) | Gap do nosso sistema | Fonte |
|---|---|---|---|
| **Sponte** | Suíte com gestão acadêmica + **financeira** (boleto automatizado, régua de inadimplência, "Mensalidade Garantida"), comunicação com pais e **boletim online**. | Financeiro e boletim **inexistentes**; sem comunicação. | [sponte.com.br/gestao-financeira](https://www.sponte.com.br/gestao-financeira), [blog boletim](https://www.sponte.com.br/blog/boletim-escolar-saiba-por-que-ele-pode-ser-uma-ferramenta-eficiente-para-sua-instituicao) |
| **WPensar · Sophia · TOTVS Educacional** | Suítes completas (financeiro + acadêmico + pedagógico + comunicação) para instituições de todos os portes. | Só temos cadastro de atores; falta o núcleo acadêmico via UI e todos os módulos de produto. | [blog.vindi.com.br (21 sistemas)](https://blog.vindi.com.br/os-12-principais-softwares-de-gestao-escolar/), [totvs.com/educacional](https://www.totvs.com/educacional/) |
| **isaac** | Plataforma de **gestão financeira escolar** (mensalidade garantida, cobrança mensal, boleto, renegociação). É a referência do modelo "financeiro via plataforma externa" adotado (decisão de escopo 1). | Não temos financeiro; a decisão é integrar, não reconstruir. | [isaac.com.br](https://isaac.com.br/) |
| **ClassApp · Agenda Edu** | **Comunicação escola-família**: comunicados com **confirmação de leitura**, **assinatura digital com validade jurídica**, mural de fotos, documentos, e cobrança integrada. Agenda Edu integra com 20+ sistemas de gestão. | Nenhum canal de comunicação/autorização; referência direta para o módulo M5. | [classapp.com.br/funcionalidades](https://www.classapp.com.br/funcionalidades), [agendaedu.com](https://www.agendaedu.com/) |

> **Nota metodológica:** as descrições de features vêm de material dos próprios fornecedores (páginas de
> marketing) e são tratadas como **benchmark de mercado**, não como requisito legal ou técnico. Números
> comerciais (ex.: "reduz 30% da inadimplência") não são reproduzidos como fato. Onde uma feature não
> pôde ser confirmada em fonte primária, ela ficaria marcada como "não verificado".

**Padrão do mercado:** os players comerciais convergem para um tripé **acadêmico + financeiro +
comunicação**, com o financeiro e a comunicação frequentemente sendo o principal valor percebido pela
escola e pela família. Nosso sistema hoje entrega só o eixo cadastral do primeiro pé.

---

## §3 — Segurança do mundo real

> **Enquadramento:** a **segurança de código** (bugs de auth, contrato, rate-limit, bcrypt, upload) já é
> diagnosticada pelo `roadmap.md` em §1.2 e §1.6 — aqui **referenciamos, não duplicamos**. O foco é a
> **consequência no mundo real**: que dado sensível de menor está em jogo e o que a lei exige.

### Matriz: relacionamento/permissão → implicação real → risco → mitigação

| Relacionamento / Permissão | Implicação no mundo real | Risco | Mitigação |
|---|---|---|---|
| **Sem escopo por unidade** em nenhuma query (`staff_units` não filtra) | Um funcionário de uma unidade lê/edita dados de alunos de **todas** as unidades da rede | Vazamento de PII de menor entre unidades; incidente reportável à ANPD | **H1** do roadmap — helper de escopo por `staff_units` (roadmap.md:307). Reforço deste doc: tratar como pré-condição de operação real |
| **`GET /users/:id`** só com `loginRequired`, sem `roleAuth` nem posse (`userRoutes.js:27`) | Qualquer sessão autenticada (inclusive papel Student/Guardian) lê qualquer usuário por id | IDOR de leitura: e-mail, nível de acesso, peso hierárquico | **Já reconhecido** no roadmap (§1.2:138-140, **F2**). Fechar antes de expor mais superfície |
| **`req.userLevel` nunca populado** (`loginRequired.js:44-55`) + **`roleAuth` numérico legado** (`staffRoutes.js:10-14`) | Autorização de Staff/Guardian/Avatar hoje **falha fechada (403)**, mas a checagem de posse está **inerte** | Se a rota for "consertada" sem selar a posse, vira broken-access-control sobre dado de menor | **F1** do roadmap (auth é HITL). Reforço: selar posse **junto** com a flag, nunca só a flag |
| **`students.blood_type` / `medical_notes`** (texto livre) | Armazena **dado pessoal sensível de saúde** de menor sem finalidade, base legal ou cifragem | Tratamento de dado sensível (LGPD art. 11) sem salvaguarda; exposição em dump/backup | Módulo **M8** (saúde estruturada) + consentimento (M9) + cifragem de coluna. Roadmap só cobre redação em **logs** (H3), não o dado em repouso |
| **FKs em CASCADE** + soft-delete só por `status` | Hard delete de um aluno propaga e apaga `attendances`/`student_classes`/`student_grades`/`addresses` | Perda de **histórico escolar** — que a escola tem dever de guarda e o titular tem direito de acesso | Política de retenção (M9); bloquear hard delete de aluno com histórico; preferir anonimização |
| **Papéis `Student`/`Guardian` autenticam contra `users`** (`TokenController.js:46`) e leem via `StudentController` escopado | O modelo já prevê família/aluno lendo dados — mas o escopo depende de `student_guardians` e do bug de posse acima | Um responsável poderia alcançar aluno que não é seu se o escopo por vínculo falhar | Endurecer o escopo por `student_guardians` (M11) + testes de guarda (roadmap F4/H4) antes de abrir o portal |

### Camada regulatória (base legal citada)

Alunos são menores → todo o cadastro de aluno é tratamento de dados de criança/adolescente.

- **LGPD, art. 14** — o tratamento de dados de crianças e adolescentes deve ser feito **no melhor
  interesse** (caput); com **consentimento específico e em destaque de pelo menos um dos pais ou do
  responsável legal** (§1º); com **publicidade das finalidades** e dos dados coletados (§2º); **sem
  condicionar** a atividade ao fornecimento de dados além do necessário (§4º); com **esforço razoável de
  verificação** do consentimento (§5º). Fonte: [texto do art. 14 — lgpd-brasil.info](https://lgpd-brasil.info/capitulo_02/artigo_14).
  → **implica** as tabelas de consentimento/finalidade do módulo **M9**.
- **LGPD, art. 7º, V (execução de contrato)** — base legal adequada para tratar dados dos **responsáveis
  financeiros** no módulo de mensalidade **sem** exigir consentimento (o dado é necessário ao contrato de
  prestação de serviço educacional). Atenção: para o **dado do menor**, mesmo necessário ao contrato,
  prevalece o art. 14 (melhor interesse/consentimento). Fontes:
  [ibee.com.br — LGPD e escolas](https://ibee.com.br/materia/lei-geral-de-protecao-de-dados-e-escolas/),
  [art. 7º — lgpd-brasil.info](https://lgpd-brasil.info/capitulo_02/artigo_07). → **module M4**.
- **LGPD, art. 11 (dado sensível)** — dado de **saúde** (`blood_type`, `medical_notes`) é categoria
  especial, com hipóteses de tratamento mais restritas. → **module M8** (cifragem + finalidade).
- **LGPD, art. 18 (direitos do titular)** — acesso, correção, **eliminação**, portabilidade, informação
  sobre compartilhamento. Exige trilha e um fluxo de atendimento ao titular (ou seu responsável). →
  **module M9** (`data_subject_requests`).
- **ECA, art. 17** — direito ao respeito, incluindo a **inviolabilidade da imagem e identidade** da
  criança/adolescente; combinado com o **ECA Digital (Lei nº 15.211/2025, em vigor 17/03/2026)**, reforça
  que a **autorização de uso de imagem** deve ser específica, destacada e revogável (não um "aceite"
  genérico na matrícula). Fontes: [ECA e sigilo — jusbrasil](https://www.jusbrasil.com.br/artigos/eca-e-o-direito-ao-sigilo-de-dados/915993443),
  [Lei 15.211/2025 — planalto](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm),
  [ECA Digital — UNICEF](https://www.unicef.org/brazil/estatuto-digital-da-crianca-e-do-adolescente).
  → **modules M5/M6** (autorizações e documentos com consentimento).
- **Censo Escolar / Educacenso (INEP)** — a declaração ao Censo é **obrigatória para escolas públicas e
  privadas** com código INEP ativo (obrigatoriedade atribuída ao **Decreto nº 6.425/2008**, conforme
  material do INEP); coleta cruzada de **Escola, Turma, Aluno e Profissional escolar**; a não-declaração
  tem consequências administrativas. Fontes:
  [Censo Escolar — gov.br/INEP](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar),
  [Caderno de Conceitos INEP 2025](https://download.inep.gov.br/publicacoes/institucionais/estatisticas_e_indicadores/cadernos_de_conceitos_2025.pdf).
  → **module M10** (campos exigidos + exportação).

> **Diligência (repetida por importância):** como o sistema **ainda não opera com dados reais de alunos**,
> nada acima é uma infração corrente. São **requisitos que devem estar cumpridos antes** do marco de
> operação real — por isso entram no roadmap v2.0 como **pré-condição** (§5), não como incidente.
> Distinção mantida: **requisito legal** (com base citada) ≠ **boa prática de mercado** (§2).

---

## §4 — Delta vs. `roadmap.md`

**O que o roadmap JÁ cobre** (e este doc não repete): fundação/auth (Fase 1 — F1 auth, F2 contrato/IDOR,
F3 CI, F4 testes de guarda), ciclo acadêmico Tier 3–5 (Fase 3 — 3A/3B/3C), hardening (Fase 4 — **H1
multitenant**, H2 segurança, H3 observabilidade, H4 testes, H5 perf, H6 Vite) e cutover de infra
(Fase 5, concluído). O roadmap **já reconhece** o IDOR de `User.show` (F2) e a ausência de tenancy (H1).

**O que o roadmap NÃO cobre (delta)** — confirmado por leitura integral + grep (0 ocorrências de
`financ`/`mensalidad`/`LGPD`/`menor`/`consentimento`/`comunica`/`notifica`/`censo`/`inep`/`portal`/
`família` em `docs/roadmap.md`):

| Delta | Tipo | Relação com fase real do roadmap |
|---|---|---|
| Calendário / ano letivo / bimestre (entidade) | funcional (fundacional) | **novo** — pré-requisito de avaliação; hoje só `school_year` varchar |
| Avaliação estruturada (substitui `grade_1..4`) | funcional | **novo** — refatora o alvo da Fase 3C (`StudentGrade`) |
| Boletim / histórico / declaração / certificado | funcional | **novo** — derivado de calendário+avaliação |
| Financeiro-lite via gateway | funcional | **novo** (v2.0) — o roadmap declarou financeiro fora do "pronto" |
| Comunicação com responsáveis | funcional | **novo** (v2.0) |
| Documentos / anexos (pós-`photos`) | funcional / regulatório | **novo** — reabre a decisão R-C do roadmap (`photos`: modelar ou dropar) |
| Ocorrências / disciplina | funcional | **novo** |
| Saúde estruturada | funcional + regulatório | **novo** — hoje texto livre (§3, item M8) |
| Portal da família/aluno | funcional | **novo** — pós-núcleo (decisão do dono) |
| **Conformidade LGPD-menores** (consentimento, audit log, direitos, RIPD) | **regulatório** | **novo, transversal** — reforça e depende de H1/H2/H3 |
| **Censo/Educacenso** (campos + exportação) | **regulatório** | **novo** |
| Implicação de mundo real do isolamento (PII de menor) | segurança | **reforça** H1 — não duplica; adiciona a consequência legal |

---

## §5 — Recomendações priorizadas

Ordenadas por impacto × esforço. Etiquetas: **[funcional]** valor de produto/mercado ·
**[regulatório]** requisito legal · **[segurança]** consequência de mundo real. São **propostas** para
decisão, não decisões.

1. **[segurança] Fechar a fundação antes de expandir** — concluir **F1** (auth), **F2** (IDOR/contrato)
   e **H1** (tenancy) do roadmap **antes** de qualquer operação com dado real de menor. *Impacto: alto ·
   Esforço: médio · já no roadmap.*
2. **[regulatório] Núcleo de conformidade LGPD-menores** (M9) — consentimento (art. 14), audit log de
   acesso a dado de menor, marcação de dado sensível, política de retenção e fluxo de direitos (art. 18).
   *Impacto: alto (pré-condição legal) · Esforço: médio.*
3. **[funcional] Calendário/ano letivo (M1) + avaliação estruturada (M2)** — destravam boletim real,
   médias por período e relatórios; substituem `grade_1..4`. *Impacto: alto (fundacional) · Esforço: alto
   — toca schema core, HITL.*
4. **[funcional] Financeiro-lite via gateway (M4)** — contrato + plano + mensalidade + baixa por webhook
   do gateway; base legal art. 7º V. *Impacto: alto (valor de mercado) · Esforço: médio (integração).*
5. **[funcional] Comunicação com responsáveis (M5)** — comunicados com confirmação de leitura +
   autorizações (imagem/saída) com assinatura. *Impacto: alto (diferenciador) · Esforço: médio.*
6. **[regulatório] Exportação Censo/Educacenso (M10)** — adicionar `inep_code`, cor/raça, deficiência,
   nacionalidade e o gerador de layout. *Impacto: alto se operar (obrigatório) · Esforço: médio.*
7. **[funcional] Documentos (M6), ocorrências (M7), saúde estruturada (M8)** — completam a secretaria e
   fecham o item de dado sensível do §3. *Impacto: médio · Esforço: médio.*
8. **[funcional] Portal da família/aluno (M11)** — por último; depende de M2–M5. Maior diferenciador
   percebido pelas famílias, mas exige o núcleo pronto e o escopo de posse endurecido. *Impacto: alto ·
   Esforço: alto.*

O detalhamento de cada módulo (tabelas, HTTP/UI, HITL, checklists) e o sequenciamento por dependência
estão na seção **"6. Horizonte de produto — Extensão de domínio (v2.0)"** do [`roadmap.md`](roadmap.md).

---

## Fontes

**Mercado:**
[Sponte — gestão financeira](https://www.sponte.com.br/gestao-financeira) ·
[Sponte — boletim online](https://www.sponte.com.br/blog/boletim-escolar-saiba-por-que-ele-pode-ser-uma-ferramenta-eficiente-para-sua-instituicao) ·
[isaac](https://isaac.com.br/) ·
[ClassApp — funcionalidades](https://www.classapp.com.br/funcionalidades) ·
[Agenda Edu](https://www.agendaedu.com/) ·
[TOTVS Educacional](https://www.totvs.com/educacional/) ·
[Vindi — 21 sistemas de gestão escolar](https://blog.vindi.com.br/os-12-principais-softwares-de-gestao-escolar/)

**Regulação:**
[LGPD art. 14](https://lgpd-brasil.info/capitulo_02/artigo_14) ·
[LGPD art. 7º](https://lgpd-brasil.info/capitulo_02/artigo_07) ·
[LGPD e escolas — ibee.com.br](https://ibee.com.br/materia/lei-geral-de-protecao-de-dados-e-escolas/) ·
[Censo Escolar — gov.br/INEP](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar) ·
[Caderno de Conceitos INEP 2025](https://download.inep.gov.br/publicacoes/institucionais/estatisticas_e_indicadores/cadernos_de_conceitos_2025.pdf) ·
[ECA e o direito ao sigilo — jusbrasil](https://www.jusbrasil.com.br/artigos/eca-e-o-direito-ao-sigilo-de-dados/915993443) ·
[Lei 15.211/2025 (ECA Digital) — planalto](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm) ·
[ECA Digital — UNICEF Brasil](https://www.unicef.org/brazil/estatuto-digital-da-crianca-e-do-adolescente)

> **Verificação:** afirmações de mercado e de regulação têm fonte nomeada acima; referências a código
> apontam `arquivo:linha` lidos no repositório. Requisito legal (com base citada) foi distinguido de
> boa prática de mercado. Nenhum estado operacional ou vulnerabilidade de produção real foi incluído.
