# Secrets and Remote Operation Rules

- Never request, print, copy, commit, or write an API token, password, private key, or credential into repository files, logs, issues, prompts, or test fixtures.
- Prefer an already configured credential manager or authenticated CLI for explicitly requested remote work. Do not expose credential status output containing token material.
- Treat credentials pasted into chat or source as compromised; do not reuse or retain them. Direct the credential owner to revoke/rotate them.
- Local workspace access is not automatic authorization to create a remote repository, publish, push, create a release, alter visibility, change permissions, or modify other repositories. Require an explicit request naming the remote action and intended repository/visibility.
- Before any publication, inspect the exact proposed file set and history where available for secrets, machine-local paths, generated artifacts, and licensing blockers.
- Do not run destructive Git operations (`reset --hard`, `clean -fdx`, broad checkout/restore) or delete user data to make a build pass. Preserve untracked and pre-existing changes.
- This checkout currently has no `.git` metadata. Do not invent a commit, branch, remote, or clean-tree status; initializing Git or publishing requires a separately deliberate action.