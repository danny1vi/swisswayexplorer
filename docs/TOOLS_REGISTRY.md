# Tools Registry

Audit date: 2026-04-11

This file is the canonical tool-selection reference for SwissWayExplorer work. Tool choice is read from this registry, not guessed ad hoc.

## Status Legend

- `active-now`: use immediately in the current delivery flow
- `reference-only`: do not install/wire yet, but use the operating model as guidance
- `later`: valid future tool, deferred until the prerequisite phase is stable
- `missing-local`: mentioned in strategy, but no local repo installation was found during this audit

## Registry

### `get-shit-done`

- Status: `active-now`, `missing-local`
- Role: execution protocol for discuss -> plan -> execute -> verify
- Use for: all engineering, content, and rollout work
- Notes: no local repo was found in the workspace, so treat this as the operating discipline rather than an installed dependency

### `ui-ux-pro-max`

- Status: `active-now`
- Role: design direction, hierarchy, typography, color, layout, and UX review
- Use for: homepage redesign, section hierarchy, CTA placement, editorial component patterns
- Local availability: installed Codex skill at `C:\Users\Hp\.codex\skills\ui-ux-pro-max` and local repo at `C:\Users\Hp\ui-ux-pro-max-skill`
- Current fit: high

### `superpowers`

- Status: `active-now`, `missing-local`
- Role: task decomposition and phase slicing
- Use for: converting large redesign goals into bounded implementation passes
- Notes: no local repo was found, so mirror the method in repo docs/memory until the actual repo is added

### `kalfa`

- Status: `reference-only`, `missing-local`
- Role: memory and operational discipline reference
- Use for: shaping `docs/`, `memory/`, runbooks, and decision records
- Notes: do not install now

### `gsd-2`

- Status: `reference-only`, `missing-local`
- Role: long-range planning reference
- Use for: future multi-site factory planning, not current implementation

### `agent-browser`

- Status: `later`
- Role: browser QA and validation
- Use for: visual QA, regression checks, route smoke checks, mobile/desktop verification
- Local availability: skill footprint exists under Codex plugin temp files
- Activation rule: only after design and content passes stabilize

### `autoskills`

- Status: `later`, `missing-local`
- Role: bootstrap helper for future site creation
- Use for: later multi-site factory work, not the SwissWayExplorer pilot

### `chatwoot`

- Status: `later`, `missing-local`
- Role: customer communication workflows
- Use for: post-content-ops maturity

## Approved Operating Order

### Design pass

- `ui-ux-pro-max`
- `superpowers`
- `get-shit-done`

### Content and CMS pass

- `get-shit-done`
- `kalfa` as structural reference
- Sanity workflows

### QA pass

- `agent-browser` after design/content stabilizes
- `superpowers`
- repo runbooks and smoke checks

## State Continuity Rule

At the start of a resume session:

1. Read `TOOLS_REGISTRY.md`
2. Read `REMEMBERME.md` if it exists
3. Then read project docs and memory files

After any meaningful project-state change, update `REMEMBERME.md` before considering the state fully handed off.

## Current Constraint

The strategy references more repos than are actually present locally. For now:

- use installed/available tooling where present
- encode missing-tool behavior into repo documentation and memory
- avoid blocking SwissWayExplorer on missing repo installs unless they become execution-critical
