# Workflow: Single-Agent (Sem Multi-Agent)

> Use quando: sua ferramenta não suporta múltiplos agentes (Cursor, Claude Code, Copilot, ChatGPT).

## Como funciona

O mega-prompt `AIRUP.md` contém as instruções dos 6 agentes em um único arquivo.
O LLM assume cada papel sequencialmente dentro da mesma conversa.

## Limitações vs Multi-Agent

| Aspecto | Multi-Agent (Nitro) | Single-Agent |
|---------|-------------------|--------------|
| Separação de contexto | ✅ Cada agente tem sua sessão | ⚠️ Tudo na mesma conversa |
| Tamanho do projeto | ✅ Sem limite prático | ⚠️ Limitado pela janela de contexto |
| Circuit breaking | ✅ Governante intervém | ⚠️ Depende do usuário |
| Qualidade | ✅ QA independente | ⚠️ QA "sabe" o que o Dev fez |
| Progressão | ✅ progression.md persistido | ⚠️ Contexto pode se perder |

## Dicas para Single-Agent

### 1. Faça uma fase por vez

Em vez de pedir "aplique SDD completo", peça fase por fase:

```
Fase 1: Assuma o papel de Analista de Negócios e produza os artefatos 
de spec/docs/01-business/ para este projeto.
```

Depois:

```
Fase 2: Agora assuma o papel de Analista de Requisitos. Leia os artefatos
em spec/docs/01-business/ e produza spec/docs/02-requirements/.
```

### 2. Salve os artefatos entre fases

Após cada fase, salve os arquivos no disco. Na próxima conversa (se o contexto estourar), 
o agente pode ler os arquivos do disco.

### 3. Use o scaffold

```bash
./install.sh --cursor --scaffold
```

Isso cria a estrutura `spec/docs/` vazia. O agente preenche cada diretório.

### 4. Projetos grandes: quebre em partes

Para projetos com muitos arquivos, guie o agente:

```
Foque nos seguintes pacotes para a engenharia reversa:
- src/main/java/com/picpay/block/domain/
- src/main/java/com/picpay/block/application/
```

### 5. Use um agente por vez

Se sua ferramenta suporta "personas" ou "custom agents" (como o Cursor com @agent),
crie 6 personas separadas usando os arquivos em `agents/`:

- `agents/governante.md` → Persona "AIRUP Gov"
- `agents/analista-negocios.md` → Persona "AIRUP Business"
- etc.

Isso dá uma separação melhor de contexto, mesmo sem multi-agent real.
