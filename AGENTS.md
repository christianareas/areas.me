# AI Project Memory

This repository keeps shared AI memory in `.ai/`.

## Memory Files
- `.ai/memory.md`: durable preferences and conventions.
- `.ai/current.md`: current priorities and short-lived focus.
- `.ai/sessions.md`: chronological session notes and decisions.

## Session Startup (Required)
1. Read `.ai/memory.md`.
2. Read `.ai/current.md`.
3. Read the most recent entries in `.ai/sessions.md` (at minimum, the latest section).

## Working Rules
- Follow memory preferences unless the user overrides them in the current session.
- If a new durable preference appears, call it out and ask before writing it to `.ai/memory.md`.
- Keep session notes concise and factual.

## Session Closeout (Required)
- Append a short entry to `.ai/sessions.md` when work includes decisions, code changes, or commits.
- Include: date, request, actions, outcomes, commit IDs (if any), and next step(s).
