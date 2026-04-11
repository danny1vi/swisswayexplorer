# Tools Registry

Audit date: 2026-04-11

This file is the canonical tool-selection reference for SwissWayExplorer work on the VPS site-factory.

Do not guess tool choice when this file exists.

## Status Legend

- `active-now`: installed and valid for immediate use
- `reference-only`: installed or known, but should guide structure rather than daily execution
- `later`: intentionally deferred until prerequisite phases stabilize

## Registry

### `get-shit-done`

- Status: `active-now`
- Path: `/opt/fabrika/tools/get-shit-done`
- Role: execution protocol for discuss -> plan -> execute -> verify
- Use for: implementation planning, bounded delivery flow, and execution discipline
- Runtime note: codex-facing install should be treated as global workflow infrastructure, not as a project dependency

### `ui-ux-pro-max-skill`

- Status: `active-now`
- Path: `/opt/fabrika/tools/ui-ux-pro-max-skill`
- Role: design direction, hierarchy, typography, color, layout, and UX review
- Use for: homepage redesign, section hierarchy, editorial component patterns, CTA placement, visual system decisions
- Activation note: make available to Codex and Hermes through skill/symlink wiring

### `superpowers`

- Status: `active-now`
- Path: `/opt/fabrika/tools/superpowers`
- Role: task decomposition and bounded phase slicing
- Use for: splitting redesign, CMS, QA, and rollout work into explicit passes
- Runtime note: Codex skill discovery is the preferred integration

### `kalfa`

- Status: `reference-only`
- Path: `/opt/fabrika/tools/kalfa`
- Role: memory and operational discipline reference
- Use for: shaping `docs/`, `memory/`, runbooks, and decision records
- Do not treat as the primary execution protocol for this pilot

### `gsd-2`

- Status: `reference-only`
- Path: `/opt/fabrika/tools/gsd-2`
- Role: longer-horizon planning reference for the multi-site factory
- Use for: future factory planning once the pilot template is stable

### `agent-browser`

- Status: `later`
- Role: browser QA and validation
- Intended path: `/opt/fabrika/tools/agent-browser`
- Activation rule: install only after design and content passes stabilize

### `autoskills`

- Status: `later`
- Role: bootstrap helper for future site creation
- Intended path: `/opt/fabrika/tools/autoskills`
- Activation rule: install when `allswitzerlands` moves from planning into actual bootstrap

### `chatwoot`

- Status: `later`
- Role: communication and inbox layer
- Intended path: `/opt/fabrika/tools/chatwoot`
- Activation rule: install only after content operations and support flow justify it

## Approved Operating Order

### Design pass

- `ui-ux-pro-max-skill`
- `superpowers`
- `get-shit-done`

### Content and CMS pass

- `get-shit-done`
- Sanity workflows
- `kalfa` as structural reference

### QA pass

- runbook and smoke checks first
- `superpowers`
- `agent-browser` after design/content stabilize

### New site creation

- use SwissWayExplorer as the pilot template reference
- use `get-shit-done` for execution flow
- use `ui-ux-pro-max-skill` for design system direction
- extract generic parts only after the pilot is stable

## Current Constraint

The pilot is functional but not yet a clean template baseline.

Current required cleanup priorities:

1. Keep `TOOLS_REGISTRY.md` at the project root
2. Keep docs and memory files aligned with the live repo state
3. Remove stale duplicate top-level Astro files that are outside `src/`
4. Keep live application logic inside `src/`, `public/`, `sanity/`, and `scripts/`
