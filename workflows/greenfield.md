# Workflow: Greenfield (Projeto Novo)

> Use quando: o projeto não tem código ainda, ou está começando do zero.

## Pipeline

```
📋 Negócios → 📋 Requisitos → 🏛️ Arquitetura → 🔀 Desenvolvimento → 🧪 Qualidade
```

## Passo a Passo

### 1. Instale o AIRUP na sua ferramenta

```bash
# Cursor
./install.sh --cursor --scaffold

# Claude Code
./install.sh --claude --scaffold

# GitHub Copilot
./install.sh --copilot --scaffold
```

### 2. Descreva o problema

Abra o chat e descreva o que o sistema precisa fazer. Exemplo:

```
Aplique SDD neste repositório.

Contexto: Precisamos de um serviço que processe bloqueios judiciais
recebidos do BacenJud, aplicando as ordens nas carteiras dos clientes
e respondendo ao Banco Central com o resultado.
```

### 3. O agente executa o pipeline

Ele vai sequencialmente:

1. **📋 Negócios** — Criar visão, glossário, stakeholders, regras de negócio, processos
2. **📋 Requisitos** — Transformar em RF-XX, NFR-XX, casos de uso
3. **🏛️ Arquitetura** — Projetar arquitetura, modelo de domínio, API spec
4. **🔀 Desenvolvimento** — Documentar padrões de implementação
5. **🧪 Qualidade** — Verificar tudo e catalogar riscos/dívida técnica

### 4. Resultado

Ao final, você terá em `spec/docs/`:

```
spec/docs/
├── 00-overview/README.md          ← Índice com status
├── 01-business/                   ← 5 artefatos
├── 02-requirements/               ← 2 artefatos
├── 03-design/                     ← 4 artefatos
├── 04-implementation/             ← 4 artefatos
├── 05-test/                       ← 3 artefatos
├── 06-deployment/                 ← 2 artefatos
└── 07-change-management/          ← 3 artefatos
```

### 5. Itere

Peça ajustes específicos:

```
Adicione o requisito de rate limiting no endpoint de bloqueio
```

```
Revise a regra de negócio BR-015 — o prazo é 48h, não 24h
```

O agente atualiza o artefato correto e propaga as mudanças para os artefatos dependentes.
