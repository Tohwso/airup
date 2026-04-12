#!/usr/bin/env bash
# ============================================================================
# AIRUP — RUP AI Kit Installer v2.1.0
# Instala o pack de agentes AIRUP na sua ferramenta de IA.
#
# Uso:
#   ./install.sh --cursor      → Copia .cursorrules pro diretório atual
#   ./install.sh --claude      → Copia CLAUDE.md pro diretório atual
#   ./install.sh --copilot     → Copia .github/copilot-instructions.md
#   ./install.sh --windsurf    → Copia .windsurfrules pro diretório atual
#   ./install.sh --nitro       → Instala agentes no HubAI Nitro (wolf.db)
#   ./install.sh --scaffold    → Cria estrutura spec/docs/ vazia
#   ./install.sh --help        → Mostra esta ajuda
#
# Exemplos:
#   cd meu-projeto && ~/airup/install.sh --cursor --scaffold
#   cd meu-projeto && ~/airup/install.sh --claude
#   ~/airup/install.sh --nitro
# ============================================================================

set -euo pipefail

VERSION="2.1.0"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMBINED_DIR="$SCRIPT_DIR/combined"
AGENTS_DIR="$SCRIPT_DIR/agents"
SDD_TEMPLATE="$SCRIPT_DIR/sdd-template"
TARGET_DIR="${TARGET_DIR:-.}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

print_banner() {
  echo ""
  echo -e "${PURPLE}${BOLD}  ╔══════════════════════════════════════╗${NC}"
  echo -e "${PURPLE}${BOLD}  ║     👑 AIRUP — RUP AI Kit v${VERSION}    ║${NC}"
  echo -e "${PURPLE}${BOLD}  ║   Pipeline de Engenharia com IA      ║${NC}"
  echo -e "${PURPLE}${BOLD}  ╚══════════════════════════════════════╝${NC}"
  echo ""
}

print_help() {
  print_banner
  echo -e "${BOLD}Uso:${NC}"
  echo "  ./install.sh [opções]"
  echo ""
  echo -e "${BOLD}Opções de plataforma:${NC}"
  echo "  --cursor       Instala como .cursorrules no diretório atual"
  echo "  --claude       Instala como CLAUDE.md no diretório atual"
  echo "  --copilot      Instala como .github/copilot-instructions.md"
  echo "  --windsurf     Instala como .windsurfrules no diretório atual"
  echo "  --nitro        Instala os 6 agentes no HubAI Nitro (wolf.db)"
  echo ""
  echo -e "${BOLD}Opções adicionais:${NC}"
  echo "  --scaffold     Cria a estrutura spec/docs/ vazia (SDD template)"
  echo "  --target DIR   Diretório alvo (padrão: diretório atual)"
  echo "  --help, -h     Mostra esta ajuda"
  echo ""
  echo -e "${BOLD}Exemplos:${NC}"
  echo "  cd meu-projeto && path/to/install.sh --cursor --scaffold"
  echo "  cd meu-projeto && path/to/install.sh --claude"
  echo "  path/to/install.sh --nitro"
  echo ""
  echo -e "${BOLD}Pipeline:${NC}"
  echo "  📋 Negócios → 📋 Requisitos → 🏛️ Arquitetura → 🔀 Dev → 🧪 QA"
  echo ""
}

install_cursor() {
  local dest="$TARGET_DIR/.cursorrules"
  if [ -f "$dest" ]; then
    echo -e "${YELLOW}⚠️  .cursorrules já existe. Backup: .cursorrules.bak${NC}"
    cp "$dest" "$dest.bak"
  fi
  cp "$COMBINED_DIR/cursorrules" "$dest"
  echo -e "${GREEN}✅ Instalado: $dest${NC}"
  echo -e "   Abra o Cursor e diga: ${BLUE}\"Aplique SDD no repositório atual\"${NC}"
}

install_claude() {
  local dest="$TARGET_DIR/CLAUDE.md"
  if [ -f "$dest" ]; then
    echo -e "${YELLOW}⚠️  CLAUDE.md já existe. Backup: CLAUDE.md.bak${NC}"
    cp "$dest" "$dest.bak"
  fi
  cp "$COMBINED_DIR/CLAUDE.md" "$dest"
  echo -e "${GREEN}✅ Instalado: $dest${NC}"
  echo -e "   Abra o Claude Code e diga: ${BLUE}\"Aplique SDD no repositório atual\"${NC}"
}

install_copilot() {
  mkdir -p "$TARGET_DIR/.github"
  local dest="$TARGET_DIR/.github/copilot-instructions.md"
  if [ -f "$dest" ]; then
    echo -e "${YELLOW}⚠️  copilot-instructions.md já existe. Backup: copilot-instructions.md.bak${NC}"
    cp "$dest" "$dest.bak"
  fi
  cp "$COMBINED_DIR/copilot-instructions.md" "$dest"
  echo -e "${GREEN}✅ Instalado: $dest${NC}"
  echo -e "   Abra o Copilot Chat e diga: ${BLUE}\"Aplique SDD no repositório atual\"${NC}"
}

install_windsurf() {
  local dest="$TARGET_DIR/.windsurfrules"
  if [ -f "$dest" ]; then
    echo -e "${YELLOW}⚠️  .windsurfrules já existe. Backup: .windsurfrules.bak${NC}"
    cp "$dest" "$dest.bak"
  fi
  cp "$COMBINED_DIR/windsurfrules" "$dest"
  echo -e "${GREEN}✅ Instalado: $dest${NC}"
  echo -e "   Abra o Windsurf e diga: ${BLUE}\"Aplique SDD no repositório atual\"${NC}"
}

install_nitro() {
  local WOLF_DB="$HOME/.wolf/wolf.db"

  if [ ! -f "$WOLF_DB" ]; then
    echo -e "${RED}❌ wolf.db não encontrado em $WOLF_DB${NC}"
    echo -e "   O HubAI Nitro está instalado?"
    exit 1
  fi

  if ! command -v sqlite3 &> /dev/null; then
    echo -e "${RED}❌ sqlite3 não encontrado. Instale com: brew install sqlite${NC}"
    exit 1
  fi

  echo -e "${BLUE}📦 Instalando 6 agentes no Nitro...${NC}"

  # Agent definitions: file|name|emoji|role
  local agents=(
    "governante.md|[RUP] Governante|👑|AI Governor — Pipeline Orchestrator|documentation"
    "analista-negocios.md|[RUP] Analista de Negócios|📋|Business Analyst|documentation"
    "analista-requisitos.md|[RUP] Analista de Requisitos|📋|Requirements Analyst|documentation"
    "arquiteto.md|[RUP] Arquiteto|🏛️|Software Architect|documentation"
    "desenvolvedor.md|[RUP] Desenvolvedor|🔀|Software Developer|documentation"
    "analista-qualidade.md|[RUP] Analista de Qualidade|🧪|Quality Assurance Analyst|documentation"
  )

  for agent_info in "${agents[@]}"; do
    IFS='|' read -r file name emoji role skills <<< "$agent_info"

    # Extract prompt (skip YAML frontmatter)
    local prompt
    prompt=$(python3 -c "
content = open('$AGENTS_DIR/$file').read()
if content.startswith('---'):
    idx = content.index('---', 3)
    print(content[idx+3:].strip())
else:
    print(content)
" 2>/dev/null || sed '1,/^---$/d' "$AGENTS_DIR/$file" | sed '/^---$/,$!d; /^---$/d')

    # Generate UUID
    local uuid
    uuid=$(python3 -c "import uuid; print(str(uuid.uuid4()))" 2>/dev/null || uuidgen | tr '[:upper:]' '[:lower:]')

    # Check if agent already exists (by name)
    local existing
    existing=$(sqlite3 "$WOLF_DB" "SELECT id FROM agents WHERE name = '$name' LIMIT 1;" 2>/dev/null || echo "")

    if [ -n "$existing" ]; then
      # Update existing
      sqlite3 "$WOLF_DB" "UPDATE agents SET
        behavior = '$(echo "$prompt" | sed "s/'/''/g")',
        role = '$role',
        emoji = '$emoji',
        tone = 'equilibrado',
        skill_slugs = '[\"$skills\"]',
        updated_at = datetime('now')
        WHERE id = '$existing';"
      echo -e "  ${GREEN}✅ $emoji $name (atualizado)${NC}"
    else
      # Insert new
      sqlite3 "$WOLF_DB" "INSERT INTO agents (id, name, role, emoji, tone, behavior, skill_slugs, created_at, updated_at)
        VALUES ('$uuid', '$name', '$role', '$emoji', 'equilibrado',
        '$(echo "$prompt" | sed "s/'/''/g")',
        '[\"$skills\"]',
        datetime('now'), datetime('now'));"
      echo -e "  ${GREEN}✅ $emoji $name (instalado)${NC}"
    fi
  done

  echo ""
  echo -e "${GREEN}🎉 Pack AIRUP instalado no Nitro!${NC}"
  echo -e "   Reinicie o Nitro e abra uma sessão com o 👑 Governante."
}

scaffold_sdd() {
  local dest="$TARGET_DIR/spec"

  if [ -d "$dest" ]; then
    echo -e "${YELLOW}⚠️  Diretório spec/ já existe. Pulando scaffold.${NC}"
    return
  fi

  cp -r "$SDD_TEMPLATE/spec" "$dest"
  echo -e "${GREEN}✅ Estrutura SDD criada em $dest/${NC}"
  echo -e "   8 disciplinas, 24 artefatos, pronto pra ser preenchido."
}

# ============================================================================
# MAIN
# ============================================================================

if [ $# -eq 0 ]; then
  print_help
  exit 0
fi

print_banner

DO_SCAFFOLD=false

while [ $# -gt 0 ]; do
  case "$1" in
    --cursor)    install_cursor;    shift ;;
    --claude)    install_claude;    shift ;;
    --copilot)   install_copilot;   shift ;;
    --windsurf)  install_windsurf;  shift ;;
    --nitro)     install_nitro;     shift ;;
    --scaffold)  DO_SCAFFOLD=true;  shift ;;
    --target)    TARGET_DIR="$2";   shift 2 ;;
    --help|-h)   print_help;        exit 0 ;;
    *)
      echo -e "${RED}❌ Opção desconhecida: $1${NC}"
      echo "   Use --help para ver as opções."
      exit 1
      ;;
  esac
done

if $DO_SCAFFOLD; then
  scaffold_sdd
fi

echo ""
echo -e "${BOLD}Próximo passo:${NC} Abra sua ferramenta de IA e diga:"
echo -e "${BLUE}  \"Aplique SDD no repositório atual\"${NC}"
echo ""
