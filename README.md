# poke-local-setup

This repository is a starter for a local TypeScript/Node MCP-style server.

Primary safety rule: do not delete any files, repos, or anything of that sort without explicit user confirmation. Destructive actions are strictly permission-gated. If a command would delete, overwrite, move, truncate, or otherwise destroy data, it must be blocked until the user explicitly confirms the exact action.

Safety notes:
- Deleting files or repos is forbidden without explicit confirmation.
- Writing or overwriting files is also permission-gated.
- Shell commands like `rm`, `del`, `rmdir`, redirection that overwrites files, and similar destructive actions must never run by default.
- When in doubt, stop and ask the user.

Included files:
- `index.ts` — boilerplate server scaffold with tools for listing files, reading files, and running terminal commands.

This starter is intentionally conservative: destructive operations require an explicit confirmation flag before anything runs.
