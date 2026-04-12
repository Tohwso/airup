# Workflow: Brownfield (Projeto Existente)

> Use quando: o projeto já tem código mas não tem documentação SDD.

## Pipeline (invertido)

```
🔀 Dev (reverse eng.) → 🏛️ Arq → 📋 Requisitos → 📋 Negócios → 🧪 Qualidade
```

## Passo a Passo

### 1. Instale o AIRUP na sua ferramenta

```bash
# Cursor
./install.sh --cursor --scaffold

# Claude Code  
./install.sh --claude --scaffold

# Qualquer outra
./install.sh --<plataforma> --scaffold
```

### 2. Aponte pro repositório

```
Aplique SDD neste repositório. É um projeto existente — faça engenharia reversa.
```

### 3. O agente executa o pipeline invertido

Ao invés de especificar e depois codificar, ele **extrai especificações do código**:

1. **🔀 Desenvolvedor** — Lê o código, documenta padrões, configurações, dependências
2. **🏛️ Arquiteto** — Infere arquitetura, modelo de domínio, contratos de API
3. **📋 Requisitos** — Infere requisitos funcionais e não-funcionais do comportamento
4. **📋 Negócios** — Infere visão, regras de negócio, processos do que o sistema faz
5. **🧪 Qualidade** — Verifica tudo, cataloga dívida técnica e riscos

### 4. Resultado

Mesma estrutura de 24 artefatos, mas com caveats:

- Artefatos marcados como **"Inferido do código-fonte"**
- Regras de negócio marcadas como **OBSERVADA** vs **INFERIDA**
- Dívida técnica catalogada com prioridade
- Roadmap de evolução sugerido

### 5. Valide com o time

Os artefatos inferidos são um **ponto de partida**. Revise com o time:

```
A regra BR-015 está correta? O sistema realmente espera 48h antes de cancelar?
```

```
O requisito RF-42 diz que aceita bloqueio parcial, mas o código sempre bloqueia 100%. 
Qual é o comportamento correto?
```

### Dica

O brownfield é especialmente útil para:
- **Onboarding** — novo dev entende o sistema em 1 hora
- **Documentação retroativa** — compliance, auditoria
- **Refactoring** — saber o que existe antes de mudar
- **Migração** — mapear sistema legado antes de reescrever
