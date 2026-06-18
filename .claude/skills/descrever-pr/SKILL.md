---
name: descrever-pr
description: Gera a descrição de um Pull Request a partir do diff contra a main, no padrão do projeto — header Conventional Commits + lista de bullets técnicos, sem seções. Use ao abrir/preparar um PR. Produz só o markdown para você revisar e colar — NUNCA roda gh pr create nem commita.
---

# Descrever PR

Monta a descrição de um PR a partir do que mudou em relação à `main`. **Só produz o texto** — você revisa e abre o PR. Não executa `gh`, não commita (mesma regra do `sugerir-commits`).

**Argumento opcional:** a branch base (default `main`).

## Passos

### 1. Levantar o diff da branch
- `git rev-parse --abbrev-ref HEAD` — branch atual.
- `git log --oneline main..HEAD` — commits da branch (insumo do "o que mudou").
- `git diff main...HEAD --stat` e `git diff main...HEAD` — escopo e conteúdo.

Se a branch ainda não tem commits (mudanças só no working tree), use `git status` + `git diff` e diga isso no fim.

### 2. Sintetizar no padrão

**O padrão do projeto é: header Conventional Commits + lista de bullets técnicos, sem seções.** Nada de `## Contexto` / `## O que mudou` / `## Como testar` / `## Riscos` / checklist — o corpo é uma lista plana de mudanças concretas.

```markdown
<tipo>(<escopo>): <descrição em pt-br>

- <mudança técnica concreta — o quê; cite arquivo/módulo quando ajudar>
- <prefixe por área quando útil: "Frontend: ...", "Seeder: ...", "Testes: ...">
- <itens transversais entram como bullet próprio, não como seção: env var nova, migration, breaking change>
```

Exemplo (estilo-alvo):

```markdown
feat(auth): acesso demo read-only one-click para a landing

- Endpoint POST /tokens/demo: loga o usuário demo (via DEMO_USER_EMAIL) e emite o cookie HttpOnly, sem credenciais no front
- Guard em loginRequired bloqueia toda mutação (método ≠ GET) do nível demo — trava única, independe do roleAuth por rota
- Seeder idempotente: nível de acesso Demo (flags manage_* zeradas) + usuário demo read-only
- Frontend: action/saga demoLogin (POST /tokens/demo → /dashboard), flag isDemo no reducer, CTA "Acessar demo" na landing e banner no Layout
- Env nova: DEMO_USER_EMAIL, DEMO_USER_PASSWORD, DEMO_LEVEL_ID (refletir no .env e no docker-compose da VPS)
```

### 3. Regras de conteúdo
- **Header** no padrão Conventional Commits do usuário (`<tipo>(<escopo>): <descrição pt-br>`), coerente com os commits da branch.
- **Corpo = lista de bullets**, em pt-br; identificadores/código em inglês. Sem seções, sem checklist.
- **Um bullet por mudança técnica relevante.** Agrupe prefixando por área quando ajudar (`Backend:`/`Frontend:`/`Seeder:`/`Testes:`). Não faça dump do diff — só o que importa.
- **Aterre no diff real.** Não invente passo nem placeholder.
- **Não deixe item transversal sumir:** migration que precisa rodar, env var nova (refletir em `.env` E docker-compose), breaking change de contrato e caveat de deploy entram como **bullets próprios** ao final.

### 4. Entregar
Imprima título e corpo em bloco para copiar e, abaixo, sugira o comando (para o usuário rodar, não você):
```
gh pr create --base <base> --title "<header>" --body-file <arquivo>
```

> Antes de abrir o PR, rode `revisar-mudancas` para o passe de revisão e `sugerir-commits` se ainda há mudanças por commitar.
