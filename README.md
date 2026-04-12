# 👑 AIRUP — RUP AI Kit

[![Version](https://img.shields.io/badge/version-2.1.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Agents](https://img.shields.io/badge/agents-6-purple)]()

**Pipeline de engenharia de software com 6 agentes de IA baseado no RUP + SDD.**

Transforma um repositório (novo ou existente) em um projeto com especificação completa:
visão de negócio, requisitos, arquitetura, padrões de implementação, estratégia de testes
e gestão de mudanças — tudo em português brasileiro.

```
📋 Negócios → 📋 Requisitos → 🏛️ Arquitetura → 🔀 Desenvolvimento → 🧪 Qualidade
```

## ⚡ Quick Start

### Cursor

```bash
git clone https://github.com/ricardocosta/airup.git
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
| 0 | **Governante** | 👑 | Orquestra o pipeline, roteia demandas, circuit breaking | `spec/docs/00-overview/` |
| 1 | **Analista de Negócios** | 📋 | Entende o problema, define regras de negócio | `spec/docs/01-business/` |
| 2 | **Analista de Requisitos** | 📋 | Requisitos funcionais/não-funcionais, casos de uso | `spec/docs/02-requirements/` |
| 3 | **Arquiteto** | 🏛️ | Arquitetura C4, modelo de domínio, API spec | `spec/docs/03-design/` |
| 4 | **Desenvolvedor** | 🔀 | Implementação, padrões de código | `spec/docs/04-implementation/` |
| 5 | **Analista de Qualidade** | 🧪 | Verificação, dívida técnica, riscos | `spec/docs/05-test/` |

## 📁 Estrutura do Pack

```
airup/
├── README.md                          ← Você está aqui
├── pack.json                          ← Metadata do pack
├── install.sh                         ← Instalador universal
│
├── agents/                            ← 6 prompts individuais (multi-agent)
│   ├── governante.md                  ← 👑 25K chars
│   ├── analista-negocios.md           ← 📋
│   ├── analista-requisitos.md         ← 📋
│   ├── arquiteto.md                   ← 🏛️
│   ├── desenvolvedor.md               ← 🔀
│   └── analista-qualidade.md          ← 🧪
│
├── combined/                          ← Mega-prompt unificado (single-agent)
│   ├── AIRUP.md                       ← Prompt combinado (61K chars)
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

## 📝 Licença

MIT — Use, modifique, distribua.
