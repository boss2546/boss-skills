# MayAss — Agentic Engineering Understanding

Date: 2026-08-11
Workspace: /Users/meuu/Desktop/mayass

## What this repository is

MayAss is currently a design/control workspace, not a production implementation repository. Its purpose is to freeze the UI-bound backend contract and control future agents through explicit gates. The current state is documentation-only; no backend/frontend source or test runner exists in the workspace.

## Source-of-truth order

1. Latest direct Boss instruction
2. 02-ui-source-of-truth/design-canvas/
3. 07-decisions/DECISION_LOG.md
4. 03-backend-design/contracts/
5. 04-agentic-engineering/controller-plans/
6. Drafts/reports as historical evidence

## Product boundary

The intended product is a realtime voice HUD with Hermes/Maymint as the brain/runtime. Backend role: runtime state + voice/chat bridge, not a second brain, memory product, dashboard, workflow engine, integration system, or provider/model selector.

Target flow:

Browser UI -> MayAss backend -> Hermes runtime / hermes chat -Q -> UI events/state

UI surfaces observed include: top status bar, five-row telemetry panel, thinking/progress panel, voice orb, user/answer lines, composer/mic, settings drawer, microphone permission/error states, alert banner, barge-in behavior, daily background scene, and drag-hide panels.

## Agentic Engineering protocol

The control loop is:

UI-bound backend contract -> implementation gate -> verification -> review -> Boss decision

Gates defined in AGENTIC_ENGINEERING.md:

- Gate 0: scope + source audit
- Gate 1: contract first
- Gate 2: minimal backend seam
- Gate 3: UI/smoke-client integration
- Gate 4: unit/contract/WebSocket/runtime verification
- Gate 5: diff and UI mapping review
- Gate 6: Boss decisions for unresolved boundaries

Roles: Controller, Backend Contract, Backend Implementation, Verification, Safety Reviewer, UI Mapping Reviewer. The controller must prevent scope creep and collect evidence.

## Contract surface currently documented

Runtime states: idle, listening, thinking, speaking, interrupted, error.

REST: /health, /api/runtime/snapshot, /api/chat, /api/telemetry, /api/settings, /api/voice/barge-in, /api/voice/input-text, and minimum pending-action/decision endpoints. Audio upload is intentionally excluded until STT ownership is decided.

WebSocket: /ws/runtime. Events cover runtime snapshot/state, voice input partial/final, thinking and step progress, response text, speaking lifecycle, interruption, telemetry, alert, and confirmation-required.

Settings: only live controls: four panel visibility flags, mic barge-in enabled/sensitivity, accent color, answer text size, and background FX. SOON settings must remain out of backend v0.1.

Telemetry: exactly the five visible groups: VOICE IN, CONTEXT, MEMORY, DEVICES, UPTIME. Unknown/disabled must be explicit; fake values are forbidden.

Safety: ActionCard can classify/surface risky actions, but v0.1 is plan + confirmation only. No execution without connected confirmation UI and Boss-approved execution phase. Critical actions cannot use confirm_always.

## Important findings from UI source

The design-canvas files are interactive prototypes. Jarvis Main has local state, timer-driven demo cycles, localStorage for microphone permission, browser getUserMedia/analyser RMS detection, drag-hide behavior, and local alert handling. MAYASS Interrupt has three visual interruption variants: CUT (~120/170ms), FADE (~420ms), and BURST (~300ms), with browser-owned mic and sensitivity controls.

The UI currently contains illustrative/static/demo data: SESSION 42, latency values, telemetry 97%/12.4k/ACTIVE/4/42h, model label GEMINI-3.1-FLASH-LIVE, and thinking steps such as email search, Q3 checking, and follow-up task creation. These must not be treated as real backend capabilities or emitted as completed events unless the real operation exists. The UI source itself explicitly says prototype latency is only mic-trigger -> UI reaction and real sessions must replace it with API timing.

## Current readiness

Workspace and contract artifacts exist. Controller plan 000 defines Gates A-D and stop rules. Handoff prompts and verification plan exist. There is no implementation authorization, no Boss resolution for the key architecture questions, and no fresh runtime/test evidence. Therefore implementation readiness is BLOCKED/PARTIAL, not PASS.

## Boss decisions still required

1. Browser or macOS owns primary audio playback?
2. Browser sends final/partial text, or audio to backend for STT?
3. Thinking timeline means real technical steps or honest human-readable coarse stages?
4. Settings sync across browsers/devices?
5. Drag-hide layout local-only or cross-device?
6. Live HUD only or transcript persistence?
7. Is action-card UI in this UI set or deferred?
8. Is remote/mobile out of v1?
9. Latency targets for submit->response, speech-end->thinking, and barge-in->audio-stop?
10. Integrate with an existing MayAss repo or create a separate service first?

## Recommended next gate

Do not implement. First perform a contract reconciliation pass against the exact UI source, especially: remove/mark unbound action endpoints, resolve whether alert and action-card surfaces are actually present in the authoritative UI set, reconcile state/event envelope shapes, and record Boss decisions. Then freeze a contract version and create an implementation-specific controller plan with explicit approval criteria.
