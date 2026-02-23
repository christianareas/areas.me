# Durable Memory

Last updated: 2026-02-22

## User Preferences
- Keep responses concise, direct, and practical.
- Stay focused on the task at hand and avoid tangential suggestions unless requested.
- When asked for review, prioritize findings and call out exact file/line locations.
- If the user asks not to edit files, provide only the required change instructions.
- Commit messages should be simple, sentence case, past tense, and end with a period.
- In comments, prefer contractions and typographic right single quotes (`’`) over straight apostrophes (`'`).

## Codebase Conventions
- Section comment separators in `src/` use:
  - `// --------------------------------------------------------------------------------`
- API and DB work tends to favor explicit, readable naming over short aliases.
- For nested resources, prefer collection POST routes:
  - `/api/resume/[candidateId]/experience/[roleId]/accomplishments`
  - `/api/resume/[candidateId]/skillSets/[skillSetId]/skills`

## Commit Style (Observed)
- Typical format: single-sentence summary with a period.
- Common verbs: `Updated`, `Added`, `Refactored`, `Moved`, `Renamed`, `Deleted`, `Consolidated`.

## Memory Portability
- Treat `.ai/*` as the source of truth for cross-machine memory.
- Local Codex session logs under `~/.codex/sessions` are machine-local and should not be relied on as portable memory.
- Promote durable session outcomes into `.ai/memory.md` and `.ai/sessions.md`.
