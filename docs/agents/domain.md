# Domain Docs

## Layout

**Single-context**: One global `CONTEXT.md` + `docs/adr/` at repo root.

## Files

| File             | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `CONTEXT.md`     | Domain language, key terms, patterns used in this codebase |
| `docs/adr/`      | Architectural Decision Records (past decisions)            |
| `CONTEXT-MAP.md` | (optional) Points to per-context docs for monorepos        |

## Rules for consuming domain docs

### When reading `CONTEXT.md`

- Start with the **vocabulary** section to learn key terms
- Read the **patterns** section to understand common patterns
- Use the **domain-specific questions** checklist when working on new features
- Refer to **ADR history** in `docs/adr/` for decision context

### When reading ADRs

- Each ADR is self-contained with `context`, `decision`, and `consequences`
- Read the **status** to know if it's proposed, accepted, or deprecated
- Use `docs/adr/ADR-00*.md` numbering for versioning

### When reading `CONTEXT-MAP.md` (if it exists)

- Use the map to find the right `CONTEXT.md` for a specific sub-project
- Each mapped context should have its own `docs/adr/` subdirectory

## Creating ADRs

1. Copy `docs/adr/ADR-TEMPLATE.md`
2. Update the number in sequence
3. Fill in `context`, `considered alternatives`, `decision`, `consequences`
4. Set `status: accepted` when ready
5. Link to the ADR in PR descriptions when relevant
