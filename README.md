# 👑 AIRUP — RUP AI Kit

[![Version](https://img.shields.io/badge/version-2.3.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Agents](https://img.shields.io/badge/agents-6-purple)]()

**Pipeline de engenharia de software com 6 agentes de IA baseado no RUP + SDD.**

Transforma um repositório (novo ou existente) em um projeto com especificação completa:
visão de negócio, requisitos, arquitetura, padrões de implementação, estratégia de testes
e gestão de mudanças — tudo em português brasileiro.

```
📋 Negócios → 📋 Requisitos → 🏛️ Arquitetura → 🔀 Desenvolvimento → 🧪 Qualidade
```

## ✨ Novidades v2.3.0

### HITL Supervision — Controle o ritmo do pipeline

Escolha no início como quer supervisionar:

| Modo | Comportamento |
|------|---------------|
| 🟢 **Autônomo** | Pipeline roda end-to-end (padrão) |
| 🟡 **Supervisionado** | Pausa após cada agente para seu GO/NO-GO |
| 🔵 **Gates Estratégicos** | Pausa só após Negócios e Arquitetura |

A cada gate, você pode: ✅ Aprovar · 📝 Pedir ajustes · ⏸️ Pausar · ❌ Abortar

### Experience Pack — 5 melhorias de UX

| Feature | Descrição |
|---------|-----------|
| 📊 **Progress Bar** | Barra visual ASCII mostrando onde o pipeline está |
| ⏱️ **Duração por fase** | Cronometra cada agente, mostra no gate e no summary |
| 🏁 **Pipeline Summary** | Resumo executivo ao final — screenshot-worthy |
| 🎬 **"Previously on..."** | Recap narrativo ao retomar pipeline pausado |
| 💡 **Fun Facts** | Dado curioso sobre produtividade em cada gate |

---

## ⚡ Quick Start

### Cursor

```bash
git clone https://github.com/Tohwso/airup.git
cd meu-projeto
~/airup/install.sh --cursor --scaffold
```

Abra o Cursor e diga: **"Aplique SDD no repositório atual"**

### Claude Code

```bash
~/airup/install.sh --claude --scaffold
```

### GitHub Copilot

```bash
~/airup/install.sh --copilot --scaffold
```

### Windsurf

```bash
~/airup/install.sh --windsurf --scaffold
```

### HubAI Nitro

```bash
~/airup/install.sh --nitro
```

Ou no chat do Wolf: *"Instala os agentes do AIRUP do Wolf Pack"*

---

## 🤖 Os 6 Agentes

| # | Agente | Emoji | O que faz | Produz |
|---|--------|-------|-----------|--------|
| 0 | **Governante** | 👑 | Orquestra o pipeline, roteia demandas, circuit breaking, HITL gates | `spec/docs/00-overview/` |
| 1 | **Analista de Negócios** | 📋 | Entende o problema, define regras de negócio | `spec/docs/01-business/` |
| 2 | **Analista de Requisitos** | 📋 | Requisitos funcionais/não-funcionais, casos de uso | `spec/docs/02-requirements/` |
| 3 | **Arquiteto** | 🏛️ | Arquitetura C4, modelo de domínio, API spec | `spec/docs/03-design/` |
| 4 | **Desenvolvedor** | 🔀 | Implementação, padrões de código | `spec/docs/04-implementation/` |
| 5 | **Analista de Qualidade** | 🧪 | Verificação, dívida técnica, riscos, veredicto GO/NO-GO | `spec/docs/05-test/` |

## 📁 Estrutura do Pack

```
airup/
├── README.md                          ← Você está aqui
├── pack.json                          ← Metadata do pack
├── install.sh                         ← Instalador universal
│
├── agents/                            ← 6 prompts individuais (multi-agent)
│   ├── governante.md                  ← 👑 ~35K chars (v2.3.0)
│   ├── analista-negocios.md           ← 📋 (v2.1.0)
│   ├── analista-requisitos.md         ← 📋 (v2.1.0)
│   ├── arquiteto.md                   ← 🏛️ (v2.1.0)
│   ├── desenvolvedor.md               ← 🔀 (v2.1.0)
│   └── analista-qualidade.md          ← 🧪 (v2.1.0)
│
├── combined/                          ← Mega-prompt unificado (single-agent)
│   ├── AIRUP.md                       ← Prompt combinado (~83K chars)
│   ├── cursorrules                    ← → .cursorrules
│   ├── CLAUDE.md                      ← → CLAUDE.md
│   ├── copilot-instructions.md        ← → .github/copilot-instructions.md
│   └── windsurfrules                  ← → .windsurfrules
│
├── sdd-template/                      ← Scaffold vazio
│   └── spec/docs/{00..07}/            ← 8 disciplinas
│
└── workflows/                         ← Guias passo-a-passo
    ├── greenfield.md                  ← Projeto novo
    ├── brownfield.md                  ← Projeto existente
    └── single-agent.md               ← Sem multi-agent
```

## 🔄 3 Modos de Operação

O agente detecta automaticamente:

### 🌱 Greenfield
Projeto novo, sem código. Cria toda a spec do zero.

### 🏗️ Brownfield
Projeto existente sem documentação. Faz **engenharia reversa** do código.

### 🔄 Evolve
Projeto com spec existente. Evolui incrementalmente.

## 📊 O que é Gerado

24 artefatos em 8 disciplinas:

| Disciplina | Artefatos |
|-----------|-----------|
| Visão Geral | README.md, progression.md |
| Negócios | visão, glossário, stakeholders, regras, processos |
| Requisitos | requisitos (RF/NFR), casos de uso |
| Design | arquitetura (C4), modelo de domínio, API spec, diagramas de sequência |
| Implementação | padrões de código, configuração, dependências |
| Testes | estratégia, cobertura, padrões de teste |
| Deployment | CI/CD, infraestrutura |
| Gestão de Mudanças | dívida técnica, riscos, roadmap |

## 🎛️ Supervisão HITL (v2.3.0)

Ao iniciar o pipeline, o Governante pergunta como supervisionar:

```
Como você quer supervisionar este pipeline?

1. Autônomo — Rodo tudo, perguntas só quando necessário
2. Supervisionado — Pauso após cada agente para review
3. Gates estratégicos — Pauso apenas após Negócios e Arquitetura
```

Em cada gate, você vê:
- 📊 Progress bar visual do pipeline
- ⏱️ Duração da fase que acabou
- 📦 Artefatos produzidos
- 🎯 Decisões-chave
- 💡 Fun fact sobre o que foi produzido

E pode: ✅ Aprovar · 📝 Pedir ajustes · ⏸️ Pausar · ❌ Abortar

### Pipeline Summary

Ao final, recebe um resumo executivo completo:

```
═══════════════════════════════════════════════
  🏁 PIPELINE COMPLETO — meu-projeto
═══════════════════════════════════════════════
  ⏱️  Tempo total:        23m 55s
  📦  Artefatos gerados:  22 arquivos
  🏁  Veredicto QA:       GO ✅
  📈  83 RF · 30 NFR · 9 ADRs · 22 TD
═══════════════════════════════════════════════
```

## 🏗️ Multi-Agent vs Single-Agent

| | Multi-Agent | Single-Agent |
|-|-------------|-------------|
| **Ferramentas** | HubAI Nitro, CrewAI | Cursor, Claude, Copilot, Windsurf, ChatGPT |
| **Formato** | `agents/*.md` (6 arquivos) | `combined/AIRUP.md` (1 arquivo) |
| **Como funciona** | Pipeline real com delegação | LLM simula os 6 papéis sequencialmente |
| **Qualidade** | ✅ Separação real de contexto | ⚠️ Tudo na mesma conversa |
| **Install** | `./install.sh --nitro` | `./install.sh --cursor` |

## 🎓 Origem

AIRUP é uma metodologia proposta na dissertação de mestrado de **Ricardo Costa** —
uma ressurreição do RUP (Rational Unified Process) usando agentes de IA como executores.

O **Governante (👑)** é uma contribuição original: um papel que não existe no RUP clássico,
criado para resolver o problema de coordenação em pipelines multi-agente.

> *"RUP falhou porque humanos não conseguiam sustentar o processo. Agentes de IA sem governança
> vão falhar porque vão sustentar demais. O Governante é o equilíbrio."*

## 📖 Leitura Complementar

- [Blog: Brave New IA World](https://bravenewiaworld.com) — 8 posts sobre a metodologia
- Post #001: The Resurrection of RUP
- Post #003: The AI Governor Pattern
- Post #007: The RUP AI Kit
- Post #008: The Economics of AI-Driven Development

## 📝 Changelog

### v2.3.0 (2026-07-18)
- **Experience Pack**: Progress Bar, Duration Tracking, Pipeline Summary, "Previously on...", Fun Facts
- **HITL Supervision v2**: 3 modos (Autônomo, Supervisionado, Gates Estratégicos)
- Phase Completion Signal estruturado em todos os 5 especialistas

### v2.1.0 (2026-04-17)
- Progression Protocol com handoff entries e debrief
- Construction Phase Protocol com role separation enforcement
- Bootstrap Protocol completo (3 modos)

### v2.0.0 (2026-04-12)
- Publicação inicial no Wolf Pack — 6 agentes

## 📝 Licença

MIT — Use, modifique, distribua.
