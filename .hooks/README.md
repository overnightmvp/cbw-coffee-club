# Git Hooks for Documentation Reminders

## Installation

Copy the post-commit hook to your local git hooks directory:

```bash
cp .hooks/post-commit .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

## What It Does

After every commit, the hook will:

1. **Check for feature commits** (`feat`, `fix`, `refactor`) and remind you to update documentation
2. **Detect epic references** (E1, E2, E3, etc.) and suggest updating backlog.md with progress
3. **Verify dates** when docs are updated to ensure "Last Updated" fields are current

## Example Output

After committing a feature:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 DOCUMENTATION REMINDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  You just committed a feature/fix/refactor.
  Consider updating these docs if relevant:

  📄 README.md            - If setup/deployment changed
  📋 docs/backlog.md      - If epic/story status changed
  🛠️  docs/skills.md       - If workflow/patterns changed
  📊 docs/audit-and-backlog.md - If phase completed
  🎨 /design-system page  - If UI components added

  Quick doc update command:
  → vim docs/backlog.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Bypassing the Hook

If you need to skip the hook (not recommended):

```bash
git commit --no-verify -m "message"
```

## Customization

Edit `.hooks/post-commit` to:
- Add more documentation files to check
- Change the trigger keywords
- Customize the reminder messages
- Add automatic doc updates (advanced)

## Notes

- The hook runs **after** the commit completes
- It only provides reminders, doesn't block commits
- Git hooks are local-only (not tracked in repo by default)
- Each developer must install the hook manually
