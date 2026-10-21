# AI Agents Handoff Protocol

To ensure seamless collaboration without conflicts, agents must follow this handoff sequence:

1. **Task Assignment:** The User (Owner) assigns a specific task (UI, Logic, or Bug fix).
2. **UI/Design Tasks:** Assigned to `Antigravity`. Once done, it leaves the changes in the local workspace and notifies the User.
3. **Logic/Backend Tasks:** Assigned to `Aider` (or `AndroidHarness` as fallback). Aider modifies the code and ensures no syntax errors.
4. **Git & Deployment (The Bridge):** `AndroidHarness` is the ONLY agent allowed to:
   - Check `git status`.
   - Create the branch (e.g., `feature/...` or `fix/...`).
   - Commit with standard messages.
   - Push to GitHub and open the PR.
5. **Review:** The GitHub Action (`ai-reviewer.yml`) automatically reviews the PR.
6. **Merge:** Only the User merges the PR into `main`. Vercel then auto-deploys.

**Golden Rule:** No agent should write code directly to `main`. Code must pass through `AndroidHarness` for Git operations and the GitHub Action for review.
