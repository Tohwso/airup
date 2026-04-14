# AGENTS.md — <project-name>

> Instruções para qualquer agente de IA que opere neste repositório.
> Gerado automaticamente pelo AIRUP Kit (Governante).

## Spec Sync Rule

Este projeto usa **SDD** (Specification-Driven Development).
A especificação vive em `spec/docs/` e deve estar sincronizada com o código.

Após **qualquer mudança de código**, adicione uma entrada no final de `spec/docs/00-overview/changelog.md`:

```markdown
### [YYYY-MM-DD] CL-NNN: <o que mudou>
**Type:** Feature | Fix | Refactor
**Impacted artifacts:** <artefatos afetados — veja tabela abaixo>
**Sync:** ⬜ Pending
**Task:** N/A
```

Isso leva 10 segundos e previne que a spec fique desatualizada.
Se não tiver certeza de quais artefatos são impactados, liste os que parecerem relacionados.
O Governante resolverá durante o próximo sync.

## Mapeamento de Arquivos → Artefatos

| Arquivo alterado | Artefato impactado |
|---|---|
| `src/**/api/**` | `03-design/api_spec.md`, `02-requirements/requirements.md` |
| `src/**/models/**` | `03-design/domain_model.md` |
| `src/**/services/**` | `04-implementation/implementation_patterns.md` |
| `src/**/schemas/**` | `03-design/api_spec.md` |
| `src/**/middleware/**` | `03-design/architecture.md` |
| `src/**/config.*` | `04-implementation/configuration_guide.md` |
| `frontend/**/*.js` | `02-requirements/requirements.md` |
| `frontend/**/*.html` | `02-requirements/requirements.md` |
| `frontend/**/*.css` | `04-implementation/coding_standards.md` |
| `**/pyproject.toml`, `**/package.json` | `04-implementation/dependency_map.md` |
| `Dockerfile`, `docker-compose*`, `.github/**` | `06-deployment/ci_cd_pipeline.md` |
| `helm/**`, `k8s/**`, `infra/**` | `06-deployment/infrastructure.md` |
| `alembic/**`, `migrations/**` | `03-design/domain_model.md` |

## Regras Gerais

- **Nunca altere** arquivos em `spec/docs/` sem registrar no changelog
- **Nunca delete** entradas do changelog — é append-only
- O ID sequencial (CL-NNN) deve continuar a partir do último existente
- Se estiver criando um novo endpoint, model ou serviço, crie também uma task em `spec/tasks/`
