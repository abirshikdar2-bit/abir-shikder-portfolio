# Project Instructions & Agent Guidelines

## Superpowers Framework Integration
This project integrates the **obra/superpowers** engineering methodology with Google Antigravity (`agy`).

### Core Rules & Disciplines:
1. **Skill First (`using-superpowers`)**:
   - Check and activate relevant skills before taking action or writing implementation code.
   - For creative or new features, always activate `brainstorming` before planning.
   - For bugs or unexpected behavior, always activate `systematic-debugging` first.

2. **Planning & Execution**:
   - When building multi-step features, create clear implementation plans (`writing-plans`).
   - Execute step-by-step (`executing-plans` or `subagent-driven-development`).
   - For tasks tracking, use Antigravity Task Artifacts (markdown checklists stored in artifacts directory), updating status as each item completes.

3. **Test-Driven Development & Verification**:
   - Follow `test-driven-development` where applicable.
   - Always run verification checks (`verification-before-completion`) with real execution output before declaring any task complete.

4. **Antigravity Tool Mappings**:
   - Subagents dispatch via `invoke_subagent` (`TypeName: "self"` for full capability, `"research"` for read-only exploration).
   - Task tracking uses task markdown artifacts, not `manage_task` (which is reserved for background shell commands).

---

## Cross-Session Backlog (`todo-harness`)
This project enforces cross-session backlog management via `docs/TODO.md` and Antigravity hooks:
1. **Persistent Backlog**: All project tasks across sessions are tracked in [docs/TODO.md](file:///d:/Abir%20Protfolio/docs/TODO.md).
2. **Permanent Unified `#N` IDs**: Items in `## Backlog` and `## Done` share permanent `#N` IDs. Completed items keep their original numbers when moved to `## Done`.
3. **Multi-Session Locking**:
   - Claim an item before starting: `- CLAIM #N session <session-id> <timestamp> "label"` under `## In Progress`.
   - Release if pausing or stopped early: `- RELEASE #N session <session-id> <timestamp>`.
   - Complete: Delete `CLAIM`/`RELEASE` lines from `## In Progress` and move the item to `## Done` with date in the same edit.
4. **Session Stop Gate**: Any session that modifies files MUST update `docs/TODO.md` before finishing (record unfinished items under `## Backlog`, move completed work to `## Done`).

