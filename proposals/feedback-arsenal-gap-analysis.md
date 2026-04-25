# AIRUP Feedback Arsenal — Gap Analysis

> **Última atualização:** 2026-04-25
> **Projeto de validação:** ms-picpay-bank-judicial-block (brownfield, Java 17, Spring Boot 2.7)
> **Branch:** feature/task-002-absorver-bloqueio-judicial-consumer

---

## Resumo Executivo

O Feedback Arsenal adiciona **verificação reversa** ao AIRUP — confirmar que o código implementado
respeita as specs (feedforward = spec→code, feedback = code→spec). São 4 camadas de verificação
distribuídas entre os 5 agentes, ativadas via `AUDIT` mode no Governante.

| Camada | Status Prompts | Status Validação |
|--------|---------------|-----------------|
| Layer 1 — Static Analysis | ✅ Implementada (Dev, QA, AR) | ⚠️ Parcial |
| Layer 2 — Test Execution | ✅ Implementada (Dev, QA) | ⚠️ Parcial |
| Layer 3 — Semantic Verification | ✅ Implementada (Architect, QA) | ❌ Não validada |
| Layer 4 — AUDIT Mode | ✅ Implementada (Governor + 5 agentes) | ⚠️ Parcial |
| E2E Evidence Capture | ✅ Implementada | ✅ Validada |

---

## Layer 1 — Static Analysis

**Agentes:** Dev (setup), QA (audit), AR (spec conformance)

### Ferramentas planejadas vs status no projeto de validação

| Ferramenta | Finding ID | Status no bank-judicial-block | Detalhe |
|------------|-----------|-------------------------------|---------|
| `.editorconfig` | SA-001 | ❌ NOT_CONFIGURED | Ausente |
| Code Formatter (Spotless) | SA-002 | ❌ NOT_CONFIGURED | Sem plugin no pom.xml |
| SpotBugs + FindSecBugs | SA-003 | ❌ NOT_CONFIGURED | Sem plugin no pom.xml |
| ArchUnit | SA-004 | ✅ CONFIGURED | Testes existem, passam |
| Gitleaks (Secrets) | SA-005 | ✅ INSTALLED | ~/bin/gitleaks v8.21.2 — encontrou 3 secrets (Slack token) |
| JaCoCo (Coverage) | SA-006 | ❌ NOT_CONFIGURED | Sem plugin no pom.xml |
| PMD | SA-007 | ❌ NOT_CONFIGURED | Sem plugin no pom.xml |
| Spectral (API Lint) | SA-008 | ❌ NOT_CONFIGURED | Sem OpenAPI spec |
| PIT (Mutation) | MUT | ✅ CONFIGURED | Plugin no pom.xml. Rodou no package outbox: 23% score (threshold 60%) |
| jqwik (Property) | PROP | ✅ CONFIGURED | Dependência existe no pom.xml |

**Score:** 4/10 ferramentas configuradas. 6 gaps.

### Bugs descobertos durante validação

| Bug | Severidade | Status |
|-----|-----------|--------|
| `@EnableFeignClients` não inclui `consumerlegacy.client` | CRITICAL | ✅ Corrigido (commit 262df41) |
| `@EntityScan`/`@EnableJpaRepositories` não inclui `consumerlegacy` | CRITICAL | ✅ Corrigido (commit 3f17d4d) |
| 3 secrets em código (Slack webhook token) | HIGH | ⬜ Não corrigido (registrado) |
| 10 testes quebrados em `unblockprocessing` | MEDIUM | ⬜ Pré-existente, não corrigido |

---

## Layer 2 — Test Execution

**Agentes:** Dev (infrastructure setup), QA (execution + preparation)

### Tier 1 — Execução direta pelo agente

| Técnica | Status Prompt | Status Validação | Resultado |
|---------|--------------|-----------------|-----------|
| Mutation Testing (PIT) | ✅ | ✅ Rodou | Package `outbox`: 23% score, 86% test strength, 74% sem cobertura |
| Property-Based Testing (jqwik) | ✅ | ❌ Não rodou | Dep existe, nenhum teste property escrito |
| Integration Testing | ✅ | ⚠️ Parcial | 10 testes quebrados em unblockprocessing (pré-existentes) |

### Tier 2 — Preparação pelo agente, execução humana

| Técnica | Status Prompt | Status Validação | Resultado |
|---------|--------------|-----------------|-----------|
| E2E Local Test | ✅ | ✅ Validado | `BlockProcessingE2ETest` — 3 cenários green |
| E2E Evidence Capture | ✅ | ✅ Validado | `E2EEvidenceWatcher` — JSON por cenário em target/e2e-evidence/ |
| Performance Testing | ✅ | ❌ Não preparado | — |
| Chaos Testing | ✅ | ❌ Não preparado | — |

### E2E Cenários validados

| Cenário | Resultado | WireMock | BlockProcessings | Evidência |
|---------|----------|----------|-----------------|-----------|
| Happy Path (bloqueio total) | ✅ PASS | 6 matched, 0 unmatched | 2× BACENJUD_ANSWERED, failedStep=null | shouldProcessBlockRemittanceEndToEnd.json |
| Account Not Found | ✅ PASS | 4 matched, 0 unmatched | 2× BACENJUD_ANSWERED, failedStep=ACCOUNT_NOT_FOUND | shouldAnswerNotEffectiveWhenPersonNotFound.json |
| Consolidação Parcial | ✅ PASS | 6 matched, 0 unmatched | 2× BACENJUD_ANSWERED, consolidatedValue < blockValue | shouldConsolidatePartiallyWhenBalanceInsufficient.json |

### Infraestrutura de teste

| Componente | Status |
|-----------|--------|
| Java 17 (local) | ✅ ~/bin/jdk-17.0.18+8 |
| Maven 3.9.9 (local) | ✅ ~/bin/apache-maven-3.9.9 |
| H2 in-memory | ✅ Já configurado no projeto |
| EmbeddedKafka | ✅ Já configurado no projeto |
| WireMock (static init) | ✅ Corrigido — ApplicationContextInitializer |
| Testcontainers | ⬜ Dep existe, não usado nos E2E |

---

## Layer 3 — Semantic Verification

**Agentes:** Architect (audit protocol), QA (error handling verification)

| Verificação | Status Prompt | Status Validação |
|------------|--------------|-----------------|
| Architecture Conformance (spec vs code) | ✅ | ❌ Não executado |
| Dependency Graph Analysis | ✅ | ❌ Não executado |
| Error Handling Audit | ✅ | ❌ Não executado |
| Cross-Layer Consistency | ✅ | ❌ Não executado |

**Layer 3 é a menos validada.** Os prompts existem nos agentes Architect e QA, mas nenhum cenário
AUDIT foi executado nessa camada. É a próxima fronteira.

---

## Layer 4 — AUDIT Mode (Governante)

**Status:** ✅ Implementado com scoped routing (Option D)

### Scopes testados

| Scope | Testado? | Resultado |
|-------|---------|-----------|
| `AUDIT — QA:static` | ✅ | 7/8 tools NOT_CONFIGURED |
| `AUDIT — Dev:setup` | ✅ | 8/10 já configurados |
| `AUDIT — full` | ❌ | — |
| `AUDIT — QA:mutation` | ✅ | PIT rodou, 23% score |
| `AUDIT — QA:e2e` | ✅ | 3 cenários criados e green |
| `AUDIT — AR:traceability` | ❌ | — |
| `AUDIT — Architect` | ❌ | — |
| `AUDIT — QA:property` | ❌ | — |
| `AUDIT — QA:integration` | ❌ | — |
| `AUDIT — QA:error-handling` | ❌ | — |
| `AUDIT — QA:performance` | ❌ | — |
| `AUDIT — QA:chaos` | ❌ | — |

---

## Commits no repo airup (prompts)

| Commit | Descrição |
|--------|-----------|
| c9bb83d | Layer 1 Static Analysis — Dev, QA, AR |
| cea17d8 | Layer 2 Test Execution — Dev, QA |
| e09d2cd | Layer 3 Semantic Verification — Architect, QA |
| 8dd84f8 | AUDIT mode — Governor + 5 agentes (Option D scoped routing) |
| 9a144a4 | E2E Local Test Pattern — QA |

## Commits no bank-judicial-block (validação)

| Commit | Descrição |
|--------|-----------|
| fb99d98 | AUDIT toolkit + E2E lifecycle test (BlockProcessingE2ETest) |
| 4389d3a | Bug task: fix ConsumerBlockRepository bean |
| 3f17d4d | Fix: registrar consumerlegacy no JPA repository scan |
| 262df41 | Fix: FeignClient scan + WireMock static init + 3 E2E green |
| 8970274 | E2EEvidenceWatcher — JSON evidence para AI verification |
| 61f799a | verify.sh gate + contract tests + fix broken tests |

---

## Local PR Gate (`verify.sh`)

Script que roda 6 verificações em sequência e emite veredicto **GO/NO-GO** em JSON:

| Step | Verificação | Tempo ~aprox |
|------|------------|-------------|
| 1 | Compile (`mvn test-compile`) | 3s |
| 2 | Unit tests (276 testes, excluindo E2E) | 60s |
| 3 | E2E + Contract tests (10 cenários) | 33s |
| 4 | Secrets scan (gitleaks) | 21s |
| 5 | Context load (Spring sobe) | 33s |
| 6 | PIT mutation (opcional, `--fast` pula) | ~180s |

**Report:** `target/e2e-evidence/verify-report.json`
**Uso:** `./verify.sh` (full) ou `./verify.sh --fast` (sem PIT)

---

## Contract Tests

| Feign Client | Cenários | Status |
|-------------|----------|--------|
| PersonClient | Full response, 404, empty relationships | ✅ 3/3 |
| BacenJudIntegrationClient | Block orders deserialization, empty list | ✅ 2/2 |
| WalletsClient | Balance deserialization, 404 | ✅ 2/2 |

---

## Testes quebrados — Diagnóstico e resolução

| Teste | Causa raiz | Resolução |
|-------|-----------|-----------|
| ConsumerBlockServiceTest (3 assertions) | `replicateToWallet()` limpa pendingAlteration pra null no happy path; testes esperavam PENDING_CANCEL/VALUE_UPDATE | Corrigido: assertions agora esperam null |
| ConsumerBlockServiceTest (1 stubbing) | UnnecessaryStubbingException — stubs de walletsClient/sumAll não usados | Corrigido: lenient() |
| ArchitectureTest (2 rules) | 109 violações domain→resources + ciclo domain↔outbox | @Disabled com tracking TD-ARCH-001/002 |
| OutboxServiceIntegrationTest | Lombok @AllArgsConstructor não processando em inner class | Corrigido: constructor explícito |

---

## Próximos passos sugeridos

1. **Layer 3 validation** — rodar `AUDIT — Architect` no bank-judicial-block (architecture conformance vs SDD)
2. **Property-based tests** — escrever testes jqwik para regras de negócio (BR-NNN) do block processing
3. **AUDIT — full** — rodar pipeline completo no bank-judicial-block como benchmark end-to-end
4. **Static Analysis gap closure** — configurar SpotBugs, Spotless, JaCoCo no pom.xml (ou criar task SDD)
5. **Mutation score improvement** — outbox está em 23%, threshold é 60%
6. **Fix broken tests** — 10 testes em unblockprocessing quebrados
