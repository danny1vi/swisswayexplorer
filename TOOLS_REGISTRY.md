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
- Runtime note: Codex-facing install should be treated as global workflow infrastructure, not as a project dependency

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

### `agent-browser`

- Status: `active-now`
- Path: `/opt/fabrika/tools/agent-browser`
- Role: browser QA and validation
- Use for: browser smoke passes, redirect checks, live rendering validation, and post-deploy QA
- Activation note: QA-only. Do not use it as the primary tool for design or deploy work.

### `kalfa`

- Status: `reference-only`
- Path: `/opt/fabrika/tools/kalfa`
- Role: memory and operational discipline reference
- Use for: shaping `docs/`, `memory/`, runbooks, and decision records
- Do not treat as the primary execution protocol for this pilot

### `kalfa-core`

- Status: `reference-only`
- Path: `/opt/fabrika/tools/kalfa-core`
- Role: lower-level operational and memory discipline reference
- Use for: structural inspiration when hardening memory, ops, and recovery flows
- Do not activate as the primary execution layer unless the project explicitly promotes it

### `gsd-2`

- Status: `reference-only`
- Path: `/opt/fabrika/tools/gsd-2`
- Role: longer-horizon planning reference for the multi-site factory
- Use for: future factory planning once the pilot template is stable

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
- `kalfa` and `kalfa-core` as structural references only

### Deploy pass

- repo state and build verification
- runbook checks
- `get-shit-done`
- deployment command or webhook

### QA pass

- runbook and smoke checks first
- `superpowers`
- `agent-browser`

### New site creation

- use SwissWayExplorer as the pilot template reference
- use `get-shit-done` for execution flow
- use `ui-ux-pro-max-skill` for design system direction
- extract generic parts only after the pilot is stable

## VPS Operational Wrappers

Preferred commands on the VPS:

- `/usr/local/bin/site-factory-design`
- `/usr/local/bin/site-factory-deploy`
- `/usr/local/bin/site-factory-qa`

These wrappers enforce phase-appropriate tool checks and make the current execution stack explicit.
