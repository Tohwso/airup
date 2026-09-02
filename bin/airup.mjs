#!/usr/bin/env node

// ============================================================================
// AIRUP — RUP AI Kit CLI v2.3.0
// Zero dependencies. Node.js >= 18. ESM.
//
// Usage:
//   npx github:Tohwso/airup --nitro
//   npx github:Tohwso/airup --cursor --scaffold
//   npx github:Tohwso/airup --help
// ============================================================================

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { homedir } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const AGENTS_DIR = join(ROOT, 'agents');
const COMBINED_DIR = join(ROOT, 'combined');
const SDD_TEMPLATE = join(ROOT, 'sdd-template');

const VERSION = '2.4.0';

// ---------------------------------------------------------------------------
// Colors (ANSI — no deps)
// ---------------------------------------------------------------------------
const c = {
  red:    s => `\x1b[31m${s}\x1b[0m`,
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  blue:   s => `\x1b[34m${s}\x1b[0m`,
  purple: s => `\x1b[35m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
};

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------
function banner() {
  console.log('');
  console.log(c.purple(c.bold('  ╔══════════════════════════════════════╗')));
  console.log(c.purple(c.bold(`  ║     👑 AIRUP — RUP AI Kit v${VERSION}    ║`)));
  console.log(c.purple(c.bold('  ║   Pipeline de Engenharia com IA      ║')));
  console.log(c.purple(c.bold('  ╚══════════════════════════════════════╝')));
  console.log('');
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------
function help() {
  banner();
  console.log(c.bold('Uso:'));
  console.log('  npx github:Tohwso/airup [opções]');
  console.log('');
  console.log(c.bold('Opções de plataforma:'));
  console.log('  --cursor       Instala como .cursorrules no diretório atual');
  console.log('  --claude       Instala como CLAUDE.md no diretório atual');
  console.log('  --copilot      Instala como .github/copilot-instructions.md');
  console.log('  --windsurf     Instala como .windsurfrules no diretório atual');
  console.log('  --nitro        Instala os 6 agentes no HubAI Nitro (wolf.db)');
  console.log('');
  console.log(c.bold('Opções adicionais:'));
  console.log('  --scaffold     Cria a estrutura spec/docs/ vazia (SDD template)');
  console.log('  --target DIR   Diretório alvo (padrão: diretório atual)');
  console.log('  --help, -h     Mostra esta ajuda');
  console.log('');
  console.log(c.bold('Exemplos:'));
  console.log('  cd meu-projeto && npx github:Tohwso/airup --cursor --scaffold');
  console.log('  cd meu-projeto && npx github:Tohwso/airup --claude');
  console.log('  npx github:Tohwso/airup --nitro');
  console.log('');
  console.log(c.bold('Pipeline:'));
  console.log('  📋 Negócios → 📋 Requisitos → 🏛️ Arquitetura → 🔀 Dev → 🧪 QA');
  console.log('');
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Copy a file with optional backup */
function safeCopy(src, dest, label) {
  if (existsSync(dest)) {
    const bak = dest + '.bak';
    copyFileSync(dest, bak);
    console.log(c.yellow(`⚠️  ${label} já existe. Backup: ${bak}`));
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(c.green(`✅ Instalado: ${dest}`));
}

/** Recursively copy a directory */
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/** Extract prompt from agent .md file (skip YAML frontmatter) */
function extractPrompt(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      return content.slice(endIdx + 3).trim();
    }
  }
  return content.trim();
}

/** Escape single quotes for SQLite */
function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

// ---------------------------------------------------------------------------
// Installers
// ---------------------------------------------------------------------------

function installCursor(targetDir) {
  const dest = join(targetDir, '.cursorrules');
  safeCopy(join(COMBINED_DIR, 'cursorrules'), dest, '.cursorrules');
  console.log(`   Abra o Cursor e diga: ${c.blue('"Aplique SDD no repositório atual"')}`);
}

function installClaude(targetDir) {
  const dest = join(targetDir, 'CLAUDE.md');
  safeCopy(join(COMBINED_DIR, 'CLAUDE.md'), dest, 'CLAUDE.md');
  console.log(`   Abra o Claude Code e diga: ${c.blue('"Aplique SDD no repositório atual"')}`);
}

function installCopilot(targetDir) {
  const dest = join(targetDir, '.github', 'copilot-instructions.md');
  safeCopy(join(COMBINED_DIR, 'copilot-instructions.md'), dest, 'copilot-instructions.md');
  console.log(`   Abra o Copilot Chat e diga: ${c.blue('"Aplique SDD no repositório atual"')}`);
}

function installWindsurf(targetDir) {
  const dest = join(targetDir, '.windsurfrules');
  safeCopy(join(COMBINED_DIR, 'windsurfrules'), dest, '.windsurfrules');
  console.log(`   Abra o Windsurf e diga: ${c.blue('"Aplique SDD no repositório atual"')}`);
}

function installNitro() {
  const wolfDb = join(homedir(), '.wolf', 'wolf.db');

  if (!existsSync(wolfDb)) {
    console.log(c.red(`❌ wolf.db não encontrado em ${wolfDb}`));
    console.log('   O HubAI Nitro está instalado?');
    process.exit(1);
  }

  // Check sqlite3 availability
  try {
    execSync('which sqlite3', { stdio: 'ignore' });
  } catch {
    console.log(c.red('❌ sqlite3 não encontrado. Instale com: brew install sqlite'));
    process.exit(1);
  }

  console.log(c.blue('📦 Instalando 6 agentes no Nitro...'));

  const agents = [
    { file: 'governante.md',          name: '[RUP] Governante',              emoji: '👑', role: 'AI Governor — Pipeline Orchestrator' },
    { file: 'analista-negocios.md',   name: '[RUP] Analista de Negócios',    emoji: '📋', role: 'Business Analyst' },
    { file: 'analista-requisitos.md', name: '[RUP] Analista de Requisitos',  emoji: '📋', role: 'Requirements Analyst' },
    { file: 'arquiteto.md',           name: '[RUP] Arquiteto',               emoji: '🏛️', role: 'Software Architect' },
    { file: 'desenvolvedor.md',       name: '[RUP] Desenvolvedor',           emoji: '🔀', role: 'Software Developer' },
    { file: 'analista-qualidade.md',  name: '[RUP] Analista de Qualidade',   emoji: '🧪', role: 'Quality Assurance Analyst' },
  ];

  for (const agent of agents) {
    const prompt = extractPrompt(join(AGENTS_DIR, agent.file));
    const escapedPrompt = sqlEscape(prompt);
    const escapedName = sqlEscape(agent.name);
    const skills = '["documentation"]';

    // Check if agent exists
    let existing = '';
    try {
      existing = execSync(
        `sqlite3 "${wolfDb}" "SELECT id FROM agents WHERE name = '${escapedName}' LIMIT 1;"`,
        { encoding: 'utf-8' }
      ).trim();
    } catch {
      existing = '';
    }

    // Always use temp file — prompts are too large for shell args
    const tmpFile = join(homedir(), '.wolf', '.airup-install.sql');

    if (existing) {
      const sql = `UPDATE agents SET
        behavior = '${escapedPrompt}',
        role = '${agent.role}',
        emoji = '${agent.emoji}',
        tone = 'equilibrado',
        skill_slugs = '${skills}',
        updated_at = datetime('now')
        WHERE id = '${existing}';`;
      writeFileSync(tmpFile, sql);
      execSync(`sqlite3 "${wolfDb}" < "${tmpFile}"`);
      console.log(c.green(`  ✅ ${agent.emoji} ${agent.name} (atualizado)`));
    } else {
      const uuid = randomUUID();
      const sql = `INSERT INTO agents (id, name, role, emoji, tone, behavior, skill_slugs, created_at, updated_at)
        VALUES ('${uuid}', '${escapedName}', '${agent.role}', '${agent.emoji}', 'equilibrado',
        '${escapedPrompt}', '${skills}', datetime('now'), datetime('now'));`;
      writeFileSync(tmpFile, sql);
      execSync(`sqlite3 "${wolfDb}" < "${tmpFile}"`);
      console.log(c.green(`  ✅ ${agent.emoji} ${agent.name} (instalado)`));
    }

    // Cleanup
    try { execSync(`rm -f "${tmpFile}"`, { stdio: 'ignore' }); } catch { /* ignore */ }
  }

  console.log('');
  console.log(c.green('🎉 Pack AIRUP instalado no Nitro!'));
  console.log('   Reinicie o Nitro e abra uma sessão com o 👑 Governante.');
}

function scaffoldSdd(targetDir) {
  const dest = join(targetDir, 'spec');

  if (existsSync(dest)) {
    console.log(c.yellow('⚠️  Diretório spec/ já existe. Pulando scaffold.'));
    return;
  }

  copyDir(join(SDD_TEMPLATE, 'spec'), dest);
  console.log(c.green(`✅ Estrutura SDD criada em ${dest}/`));
  console.log('   8 disciplinas, 24 artefatos, pronto pra ser preenchido.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  help();
  process.exit(0);
}

banner();

let targetDir = process.cwd();
let doScaffold = false;

// Parse --target
const targetIdx = args.indexOf('--target');
if (targetIdx !== -1 && args[targetIdx + 1]) {
  targetDir = resolve(args[targetIdx + 1]);
}

// Execute
for (const arg of args) {
  switch (arg) {
    case '--cursor':   installCursor(targetDir);   break;
    case '--claude':   installClaude(targetDir);    break;
    case '--copilot':  installCopilot(targetDir);   break;
    case '--windsurf': installWindsurf(targetDir);  break;
    case '--nitro':    installNitro();              break;
    case '--scaffold': doScaffold = true;           break;
    case '--target':   break; // handled above
    default:
      if (arg !== args[targetIdx + 1]) { // skip target value
        console.log(c.red(`❌ Opção desconhecida: ${arg}`));
        console.log('   Use --help para ver as opções.');
        process.exit(1);
      }
  }
}

if (doScaffold) {
  scaffoldSdd(targetDir);
}

console.log('');
console.log(c.bold('Próximo passo:') + ' Abra sua ferramenta de IA e diga:');
console.log(c.blue('  "Aplique SDD no repositório atual"'));
console.log('');
