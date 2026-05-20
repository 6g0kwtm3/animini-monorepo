# Issue Tracker (GitHub)

## Where issues live

- **GitHub Issues**: https://github.com/6g0kwtm3/animini-monorepo/issues
- **CLI**: `gh` (GitHub CLI)

## Skills that use this

- `to-issues` — converts conversation to a GitHub issue
- `triage` — processes incoming issues with labels
- `to-prd` — turns conversation context into a PRD issue
- `qa` — quality assurance checks against open issues
- `review` — reviews pull requests

## Typical workflow

1. **Create**: `gh issue create --title "..." --body "$(cat <<'EOF'...EOF)"`
2. **Search**: `gh issue search "is:open label:feature"`
3. **Comment**: `gh issue comment <number> --body "..."`
4. **Close**: `gh issue close <number> --reason "completed"`

## Labels used

See `triage-labels.md` for the five canonical triage labels.

## Notes

- Issues are created under the `6g0kwtm3/animini-monorepo` repo
- Use `gh auth status` to verify you're authenticated
- For sensitive discussions, use sub-issues (`gh issue create <number> --subid ...`)
