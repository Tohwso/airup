# AIRUP Kit v2.4.0 — Spec Sync Protocol (Proposta)

> **Autor:** Ricardo Costa
> **Data:** 2025-07-21
> **Status:** Proposta (aguardando validação)
> **Impacto:** Governante (principal), todos os especialistas (leitura)
> **Motivação:** Sem spec sync, a documentação apodrece na fase de evolução — exatamente o que matou o RUP humano.

---

## Problema

O pipeline AIRUP funciona muito bem na fase de **Elaboração** (pipeline linear feedforward).
Mas depois que o sistema está rodando e entra na fase de **Evolução** (maintenance, melhorias
incrementais, perfumarias), três coisas acontecem:

1. **Mudanças são implementadas diretamente no código** sem passar pelo pipeline completo
   (porque seria desproporcional rodar AN→AR→Arq→Dev→QA pra adicionar um botão)
2. **Os artefatos da spec não são atualizados** porque ninguém lembra, ou não existe um
   mecanismo que obrigue
3. **A spec diverge do código** — exatamente o failure mode que matou o RUP na era humana

O AIRUP Kit precisa de um mecanismo que torne o sync **inevitável, proporcional e barato**.

---

## Solução: 3 componentes

### 1. `changelog.md` — Novo artefato SDD (Governança)

Arquivo append-only em `spec/docs/00-overview/changelog.md`.
O Governante escreve uma entrada **toda vez que código muda de forma que diverge da spec**.

Formato de cada entrada:

```markdown
### [YYYY-MM-DD] CL-NNN: <Título>
**Tipo:** Feature | Fix | Refactor | Infra | Docs
**Artefatos impactados:** <lista de paths em spec/docs/>
**Sync:** ⬜ Pendente | ✅ Completo | 🔄 Parcial
**Task:** TASK-NNN (se aplicável)

<Descrição breve — 2-3 linhas>
```

O changelog serve 3 propósitos:
- **Rastreabilidade**: toda mudança tem registro, mesmo perfumarias
- **Backlog de sync**: entradas com "⬜ Pendente" são dívida documental explícita
- **Histórico**: qualquer um pode ver a evolução do sistema cronologicamente

### 2. Spec Sync Protocol — Nova regra do Governante

Quando uma mudança é implementada no código (seja via pipeline completo, seja diretamente):

```
Código mudou
    │
    ▼
👑 Gov cria entrada no changelog.md (CL-NNN)
    │
    ▼
👑 Gov identifica artefatos impactados (impact analysis)
    │
    ├── Impacto LEVE (< 3 artefatos, sem mudança arquitetural):
    │   → Gov atualiza os artefatos diretamente (append de RFs, update de seções)
    │   → Marca CL-NNN como ✅ Completo
    │
    ├── Impacto MÉDIO (3-5 artefatos, ou mudança de API/domínio):
    │   → Gov delega ao agente dono de cada artefato
    │   → Cada agente atualiza seu artefato cirurgicamente
    │   → Gov marca CL-NNN como ✅ Completo
    │
    └── Impacto PESADO (mudança arquitetural, novo bounded context, etc.):
        → Gov inicia mini-pipeline (apenas fases impactadas)
        → Ex: mudança de API → Arq atualiza design → Dev atualiza impl → QA re-verifica
```

**Regra de ouro**: O sync é PROPORCIONAL à mudança. Um botão novo = 1 RF novo no requirements.md.
Uma nova entidade de domínio = mini-pipeline Design → Dev → QA.

### 3. Task obrigatório na fase EVOLVE

Na fase de evolução, **toda mudança precisa de um `.md` em `spec/tasks/` ANTES de implementar**.
Mesmo perfumarias. O task pode ser de 5 linhas:

```markdown
# Task NNN: Adicionar favicon

## Status
Done

## Contexto
Apresentação do projeto amanhã.

## Escopo
Favicon emoji 📘 como SVG inline no <link rel="icon">.

## Artefatos Impactados
- frontend/index.html
- spec/docs/02-requirements/requirements.md (RF-50)
```

Isso garante:
- Rastreabilidade (cada mudança tem um número)
- Escopo definido ANTES de implementar (evita scope creep)
- Linkagem task ↔ changelog ↔ artefatos

---

## Mudanças no SDD Standard Structure

```diff
 spec/
 ├── docs/
 │   ├── 00-overview/
 │   │   ├── README.md
-│   │   └── progression.md
+│   │   ├── progression.md
+│   │   └── changelog.md              ← NOVO: histórico de mudanças (append-only)
```

---

## Mudanças no prompt do Governante

### SDD Tree
Adicionar `changelog.md` na árvore.

### Bootstrap Protocol
- GREENFIELD: criar `changelog.md` vazio (só header) durante scaffold
- BROWNFIELD: criar `changelog.md` com CL-001 "Reverse engineering inicial"
- EVOLVE: ler `changelog.md` para entender histórico recente

### Routing Decision Table
Adicionar:

| Demand Nature | Primary Agent | May Also Involve |
|---|---|---|
| Small improvement / perfumaria | Governor (direct sync) | Dev if code needed |
| Spec is outdated | Governor (spec sync) | Owner agents per artifact |
| Multiple improvements batch | Governor → changelog → batch sync | Multiple owners |

### Nova seção: "Evolution Phase Protocol"

(Análoga ao Construction Phase Protocol, mas para a fase de manutenção)

### Governance Strategies
Adicionar:

```
### 6. Spec Sync
- After ANY code change, create a changelog entry
- Identify impacted artifacts via impact analysis
- Sync proportionally: light changes = direct update, heavy = mini-pipeline
- Never allow > 5 pending sync entries — batch sync before continuing
- The changelog.md is the Governor's memory of what needs attention
```

---

## Mudanças nos prompts dos especialistas

**Mínimas.** Cada especialista recebe uma nova instrução na seção "Before Starting":

> "Check `spec/docs/00-overview/changelog.md` for recent changes that may affect your artifacts.
> If a CL-NNN entry lists your artifact as impacted and Sync is ⬜ Pendente, update your
> artifact to reflect the change before proceeding with new work."

---

## Impact Analysis: regra de mapeamento

| O que mudou | Artefatos impactados |
|---|---|
| Novo endpoint REST | `03-design/api_spec.md`, `02-requirements/requirements.md` |
| Novo campo em entidade | `03-design/domain_model.md`, `02-requirements/requirements.md` |
| Mudança de UI (frontend) | `02-requirements/requirements.md` (RF novo) |
| Nova dependência | `04-implementation/dependency_map.md` |
| Mudança de config/env var | `04-implementation/configuration_guide.md` |
| Novo pattern de código | `04-implementation/implementation_patterns.md` |
| Mudança de infra | `06-deployment/infrastructure.md` |
| Fix de bug | `07-change-management/technical_debt.md` (se era TD catalogado) |
| Nova regra de negócio | `01-business/business-rules.md`, `02-requirements/requirements.md` |

---

## Métrica: Spec Drift Score

```
Spec Drift = (CL entries com Sync ⬜) / (Total CL entries) × 100
```

- **0-10%**: Saudável — spec está em dia
- **10-30%**: Alerta — sync batch recomendado
- **> 30%**: Crítico — spec não é confiável, QA pode reportar falsos positivos

O Governante deve reportar esse score quando o humano perguntar pelo estado do projeto.

---

## O que isso NÃO é

- **Não é um CI/CD hook.** Não roda automaticamente a cada commit. O Governante é quem
  detecta e orquestra — é um processo de governança, não de build.
- **Não é waterfall.** Não exige que toda mudança passe por todas as fases.
  A proporcionalidade é o princípio central.
- **Não é documentação por documentação.** O changelog existe pra manter a spec viva,
  não pra criar burocracia. Se uma mudança não impacta nenhum artefato, não precisa de sync.

---

## Próximos passos

1. [ ] Validar proposta com Ricardo
2. [ ] Implementar no prompt do Governante (v2.4.0)
3. [ ] Adicionar instrução leve nos 5 especialistas
4. [ ] Atualizar SDD template em `sdd-template/`
5. [ ] Publicar no Wolf Pack
6. [ ] Atualizar o `combined/` (mega-prompt unificado)
7. [ ] Testar no projeto runbook-catalog (TASK-002)
