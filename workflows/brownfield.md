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

Ao invés de especificar e depois codificar, ele **reconstrói a especificação em camadas**. O código é evidência para as fases técnicas; não deve ser copiado indiscriminadamente para os requisitos:

1. **🔀 Desenvolvedor** — Lê o código, documenta padrões, configurações, dependências
2. **🏛️ Arquiteto** — Infere arquitetura, modelo de domínio, contratos de API
3. **📋 Requisitos** — Consulta os artefatos técnicos anteriores como evidência privada, abstrai somente o comportamento observável em requisitos agnósticos de tecnologia e sempre gera o diagrama de casos de uso
4. **📋 Negócios** — Infere visão, regras de negócio, processos do que o sistema faz
5. **🧪 Qualidade** — Verifica tudo, cataloga dívida técnica e riscos

#### Fronteira obrigatória da fase de Requisitos

Os artefatos `spec/docs/02-requirements/requirements.md` e `spec/docs/02-requirements/use_cases.md` devem expressar apenas **o que** o sistema faz, **por que** isso é necessário, seus atores, condições, resultados e atributos de qualidade. Não podem mencionar código, classes, métodos, endpoints, APIs, banco de dados, tabelas, filas, tópicos, frameworks, bibliotecas, linguagens, infraestrutura ou decisões de arquitetura.

Se uma observação técnica não puder ser traduzida para uma capacidade ou resultado observável por um stakeholder, ela permanece nos artefatos técnicos anteriores ou é encaminhada ao Governante como evidência, dúvida ou divergência para validação de negócio. O arquivo `use_cases.md` também deve conter o desenho de casos de uso, mostrando atores, limite do sistema e ações disponíveis; Mermaid é o formato preferencial, mas qualquer formato textual já suportado pelo projeto é aceito. Em modo AUDIT, referências técnicas continuam permitidas nos achados de conformidade, mas não devem ser incorporadas aos artefatos de requisitos.

### 4. Resultado

Mesma estrutura de 24 artefatos, mas com caveats:

- Artefatos técnicos marcados como **"Inferido do código-fonte"**
- Requisitos e negócios marcados como **"Inferido do comportamento observado"**, com validação de intenção pendente
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
