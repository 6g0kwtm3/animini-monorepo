# Triage Labels

## The five canonical roles

| Label | Meaning | When applied |
|-------|---------|--------------|
| `needs-triage` | Maintainer needs to evaluate | Newly created issue |
| `needs-info` | Waiting on reporter for details | Issue creator or maintainer adds more info |
| `ready-for-agent` | Fully specified, AFK-ready | Issue has enough detail for an agent to work on |
| `ready-for-human` | Needs human implementation | Human will pick this up |
| `wontfix` | Will not be actioned | Duplicate, won't implement, etc. |

## State machine

```
       +---> needs-info <---+
       |                    |
needs-triage <--- (new issue)
       |                    |
       v                    v
ready-for-agent <--- ready-for-human
       |                    |
       v                    v
    (resolved)           wontfix
```

## How skills use these

- `triage` skill applies labels based on issue content
- Issues without a triage label stay in `needs-triage`
- `to-issues` skips the triage step and goes straight to `needs-triage`
- Once labeled `ready-for-*`, an AFK agent can pick it up

## Adding a label

```bash
gh issue edit <number> --add-label "needs-triage"
```
